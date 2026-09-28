import { type Database } from '@database/database.types.js';
import {
  NewParkingSession,
  parkingSessions,
} from '@database/schema/parking-sessions.js';
import { parkingSpots } from '@database/schema/parking-spots.js';
import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { eq } from 'drizzle-orm';

@Injectable()
export class ParkingSessionsRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async startSessionTx(data: NewParkingSession) {
    return this.db.transaction(async (tx) => {
      const [session] = await tx
        .insert(parkingSessions)
        .values(data)
        .returning();

      await tx
        .update(parkingSpots)
        .set({ isOccupied: true })
        .where(eq(parkingSpots.id, data.parkingSpotId));

      return session;
    });
  }
}
