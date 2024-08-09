import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { OnDev } from '../../utils/decorators/on-dev.decorator';
import { faker } from '@faker-js/faker';
import { hashPassword } from '../../utils/functions';

@Injectable()
export class UserSeedService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
  ) {}

  @OnDev()
  async seed() {
    await this.drop();
    const users = [];
    // for (let i = 0; i < 100; i++) {
    //   const user = new User();
    //   user.first_name = faker.person.firstName();
    //   user.last_name = faker.person.lastName();
    //   user.email = faker.internet.email();
    //   user.phone = faker.phone.number();
    //   user.password = faker.internet.password();
    //   users.push(user);
    // }

    // Create SuperAdmin user
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
    users.push(user);

    // Create AssociationManager user
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

    // Create EventsManager user
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
