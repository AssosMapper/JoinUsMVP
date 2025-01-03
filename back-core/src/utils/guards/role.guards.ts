import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '@shared/types/roles';
import { checkRole } from '../functions/check-role';

// Décorateurs pour les métadonnées
export const AllowRole = (...roles: string[]) =>
  SetMetadata('allowRoles', roles);
export const DisallowRole = (...roles: string[]) =>
  SetMetadata('disallowRoles', roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupération des métadonnées des différents décorateurs
    const allowRoles = this.reflector.get<string[]>(
      'allowRoles',
      context.getHandler(),
    );
    const disallowRoles = this.reflector.get<string[]>(
      'disallowRoles',
      context.getHandler(),
    );

    // Si aucun décorateur n'est utilisé, on autorise l'accès
    if (!allowRoles && !disallowRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    //check si le user a le role admin
    if (checkRole(user, RoleEnum.SUPER_ADMIN)) return true;

    // Vérification pour @AllowRole (doit avoir au moins un des rôles)
    if (allowRoles && !allowRoles.some((role) => checkRole(user, role)))
      return false;

    // Vérification pour @DisallowRole (ne doit avoir aucun des rôles)
    if (disallowRoles && disallowRoles.some((role) => checkRole(user, role)))
      return false;

    return true;
  }
}
