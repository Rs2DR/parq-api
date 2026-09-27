import type { Database } from '@database/database.types.js';
import { NewUser, User, users } from '@database/schema/users.js';
import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';

@Injectable()
export class UsersRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async findById(id: User['id']): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: {
        id,
      },
    });

    return result ?? null;
  }

  async findByEmail(email: User['email']): Promise<User | null> {
    const result = await this.db.query.users.findFirst({
      where: {
        email,
      },
    });

    return result ?? null;
  }

  async create(data: NewUser): Promise<User> {
    const result = await this.db.insert(users).values(data).returning();

    return result[0];
  }
}
