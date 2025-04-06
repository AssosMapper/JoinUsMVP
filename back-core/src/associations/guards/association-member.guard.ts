import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { RoleEnum } from '@shared/types/roles';
import { checkRole } from '@src/utils/functions/check-role';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AssociationMemberGuard implements CanActivate {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const associationId = request.params.associationId || request.params.id;

    if (!userId || !associationId) {
      throw new ForbiddenException('Accès non autorisé');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['associations', 'roles'],
    });

    if (!user) throw new ForbiddenException('Utilisateur non trouvé');

    if (checkRole(user, RoleEnum.SUPER_ADMIN)) return true;

    const isMember = user.associations.some(
      (association) => association.id === associationId,
    );

    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre de cette association pour accéder à cette ressource',
      );
    }

    return true;
  }
}
