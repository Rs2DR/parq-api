import { type Database } from '@infrastructure/database/database.types.js';
import {
  NewParkingSession,
  PARKING_SESSION_STATUS,
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
import { and, eq, sql } from 'drizzle-orm';
import { PARKING_SESSION_ERRORS } from './parking-sessions.constants.js';

@Injectable()
export class ParkingSessionsRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async findSessionForNotification(sessionId: ParkingSession['id']) {
    const [result] = await this.db
      .select({
        sessionId: parkingSessions.id,
        status: parkingSessions.status,
        fcmTokens: sql<string[]>`
        COALESCE(
          array_agg(${userDevices.fcmToken})
          FILTER (WHERE ${userDevices.fcmToken} IS NOT NULL),
          ARRAY[]::text[]
        )
      `,
      })
      .from(parkingSessions)
      .leftJoin(userDevices, eq(userDevices.userId, parkingSessions.userId))
      .where(eq(parkingSessions.id, sessionId))
      .groupBy(parkingSessions.id, parkingSessions.status)
      .limit(1);

    return result ?? null;
  }

  async startSessionTx(data: NewParkingSession) {
    return this.db.transaction(async (tx) => {
      const [existingSession] = await tx
        .select()
        .from(parkingSessions)
        .where(
          eq(parkingSessions.stripePaymentIntentId, data.stripePaymentIntentId),
        )
        .limit(1);

      if (existingSession) {
        return existingSession;
      }

      const [parkingSpot] = await tx
        .update(parkingSpots)
        .set({
          isOccupied: true,
        })
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
          throw new NotFoundException(PARKING_SESSION_ERRORS.SPOT_NOT_FOUND);
        }

        throw new ConflictException(PARKING_SESSION_ERRORS.SPOT_OCCUPIED);
      }

      const [session] = await tx
        .insert(parkingSessions)
        .values(data)
        .returning();

      if (!session) {
        throw new Error(PARKING_SESSION_ERRORS.PARKING_SESSION_CREATE_FAILED);
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
        throw new NotFoundException(
          PARKING_SESSION_ERRORS.PARKING_SESSION_NOT_FOUND,
        );
      }

      if (session.status !== PARKING_SESSION_STATUS.ACTIVE) {
        return session;
      }

      const [updatedSession] = await tx
        .update(parkingSessions)
        .set({
          status: PARKING_SESSION_STATUS.COMPLETED,
        })
        .where(
          and(
            eq(parkingSessions.id, sessionId),
            eq(parkingSessions.status, PARKING_SESSION_STATUS.ACTIVE),
          ),
        )
        .returning();

      if (!updatedSession) {
        return session;
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
