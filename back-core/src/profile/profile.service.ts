import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(userId: string): Promise<User> {
    if (userId === 'me') {
      console.error('Invalid id "me" passed to findOne');
      throw new NotFoundException('Invalid user ID');
    }
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
}