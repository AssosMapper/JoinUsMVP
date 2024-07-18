import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from './entities/association.entity';
import { AssociationsService } from './associations.service';
import { AssociationsController } from './associations.controller';
import { User } from '../users/entities/user.entity';
import { TypeAssociationsModule } from '../type-associations/type-associations.module';  // Importer le module
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeAssociationsModule,
    UsersModule
  ],
  providers: [AssociationsService],
  controllers: [AssociationsController]
})
export class AssociationsModule {}
