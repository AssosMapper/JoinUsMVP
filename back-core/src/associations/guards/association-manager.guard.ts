import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RoleEnum } from '@shared/types/roles';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { checkRole } from '../../utils/functions/check-role';

@Injectable()
export class AssociationManagerGuard implements CanActivate {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const associationId = request.params.associationId || request.params.id;

    // Charger l'utilisateur avec ses relations
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'associations'],
    });
    // SuperAdmin peut tout faire
    if (checkRole(user, RoleEnum.SUPER_ADMIN)) return true;

    // Pour la création d'association (POST sans associationId), vérifier seulement le rôle
    if (!associationId && request.method === 'POST') {
      if (checkRole(user, RoleEnum.ASSOCIATION_MANAGER)) {
        return true;
      }
    }
    // rechercher l'association dans les associations de l'utilisateur
    const isAssociationMember = user.associations.some(
        (association) => association.id === associationId,
    );

    const isAssociationManager =
      checkRole(user, RoleEnum.ASSOCIATION_MANAGER) && isAssociationMember;

    if (!isAssociationManager) {
      throw new ForbiddenException({
        message:
          "Vous n'avez pas les permissions nécessaires pour gérer cette association. Vous devez être gestionnaire et membre de l'association.",
      });
    }

    return true;
  }
}
