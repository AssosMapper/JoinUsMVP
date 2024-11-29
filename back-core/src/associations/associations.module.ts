import { Module } from '@nestjs/common';
import { DatabaseModule } from '@src/utils/database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeAssociationsModule } from '../type-associations/type-associations.module';
import { UsersModule } from '../users/users.module';
import { AssociationsController } from './associations.controller';
import { AssociationsService } from './associations.service';
import { AssociationManagerGuard } from './guards/association-manager.guard';

@Module({
  imports: [
    TypeAssociationsModule,
    UsersModule,
    DatabaseModule,
    NotificationsModule,
  ],
  providers: [AssociationsService, AssociationManagerGuard],
  controllers: [AssociationsController],
  exports: [AssociationManagerGuard],
})
export class AssociationsModule {}
