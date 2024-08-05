import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../permissions/entities/permission.entity';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Injectable()
export class RoleSeedService {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
    @Inject('DATA_SOURCE')
    private readonly datasource: DataSource,
  ) {}

  async seed() {
    await this.drop();

    const superPermission = await this.permissionRepository.findOne({
      where: { permission: '*' },
    });

    if (!superPermission) {
      console.log('Permission * not found');
      return;
    }

    const allPermissions = await this.permissionRepository.find();
    const excludedPermissions = ['typeevents', 'typeassociation', 'user'];
    const associationManagerPermissions = allPermissions.filter(
      (perm) => !excludedPermissions.some((excl) => perm.permission.startsWith(excl)),
    );

    const eventPermissions = allPermissions.filter(
      (perm) => perm.permission.startsWith('events'),
    );

    // Create roles
    const roles = [] as Array<Role>;

    let role = new Role();
    role.name = 'SuperAdmin';
    role.permissions = [superPermission];
    roles.push(role);

    role = new Role();
    role.name = 'AssociationManager';
    role.permissions = associationManagerPermissions;
    roles.push(role);

    role = new Role();
    role.name = 'EventsManager';
    role.permissions = eventPermissions;
    roles.push(role);

    console.log('Seeding roles...');
    await this.roleRepository.save(roles);
    console.log('Seeded roles...');
  }

  async drop() {
    console.log('Dropping roles...');
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`DELETE FROM user_roles_role`);
      await queryRunner.query(`DELETE FROM role`);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    console.log('Dropped roles...');
  }
}
