import { Inject, Injectable } from '@nestjs/common';
<<<<<<< HEAD
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
=======
import { Repository } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
import { OnDev } from '../../utils/decorators/on-dev.decorator';
import { hashPassword } from '../../utils/functions';

@Injectable()
export class UserSeedService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
<<<<<<< HEAD
=======
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  ) {}

  @OnDev()
  async seed() {
    await this.drop();
    const users = [];

<<<<<<< HEAD
=======
    // Récupérer toutes les associations
    const associations = await this.associationRepository.find();

    // Create SuperAdmin user
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    const superAdminRole = await this.roleRepository.findOne({
      where: { name: 'SuperAdmin' },
    });
    if (!superAdminRole) {
      console.log('Role SuperAdmin not found');
      return;
    }
    let user = new User();
    user.first_name = 'Admin';
    user.last_name = 'Admin';
    user.email = 'admin@test.com';
    user.password = await hashPassword('Password123!');
    user.roles = [superAdminRole];
<<<<<<< HEAD
    users.push(user);

=======
    user.associations = associations; // L'admin est membre de toutes les associations
    users.push(user);

    // Create AssociationManager user
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    const associationManagerRole = await this.roleRepository.findOne({
      where: { name: 'AssociationManager' },
    });
    if (!associationManagerRole) {
      console.log('Role AssociationManager not found');
      return;
    }
    user = new User();
    user.first_name = 'Manager';
    user.last_name = 'Association';
    user.email = 'associationmanager@test.com';
    user.password = await hashPassword('Password123!');
    user.roles = [associationManagerRole];
    users.push(user);

<<<<<<< HEAD
=======
    // Create EventsManager user
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    const eventsManagerRole = await this.roleRepository.findOne({
      where: { name: 'EventsManager' },
    });
    if (!eventsManagerRole) {
      console.log('Role EventsManager not found');
      return;
    }
    user = new User();
    user.first_name = 'Events';
    user.last_name = 'Manager';
    user.email = 'eventsmanager@test.com';
    user.password = await hashPassword('Password123!');
    user.roles = [eventsManagerRole];
    users.push(user);

    console.log('Seeding users...');
    await this.userRepository.save(users);
    console.log('Seeded users...');
  }

  private async drop() {
    console.log('Dropping users...');
    await this.userRepository.delete({});
    console.log('Dropped users...');
  }
}
