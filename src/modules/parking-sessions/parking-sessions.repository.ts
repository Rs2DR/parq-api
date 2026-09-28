import { type Database } from '@infrastructure/database/database.types.js';
import {
  NewParkingSession,
  ParkingSession,
  parkingSessions,
} from '@infrastructure/database/schema/parking-sessions.js';
import { parkingSpots } from '@infrastructure/database/schema/parking-spots.js';
import { userDevices } from '@infrastructure/database/schema/user-devices.js';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class ParkingSessionsRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async findSessionForNotification(sessionId: ParkingSession['id']) {
    const [result] = await this.db
      .select({
        sessionId: parkingSessions.id,
        status: parkingSessions.status,
        fcmToken: userDevices.fcmToken,
      })
      .from(parkingSessions)
      .innerJoin(userDevices, eq(userDevices.userId, parkingSessions.userId))
      .where(eq(parkingSessions.id, sessionId))
      .limit(1);

    return result ?? null;
  }

  async startSessionTx(data: NewParkingSession) {
    return this.db.transaction(async (tx) => {
      const [parkingSpot] = await tx
        .update(parkingSpots)
        .set({ isOccupied: true })
        .where(
          and(
            eq(parkingSpots.id, data.parkingSpotId),
            eq(parkingSpots.isOccupied, false),
          ),
        )
        .returning({
          id: parkingSpots.id,
        });

      if (!parkingSpot) {
        const [existingSpot] = await tx
          .select({
            id: parkingSpots.id,
          })
          .from(parkingSpots)
          .where(eq(parkingSpots.id, data.parkingSpotId))
          .limit(1);

        if (!existingSpot) {
          throw new NotFoundException(
            'The specified parking space was not found',
          );
        }

        throw new ConflictException(
          'The selected parking space is already occupied',
        );
      }

      const [session] = await tx
        .insert(parkingSessions)
        .values(data)
        .returning();

      if (!session) {
        throw new Error('Failed to create parking session');
      }

      return session;
    });
  }

  async finishSessionTx(sessionId: ParkingSession['id']) {
    return this.db.transaction(async (tx) => {
      const [session] = await tx
        .select({
          id: parkingSessions.id,
          parkingSpotId: parkingSessions.parkingSpotId,
          status: parkingSessions.status,
        })
        .from(parkingSessions)
        .where(eq(parkingSessions.id, sessionId))
        .limit(1);

      if (!session) {
        throw new NotFoundException(`Parking session ${sessionId} not found`);
      }

      if (session.status !== 'active') {
        return session;
      }

      const [updatedSession] = await tx
        .update(parkingSessions)
        .set({
          status: 'completed',
        })
        .where(
          and(
            eq(parkingSessions.id, session.id),
            eq(parkingSessions.status, 'active'),
          ),
        )
        .returning();

      if (!updatedSession) {
        throw new Error(`Failed to finish parking session ${sessionId}`);
      }

      await tx
        .update(parkingSpots)
        .set({
          isOccupied: false,
        })
        .where(
          and(
            eq(parkingSpots.id, session.parkingSpotId),
            eq(parkingSpots.isOccupied, true),
          ),
        );

      return updatedSession;
    });
  }
}
