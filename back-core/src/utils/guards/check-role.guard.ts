import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { checkRole } from '../functions/check-role';
import { RoleEnum } from '@shared/types';

export const CheckRole = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class CheckRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (roles.length === 0)
      throw new UnauthorizedException('Aucun role trouvé');

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) throw new UnauthorizedException('Utilisateur non trouvé');

    const isAdmin = roles.some((role) => checkRole(user, RoleEnum.SUPER_ADMIN));
    if (isAdmin) return true;

    const isAllowed = roles.some((role) => checkRole(user, role));
    if (!isAllowed) throw new UnauthorizedException('Accès refusé');
    return true;
  }
}
