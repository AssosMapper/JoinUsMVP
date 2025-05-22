import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleEnum } from '@shared/types';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../entities/event.entity';

@Injectable()
export class IsPublicGuard implements CanActivate {
  constructor(
    @Inject('EVENT_REPOSITORY')
    private eventRepository: Repository<Event>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const eventId = request.params.id || request.body.eventId;
    const userId = request.user.userId;

    if (!eventId)
      throw new NotFoundException("L'identifiant de l'événement est requis");

    // Trouver l'événement
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['association'],
    });

    if (!event)
      throw new NotFoundException(`Événement avec l'ID ${eventId} non trouvé`);
    if (event.isPublic) return true;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'associations'],
    });

    if (!user)
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);

    const isSuperAdmin = user.roles.some(
      (role) => role.name === RoleEnum.SUPER_ADMIN,
    );

    if (isSuperAdmin) return true;

    const isAssociationMember = user.associations.some(
      (association) => association.id === event.association.id,
    );
    if (!isAssociationMember) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à participer à cet événement privé",
      );
    }

    return true;
  }
}
