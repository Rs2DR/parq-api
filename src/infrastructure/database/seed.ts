import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as dotenv from 'dotenv';
import * as schema from './schema/index.js';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle({ client: pool });

async function main() {
  console.log('⏳ Clearing data...');
  await db.execute(
    `TRUNCATE TABLE parking_sessions, parking_spots, parking_lots, vehicles, users RESTART IDENTITY CASCADE;`,
  );

  console.log('🌱 Injecting Belarusian parking lots data...');

  const [lot1, lot2, lot3] = await db
    .insert(schema.parkingLots)
    .values([
      {
        name: 'Galleria Minsk Mall Parking (Pobediteley Ave 9)',
        latitude: '53.9085000',
        longitude: '27.5486000',
        pricePerHour: 300,
      },
      {
        name: 'Nemiga 3 Shopping Center Parking (Nemiga St 3)',
        latitude: '53.9024000',
        longitude: '27.5501000',
        pricePerHour: 400,
      },
      {
        name: 'Open Parking Lot near Railway Station (Bobruiskaya St 4)',
        latitude: '53.8901000',
        longitude: '27.5512000',
        pricePerHour: 250,
      },
    ])
    .returning();

  console.log('🌱 Injecting parking spots...');

  const spots = [
    { parkingLotId: lot1.id, spotNumber: 'A-1', isOccupied: false },
    { parkingLotId: lot1.id, spotNumber: 'A-2', isOccupied: true },
    { parkingLotId: lot1.id, spotNumber: 'A-3', isOccupied: false },
    { parkingLotId: lot2.id, spotNumber: 'B-1', isOccupied: false },
    { parkingLotId: lot2.id, spotNumber: 'B-2', isOccupied: false },
    { parkingLotId: lot3.id, spotNumber: 'C-1', isOccupied: false },
  ];

  await db.insert(schema.parkingSpots).values(spots);

  console.log('✅ Base records seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => pool.end());
