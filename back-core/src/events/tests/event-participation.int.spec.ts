import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { Association } from '../../associations/entities/association.entity';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../users/entities/user.entity';
import { EventParticipation } from '../entities/event-participation.entity';
import { Event } from '../entities/event.entity';

describe('EventParticipation Integration Tests', () => {
  let app: INestApplication;
  let authService: AuthService;
  let eventRepository: Repository<Event>;
  let eventParticipationRepository: Repository<EventParticipation>;
  let userRepository: Repository<User>;
  let associationRepository: Repository<Association>;

  const associationManagerEmail = 'associationmanager@test.com';
  let associationManagerToken: string;
  let publicEvent: Event;
  let privateEvent: Event;
  let user: User;
  let association: Association;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    eventRepository = moduleFixture.get('EVENT_REPOSITORY');
    eventParticipationRepository = moduleFixture.get(
      'EVENT_PARTICIPATION_REPOSITORY',
    );
    userRepository = moduleFixture.get('USER_REPOSITORY');
    associationRepository = moduleFixture.get('ASSOCIATION_REPOSITORY');

    associationManagerToken = await authService.generateJwtByEmail(
      associationManagerEmail,
    );

    user = await userRepository.findOne({
      where: { email: associationManagerEmail },
      relations: ['associations'],
    });

    association = user.associations[0];

    try {
      // Créer un événement public pour les tests
      publicEvent = eventRepository.create({
        titre: 'Événement public test',
        description: 'Description test',
        date: new Date(),
        localisation: 'Paris',
        isPublic: true,
        isValid: true,
        association: association,
        user: user,
      });
      await eventRepository.save(publicEvent);

      // Créer un événement privé pour les tests
      privateEvent = eventRepository.create({
        titre: 'Événement privé test',
        description: 'Description test',
        date: new Date(),
        localisation: 'Paris',
        isPublic: false,
        isValid: true,
        association: association,
        user: user,
      });
      await eventRepository.save(privateEvent);
    } catch (error) {
      console.error(
        'Erreur lors de la création des événements de test:',
        error,
      );
    }
  });

  afterAll(async () => {
    // Nettoyer les données de test
    try {
      await eventParticipationRepository.delete({});

      // Vérifier si les événements ont été créés avant de les supprimer
      if (publicEvent?.id) {
        await eventRepository.delete({ id: publicEvent.id });
      }

      if (privateEvent?.id) {
        await eventRepository.delete({ id: privateEvent.id });
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des données de test:', error);
    } finally {
      await app.close();
    }
  });

  describe('POST /events/participate', () => {
    it('Devrait permettre à un utilisateur de participer à un événement public', async () => {
      // Vérifier que l'événement public a été créé correctement
      expect(publicEvent).toBeDefined();
      expect(publicEvent.id).toBeDefined();

      const response = await request(app.getHttpServer())
        .post('/events/participate')
        .set('Authorization', `Bearer ${associationManagerToken}`)
        .send({ eventId: publicEvent.id })
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined();

      // Vérifier que la participation a bien été enregistrée
      const participation = await eventParticipationRepository.findOne({
        where: {
          event: { id: publicEvent.id },
          user: { id: user.id },
        },
      });

      expect(participation).toBeDefined();
    });

    it("Ne devrait pas permettre à un utilisateur de participer à un événement privé s'il ne fait pas partie de l'association", async () => {
      // Créer une autre association pour tester
      const otherAssociation = associationRepository.create({
        name: 'Autre association',
        description: 'Description',
      });
      await associationRepository.save(otherAssociation);

      // Créer un événement privé pour cette association
      const otherEvent = eventRepository.create({
        titre: 'Événement privé autre association',
        description: 'Description test',
        date: new Date(),
        localisation: 'Paris',
        isPublic: false,
        isValid: true,
        association: otherAssociation,
        user: user,
      });
      await eventRepository.save(otherEvent);

      // Tenter de participer à l'événement privé
      await request(app.getHttpServer())
        .post('/events/participate')
        .set('Authorization', `Bearer ${associationManagerToken}`)
        .send({ eventId: otherEvent.id })
        .expect(HttpStatus.FORBIDDEN); // Forbidden

      // Nettoyer
      await eventRepository.delete({ id: otherEvent.id });
      await associationRepository.delete({ id: otherAssociation.id });
    });

    it("Ne devrait pas permettre à un utilisateur de participer s'il est déjà inscrit", async () => {
      // Vérifier que l'événement privé a été créé correctement
      expect(privateEvent).toBeDefined();
      expect(privateEvent.id).toBeDefined();

      // D'abord participer à l'événement
      await request(app.getHttpServer())
        .post('/events/participate')
        .set('Authorization', `Bearer ${associationManagerToken}`)
        .send({ eventId: privateEvent.id })
        .expect(HttpStatus.CREATED);

      // Tenter de participer à nouveau
      await request(app.getHttpServer())
        .post('/events/participate')
        .set('Authorization', `Bearer ${associationManagerToken}`)
        .send({ eventId: privateEvent.id })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /events/:id/participants', () => {
    it("Devrait interdire l'accès à la liste des participants si l'utilisateur ne participe pas à l'événement", async () => {
      // Créer un nouvel événement pour ce test
      const testEvent = eventRepository.create({
        titre: 'Événement test participants',
        description: 'Description test',
        date: new Date(),
        localisation: 'Paris',
        isPublic: true,
        isValid: true,
        association: association,
        user: user,
      });
      await eventRepository.save(testEvent);

      // Tenter d'accéder aux participants sans être participant
      await request(app.getHttpServer())
        .get(`/events/${testEvent.id}/participants`)
        .set('Authorization', `Bearer ${associationManagerToken}`)
        .expect(HttpStatus.FORBIDDEN);

      // Nettoyer
      await eventRepository.delete({ id: testEvent.id });
    });

    it("Devrait autoriser l'accès à la liste des participants si l'utilisateur participe à l'événement", async () => {
      expect(publicEvent).toBeDefined();
      expect(publicEvent.id).toBeDefined();

      const participation = await eventParticipationRepository.findOne({
        where: {
          event: { id: publicEvent.id },
          user: { id: user.id },
        },
      });
      expect(participation).toBeDefined();

      // Accéder aux participants avec succès
      const response = await request(app.getHttpServer())
        .get(`/events/${publicEvent.id}/participants`)
        .set('Authorization', `Bearer ${associationManagerToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});
