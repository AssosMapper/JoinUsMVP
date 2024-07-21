import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}