import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AssociationApplication } from '../association-applications/entities/association-application.entity';
import { Association } from '../associations/entities/association.entity';
import { Event } from '../events/entities/event.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { TypeAssociations } from '../type-associations/entities/type-associations.entity';
import { TypeEvents } from '../type-events/entities/type-events.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { validationSchema } from '../utils/config/config';
import { DatabaseModule } from '../utils/database/database.module';
import { DatabaseProvider } from '../utils/database/databaseProvider';
import { AssociationApplicationSeedService } from './seeders/association-application-seed.service';
import { AssociationSeedService } from './seeders/association-seed.service';
import { EventSeedService } from './seeders/event-seed.service';
import { NotificationSeedService } from './seeders/notification-seed.service';
import { PermissionSeedService } from './seeders/permission-seed.service';
import { RoleSeedService } from './seeders/role-seed.service';
import { TypeAssociationsSeedService } from './seeders/type-association-seed.service';
import { TypeEventsSeedService } from './seeders/type-event-seed.service';
import { UserSeedService } from './seeders/user-seed.service';
import { Media } from '@src/media/entities/media.entity';

@Module({
  providers: [
    UserSeedService,
    RoleSeedService,
    PermissionSeedService,
    AssociationSeedService,
    TypeAssociationsSeedService,
    TypeEventsSeedService,
    DatabaseProvider,
    AssociationApplicationSeedService,
    EventSeedService,
    NotificationSeedService,
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    DatabaseModule.forRoot([
      User,
      Role,
      Permission,
      Association,
      TypeAssociations,
      TypeEvents,
      AssociationApplication,
      Event,
      Notification,
      Media,
    ]),
    UsersModule,
  ],
})
export class SeedModule {}
