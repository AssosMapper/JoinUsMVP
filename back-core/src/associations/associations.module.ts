import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { TypeOrmModule } from '@nestjs/typeorm';
import { Association } from './entities/association.entity';
import { AssociationsService } from './associations.service';
import { AssociationsController } from './associations.controller';
import { User } from '../users/entities/user.entity';
import { TypeAssociationsModule } from '../type-associations/type-associations.module';  // Importer le module
import { UsersModule } from '../users/users.module';
=======
import { DatabaseModule } from '@src/utils/database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeAssociationsModule } from '../type-associations/type-associations.module';
import { UsersModule } from '../users/users.module';
import { AssociationsController } from './associations.controller';
import { AssociationsService } from './associations.service';
import { AssociationManagerGuard } from './guards/association-manager.guard';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

@Module({
  imports: [
    TypeAssociationsModule,
<<<<<<< HEAD
    UsersModule
  ],
  providers: [AssociationsService],
  controllers: [AssociationsController]
=======
    UsersModule,
    DatabaseModule,
    NotificationsModule,
  ],
  providers: [AssociationsService, AssociationManagerGuard],
  controllers: [AssociationsController],
  exports: [AssociationManagerGuard],
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
})
export class AssociationsModule {}
