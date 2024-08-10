import { Module } from '@nestjs/common';
import { UserSeedService } from './seeders/user-seed.service';
import { ConfigModule } from '@nestjs/config';
import { PermissionSeedService } from './seeders/permission-seed.service';
import { TypeAssociationsSeedService } from './seeders/type-association-seed.service';
import { TypeAssociations } from '../type-associations/entities/type-associations.entity';
import { User } from '../users/entities/user.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UsersModule } from '../users/users.module';
import { RoleSeedService } from './seeders/role-seed.service';
import { AssociationSeedService } from './seeders/association-seed.service';
import { DatabaseProvider } from '../utils/database/databaseProvider';
import { validationSchema } from '../utils/config/config';
import { Role } from '../roles/entities/role.entity';
import { Association } from '../associations/entities/association.entity';
import { DatabaseModule } from '../utils/database/database.module';

@Module({
  providers: [
    UserSeedService,
    RoleSeedService,
    PermissionSeedService,
    AssociationSeedService,
    TypeAssociationsSeedService,
    DatabaseProvider,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    DatabaseModule.forRoot([User, Role, Permission, Association, TypeAssociations]),
    UsersModule,
  ],
})
export class SeedModule {
  constructor(
    private typeAssociationsSeedService: TypeAssociationsSeedService,
    private userSeedService: UserSeedService,
    private roleSeedService: RoleSeedService,
    private permissionSeedService: PermissionSeedService,
    private associationSeedService: AssociationSeedService
  ) {}

  async onModuleInit() {
    await this.permissionSeedService.seed();
    await this.roleSeedService.seed();
    await this.typeAssociationsSeedService.seed();
    await this.associationSeedService.seed();
    await this.userSeedService.seed();
  }
}