import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeAssociationsModule } from '../type-associations/type-associations.module';
import { UsersModule } from '../users/users.module';
import { AssociationsController } from './associations.controller';
import { AssociationsService } from './associations.service';
import { AssociationManagerGuard } from './guards/association-manager.guard';
import { AssociationMemberGuard } from './guards/association-member.guard';

@Module({
  imports: [TypeAssociationsModule, UsersModule, NotificationsModule],
  providers: [
    AssociationsService,
    AssociationManagerGuard,
    AssociationMemberGuard,
  ],
  controllers: [AssociationsController],
  exports: [AssociationManagerGuard, AssociationMemberGuard],
})
export class AssociationsModule {}
