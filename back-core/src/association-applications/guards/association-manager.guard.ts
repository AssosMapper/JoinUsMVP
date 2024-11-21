import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RoleEnum } from '@shared/types/roles';
import { checkRole } from '../../utils/functions/check-role';

@Injectable()
export class AssociationManagerGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const associationId = request.params.associationId || request.params.id;

    // SuperAdmin peut tout faire
    if (checkRole(user, RoleEnum.SUPER_ADMIN)) {
      return true;
    }

    // Vérifie si l'utilisateur est manager et membre de l'association
    const isAssociationManager =
      checkRole(user, RoleEnum.ASSOCIATION_MANAGER) &&
      user.associations.some((assoc) => assoc.id === associationId);

    if (!isAssociationManager) {
      throw new ForbiddenException({
        message:
          "Vous n'avez pas les permissions nécessaires pour gérer cette association. Vous devez être gestionnaire et membre de l'association.",
      });
    }

    return true;
  }
}
