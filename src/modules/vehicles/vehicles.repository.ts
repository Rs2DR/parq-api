import { type Database } from '@database/database.types.js';
import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';

@Injectable()
export class VehiclesRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}
}
