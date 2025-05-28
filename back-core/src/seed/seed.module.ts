import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '../utils/config/config';
import { DatabaseModule } from '../utils/database/database.module'; // Ajoutez cet import
import { DatabaseProvider } from '../utils/database/databaseProvider';
// Ajoutez les imports des entités
import { Media } from '@src/media/entities/media.entity';
import { MediaModule } from '@src/media/media.module';
import { AssociationApplication } from '../association-applications/entities/association-application.entity';
import { Association } from '../associations/entities/association.entity';
import { Event } from '../events/entities/event.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { TypeAssociations } from '../type-associations/entities/type-associations.entity';
import { TypeEvents } from '../type-events/entities/type-events.entity';
import { User } from '../users/entities/user.entity';
import { AssociationApplicationSeedService } from './seeders/association-application-seed.service';
import { AssociationSeedService } from './seeders/association-seed.service';
import { EventSeedService } from './seeders/event-seed.service';
import { NotificationSeedService } from './seeders/notification-seed.service';
import { PermissionSeedService } from './seeders/permission-seed.service';
import { RoleSeedService } from './seeders/role-seed.service';
import { TypeAssociationsSeedService } from './seeders/type-association-seed.service';
import { TypeEventsSeedService } from './seeders/type-event-seed.service';
import { UserSeedService } from './seeders/user-seed.service';
// ... autres imports de seeders

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
    DatabaseModule.forRoot([
      User,
      Role,
      Association,
      Event,
      Media,
      TypeEvents,
      TypeAssociations,
      AssociationApplication,
      Notification,
      Permission,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    MediaModule,
  ],
})
export class SeedModule {}
