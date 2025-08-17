import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleEnum } from '@shared/types';
import { checkRole } from '@src/utils/functions/check-role';
import { Repository } from 'typeorm';
import { AssociationsService } from '../../associations/associations.service';
import { User } from '../../users/entities/user.entity';
import { Event } from '../entities/event.entity';

@Injectable()
export class CanUpdateEventGuard implements CanActivate {
  constructor(
    @Inject('EVENT_REPOSITORY')
    private eventRepository: Repository<Event>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private associationsService: AssociationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    const eventId = request.params.id;

    if (!userId || !eventId) throw new ForbiddenException('Accès non autorisé');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    if (checkRole(user, RoleEnum.SUPER_ADMIN)) return true;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['association', 'user'],
    });

    if (!event) throw new NotFoundException('Événement non trouvé');

    if (event.association) {
      const isInAssociation = await this.associationsService.isInAssociation(
        user.id,
        event.association.id,
      );
      const isEventManager = checkRole(user, RoleEnum.EVENTS_MANAGER);

      if (isInAssociation && isEventManager) return true;
    }

    if (event.user.id === userId) return true;
    throw new ForbiddenException(
      'Vous ne pouvez pas mettre à jour cet événement',
    );
  }
}
