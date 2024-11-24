import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { Event } from '../../events/entities/event.entity';
import { TypeEvents } from '../../type-events/entities/type-events.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class EventSeedService {
  constructor(
    @Inject('EVENT_REPOSITORY')
    private readonly eventRepository: Repository<Event>,
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
    @Inject('TYPE_EVENTS_REPOSITORY')
    private readonly typeEventsRepository: Repository<TypeEvents>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    await this.drop();

    const associations = await this.associationRepository.find();
    const eventTypes = await this.typeEventsRepository.find();
    const users = await this.userRepository.find();

    if (!associations.length || !eventTypes.length || !users.length) {
      console.log(
        'No associations, event types or users found. Skipping Event seeding.',
      );
      return;
    }

    const events = [];
    const locations = [
      'Place de la République, Paris',
      'Place de la Bastille, Paris',
      'Place de la Nation, Paris',
      "Place de l'Opéra, Paris",
    ];

    const descriptions = [
      'Venez nombreux pour soutenir notre cause !',
      'Un événement important pour notre association.',
      'Mobilisation générale pour nos droits !',
      'Une occasion unique de faire entendre notre voix.',
    ];

    // Créer des événements pour chaque association
    for (const association of associations) {
      const numEvents = Math.floor(Math.random() * 3) + 2; // 2-4 événements par association

      for (let i = 0; i < numEvents; i++) {
        const event = new Event();
        event.titre = `Événement ${i + 1} de ${association.name}`;
        event.description =
          descriptions[Math.floor(Math.random() * descriptions.length)];
        event.localisation =
          locations[Math.floor(Math.random() * locations.length)];
        event.association = association;
        event.typeEvent =
          eventTypes[Math.floor(Math.random() * eventTypes.length)];
        event.user = users[Math.floor(Math.random() * users.length)];

        // Dates aléatoires dans les 3 prochains mois
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 90));
        event.date = date;

        event.isPublic = Math.random() > 0.3; // 70% de chances d'être public
        event.isValid = Math.random() > 0.2; // 80% de chances d'être validé

        events.push(event);
      }
    }

    await this.eventRepository.save(events);
    console.log(`Seeded ${events.length} events.`);
  }

  private async drop() {
    await this.eventRepository.delete({});
  }
}
