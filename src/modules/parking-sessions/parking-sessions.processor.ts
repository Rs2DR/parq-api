import { Injectable } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import type { Job } from 'bullmq';
import {
  PARKING_SESSION_JOBS,
  PARKING_SESSIONS_QUEUE,
} from '@infrastructure/queue/queue.constants.js';
import { ParkingSession } from '@infrastructure/database/schema/parking-sessions.js';
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
        await this.finishParkingSession(job.data.sessionId);
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

    if (!session || session.status !== 'active') {
      return;
    }

    await this.firebaseService.sendNotification(
      session.fcmToken,
      'Парковка заканчивается',
      'До окончания парковки осталось 15 минут',
      {
        type: 'parking-session-ending',
        sessionId,
      },
    );
  }

  private async finishParkingSession(
    sessionId: ParkingSession['id'],
  ): Promise<void> {
    await this.parkingSessionsService.finishSession(sessionId);
  }
}
