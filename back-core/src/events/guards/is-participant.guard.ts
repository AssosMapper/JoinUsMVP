import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { EventParticipation } from '../entities/event-participation.entity';
import { Event } from '../entities/event.entity';

@Injectable()
export class IsParticipantGuard implements CanActivate {
  constructor(
    @Inject('EVENT_PARTICIPATION_REPOSITORY')
    private eventParticipationRepository: Repository<EventParticipation>,
    @Inject('EVENT_REPOSITORY')
    private eventRepository: Repository<Event>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const eventId = request.params.id;
    const userId = request.user.userId || request.user.id;

    if (!eventId)
      throw new NotFoundException("L'identifiant de l'événement est requis");

    if (!userId)
      throw new NotFoundException("L'utilisateur doit être authentifié");

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event)
      throw new NotFoundException(`Événement avec l'ID ${eventId} non trouvé`);

    const participation = await this.eventParticipationRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });

    if (!participation) {
      throw new ForbiddenException(
        'Vous devez participer à cet événement pour voir la liste des participants',
      );
    }

    return true;
  }
}
