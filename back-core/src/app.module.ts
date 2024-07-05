import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module'; 
import { AssociationsModule } from './associations/associations.module';
import { Association } from './associations/association.entity';
import { EventsModule } from './events/events.module';
import { TypeEventsModule } from './type-events/type-events.module';
import { Event } from './events/event.entity';
import { TypeEvents } from './type-events/type-events.entity';
import { TypeAssociationsModule } from './type-associations/type-associations.module';
import { TypeAssociations } from './type-associations/type-associations.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', 
      port: 3306,
      username: 'join_us_mvp_admin',
      password: 'SN384yGAETYrwsxJd6tLcM',
      database: 'join_us_mvp',
      entities: [User, Association, Event, TypeEvents, TypeAssociations, Role], 
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AssociationsModule,
    EventsModule,
    TypeEventsModule,
    TypeAssociationsModule,
    AuthModule,
    RolesModule
  ],
})
export class AppModule {}
