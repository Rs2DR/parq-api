import { Injectable } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import {
  PARKING_SESSION_JOBS,
  PARKING_SESSIONS_QUEUE,
} from '@infrastructure/queue/queue.constants.js';
import { FirebaseService } from '@modules/firebase/firebase.service.js';
import { ParkingSessionsService } from './parking-sessions.service.js';

@Injectable()
@Processor(PARKING_SESSIONS_QUEUE)
export class ParkingSessionsProcessor extends WorkerHost {
  constructor(
    private readonly parkingSessionsService: ParkingSessionsService,
    private readonly firebaseService: FirebaseService,
  ) {
    super();
  }

  async process(
    job: Job<{
      sessionId: string;
    }>,
  ) {
    switch (job.name) {
      case PARKING_SESSION_JOBS.SEND_ENDING_REMINDER:
        await this.sendEndingReminder(job.data.sessionId);
        return;

      case PARKING_SESSION_JOBS.FINISH:
        await this.parkingSessionsService.finishSession(job.data.sessionId);
        return;

      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Parking session job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error) {
    console.error(`Parking session job ${job?.id} failed`, error);
  }
  private async sendEndingReminder(sessionId: string): Promise<void> {
    const session =
      await this.parkingSessionsService.getSessionForNotification(sessionId);

    console.log('SESSION FOR NOTIFICATION:', session);

    if (!session || session.status !== 'active') {
      console.log('Notification skipped');
      return;
    }

    const tokens = session.fcmTokens.filter(Boolean);

    if (tokens.length === 0) {
      console.log('No FCM tokens found');
      return;
    }

    for (const token of tokens) {
      console.log('SENDING FCM TO:', token);

      await this.firebaseService.sendNotification(
        token,
        'Parking ending',
        'There are 59 minutes left until your parking session ends',
        {
          type: 'parking-session-ending',
          sessionId,
        },
      );
    }

    console.log('FCM SENT');
  }
}
