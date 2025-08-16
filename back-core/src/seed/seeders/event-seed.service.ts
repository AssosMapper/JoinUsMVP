import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { Event } from '../../events/entities/event.entity';
import { Localisation } from '../../localisation/entities/localisation.entity';
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
    @Inject('LOCALISATION_REPOSITORY')
    private readonly localisationRepository: Repository<Localisation>,
  ) {}

  async seed() {
    await this.drop();

    const associations = await this.associationRepository.find({
      relations: ['users'],
    });
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
      {
        street_number: '1',
        street_name: 'Place de la République',
        zip: '75003',
        city: 'Paris',
        country: 'France',
      },
      {
        street_number: '1',
        street_name: 'Place de la Bastille',
        zip: '75004',
        city: 'Paris',
        country: 'France',
      },
      {
        street_number: '1',
        street_name: 'Place de la Nation',
        zip: '75012',
        city: 'Paris',
        country: 'France',
      },
      {
        street_number: '8',
        street_name: "Place de l'Opéra",
        zip: '75009',
        city: 'Paris',
        country: 'France',
      },
    ];

    const descriptions = [
      'Venez nombreux pour soutenir notre cause !',
      'Un événement important pour notre association.',
      'Mobilisation générale pour nos droits !',
      'Une occasion unique de faire entendre notre voix.',
    ];

    // Créer des événements pour chaque association
    for (const association of associations) {
      const numEvents = 10; // 10 événements par association
      
      // Vérifier que l'association a des utilisateurs
      if (!association.users || association.users.length === 0) {
        console.log(`Association ${association.name} has no users, skipping events.`);
        continue;
      }

      for (let i = 0; i < numEvents; i++) {
        const event = new Event();
        event.titre = `Événement ${i + 1} de ${association.name}`;
        event.description =
          descriptions[Math.floor(Math.random() * descriptions.length)];

        // Créer une localisation aléatoire
        const locationData =
          locations[Math.floor(Math.random() * locations.length)];
        const localisation = this.localisationRepository.create(locationData);
        const savedLocalisation =
          await this.localisationRepository.save(localisation);
        event.localisation = savedLocalisation;

        event.association = association;
        event.typeEvent =
          eventTypes[Math.floor(Math.random() * eventTypes.length)];
        // Choisir un utilisateur qui fait partie de l'association
        event.user = association.users[Math.floor(Math.random() * association.users.length)];

        // Dates aléatoires dans les 3 prochains mois
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 90));
        event.date = date;

        event.isPublic = Math.random() > 0.3; // 70% de chances d'être public
        event.isValid = Math.random() > 0.2; // 80% de chances d'être validé

        events.push(event);
      }
    }

    // Créer quelques événements sans association (events publics généraux)
    const numPublicEvents = 5;
    for (let i = 0; i < numPublicEvents; i++) {
      const event = new Event();
      event.titre = `Événement public ${i + 1}`;
      event.description =
        descriptions[Math.floor(Math.random() * descriptions.length)];

      // Créer une localisation aléatoire
      const locationData =
        locations[Math.floor(Math.random() * locations.length)];
      const localisation = this.localisationRepository.create(locationData);
      const savedLocalisation =
        await this.localisationRepository.save(localisation);
      event.localisation = savedLocalisation;

      // Pas d'association
      event.association = null;
      event.typeEvent =
        eventTypes[Math.floor(Math.random() * eventTypes.length)];
      // Utilisateur aléatoire (car pas d'association)
      event.user = users[Math.floor(Math.random() * users.length)];

      // Dates aléatoires dans les 3 prochains mois
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 90));
      event.date = date;

      event.isPublic = true; // Toujours public
      event.isValid = Math.random() > 0.2; // 80% de chances d'être validé

      events.push(event);
    }

    await this.eventRepository.save(events);
    console.log(`Seeded ${events.length} events.`);
  }

  private async drop() {
    await this.eventRepository.delete({});
  }
}
