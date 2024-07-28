import { Module } from '@nestjs/common';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AssociationsModule } from './associations/associations.module';
import { Association } from './associations/entities/association.entity';
import { EventsModule } from './events/events.module';
import { TypeEventsModule } from './type-events/type-events.module';
import { Event } from './events/entities/event.entity';
import { TypeEvents } from './type-events/entities/type-events.entity';
import { TypeAssociationsModule } from './type-associations/type-associations.module';
import { TypeAssociations } from './type-associations/entities/type-associations.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { DatabaseModule } from './utils/database/database.module';
import { validationSchema } from './utils/config/config';
import { PermissionsModule } from './permissions/permissions.module';
import { Permission } from './permissions/entities/permission.entity';
import {
  MediaModule
} from "./media/media.module";
import {Media} from "./media/entities/media.entity";

@Module({
  imports: [
    DatabaseModule.forRoot([User, Association, Event, TypeEvents, TypeAssociations,Permission, Role,Media]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    UsersModule,
    AssociationsModule,
    EventsModule,
    TypeEventsModule,
    TypeAssociationsModule,
    PermissionsModule,
    AuthModule,
    RolesModule,
      MediaModule
  ],
})
export class AppModule {}
