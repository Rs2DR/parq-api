import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { NewUser, User } from '../../infrastructure/database/schema/users.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: User['id']) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: User['email']) {
    return this.usersRepository.findByEmail(email);
  }

  async createUser(data: NewUser) {
    const existingUser = await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.usersRepository.create(data);
  }

  async getProfile(id: User['id']) {
    const user = await this.findById(id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async registerDevice(userId: User['id'], fcmToken: string) {
    return this.usersRepository.registerDevice(userId, fcmToken);
  }

  async removeDevice(userId: User['id'], fcmToken: string) {
    return this.usersRepository.removeDevice(userId, fcmToken);
  }
}
