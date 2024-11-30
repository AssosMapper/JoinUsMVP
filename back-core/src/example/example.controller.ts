import { Controller, Get } from '@nestjs/common';
import { AllowRole, DisallowRole } from '../utils/guards/role.guards';

@Controller('example')
export class ExampleController {
  @Get('admin-or-manager')
  @AllowRole('ADMIN', 'MANAGER')
  adminOrManagerRoute() {
    return 'Cette route nécessite le rôle ADMIN ou MANAGER';
  }

  @Get('not-banned-or-suspended')
  @DisallowRole('BANNED', 'SUSPENDED')
  notBannedRoute() {
    return 'Cette route est inaccessible aux utilisateurs bannis ou suspendus';
  }

  @Get('admin-not-banned')
  @AllowRole('ADMIN')
  @DisallowRole('BANNED')
  adminNotBannedRoute() {
    return 'Cette route nécessite le rôle ADMIN et ne doit pas être banni';
  }
}
