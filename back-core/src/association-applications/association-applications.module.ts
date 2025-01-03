import { Module } from '@nestjs/common';
import { AssociationsModule } from '../associations/associations.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { AssociationApplicationsController } from './association-applications.controller';
import { AssociationApplicationsService } from './association-applications.service';

@Module({
  imports: [UsersModule, AssociationsModule, NotificationsModule],
  controllers: [AssociationApplicationsController],
  providers: [AssociationApplicationsService],
  exports: [AssociationApplicationsService],
})
export class AssociationApplicationsModule {}
