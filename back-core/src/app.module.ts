<<<<<<< HEAD
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
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
import { MediaModule } from "./media/media.module";
import { Media } from "./media/entities/media.entity";
import { LoggingMiddleware } from './utils/middlewares/logging.middleware';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { LoggingInterceptor } from './utils/logging.interceptor';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    DatabaseModule.forRoot([User, Association, Event, TypeEvents, TypeAssociations, Permission, Role, Media]),
=======
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AssociationApplicationsModule } from './association-applications/association-applications.module';
import { AssociationApplication } from './association-applications/entities/association-application.entity';
import { AssociationsModule } from './associations/associations.module';
import { Association } from './associations/entities/association.entity';
import { AuthModule } from './auth/auth.module';
import { Event } from './events/entities/event.entity';
import { EventsModule } from './events/events.module';
import { Media } from './media/entities/media.entity';
import { MediaModule } from './media/media.module';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationsModule } from './notifications/notifications.module';
import { Permission } from './permissions/entities/permission.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { ProfileModule } from './profile/profile.module';
import { Role } from './roles/entities/role.entity';
import { RolesModule } from './roles/roles.module';
import { TypeAssociations } from './type-associations/entities/type-associations.entity';
import { TypeAssociationsModule } from './type-associations/type-associations.module';
import { TypeEvents } from './type-events/entities/type-events.entity';
import { TypeEventsModule } from './type-events/type-events.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AllExceptionsFilter } from './utils/all-exceptions.filter';
import { validationSchema } from './utils/config/config';
import { DatabaseModule } from './utils/database/database.module';
import { RoleGuard } from './utils/guards/role.guards';
import { LoggingInterceptor } from './utils/logging.interceptor';
import { LoggingMiddleware } from './utils/middlewares/logging.middleware';

@Module({
  imports: [
    DatabaseModule.forRoot([
      User,
      Association,
      Event,
      TypeEvents,
      TypeAssociations,
      Permission,
      Role,
      Media,
      AssociationApplication,
      Notification,
    ]),
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
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
    MediaModule,
<<<<<<< HEAD
    ProfileModule
=======
    ProfileModule,
    AssociationApplicationsModule,
    NotificationsModule,
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
<<<<<<< HEAD
=======
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
