import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from './association.entity';
import { AssociationsService } from './associations.service';
import { AssociationsController } from './associations.controller';
import { User } from '../users/user.entity';
import { TypeAssociationsModule } from '../type-associations/type-associations.module';  // Importer le module
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Association, User]),
    TypeAssociationsModule,
    UsersModule
  ],
  providers: [AssociationsService],
  controllers: [AssociationsController]
})
export class AssociationsModule {}
