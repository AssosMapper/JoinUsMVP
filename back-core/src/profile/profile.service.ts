import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(userId: string): Promise<User> {
    if (userId === 'me') {
      console.error('ID invalide "me" passé à findOne');
      throw new NotFoundException('ID utilisateur invalide');
    }
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'associations'],
    });
    if (!user) {
      throw new NotFoundException(
        `L'utilisateur avec l'ID ${userId} n'a pas été trouvé`,
      );
    }
    return user;
  }
}
