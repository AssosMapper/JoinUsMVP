import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
<<<<<<< HEAD
    @Inject('USER_REPOSITORY') private readonly usersRepository: Repository<User>,
=======
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>,
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  ) {}

  async findOne(userId: string): Promise<User> {
    if (userId === 'me') {
<<<<<<< HEAD
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
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
