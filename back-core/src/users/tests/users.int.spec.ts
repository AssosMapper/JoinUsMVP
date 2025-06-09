import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveLocalisationDto } from '@shared/dto/localisation.dto';
import { UpdateUserDto } from '@shared/dto/user.dto';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { AuthService } from '../../auth/auth.service';
import { Localisation } from '../../localisation/entities/localisation.entity';
import { User } from '../entities/user.entity';

describe('Users Integration Tests', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userRepository: Repository<User>;
  let localisationRepository: Repository<Localisation>;

  let testUser: User;
  let testUserToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    userRepository = moduleFixture.get('USER_REPOSITORY');
    localisationRepository = moduleFixture.get('LOCALISATION_REPOSITORY');

    // Créer un utilisateur de test
    testUser = userRepository.create({
      first_name: 'Test',
      last_name: 'User',
      email: 'test.user@example.com',
      password: 'hashedPassword',
      phone: '0123456789',
    });
    await userRepository.save(testUser);

    // Générer un token pour l'utilisateur de test
    testUserToken = await authService.generateJwtByEmail(testUser.email);
  });

  afterAll(async () => {
    // Nettoyer les données de test
    try {
      if (testUser?.id) {
        // Récupérer l'utilisateur avec sa localisation
        const userWithLocalisation = await userRepository.findOne({
          where: { id: testUser.id },
          relations: ['localisation'],
        });

        const localisationId = userWithLocalisation?.localisation?.id;

        // D'abord dissocier la localisation de l'utilisateur
        if (userWithLocalisation?.localisation) {
          userWithLocalisation.localisation = null;
          await userRepository.save(userWithLocalisation);
        }

        // Ensuite supprimer l'utilisateur
        await userRepository.delete({ id: testUser.id });

        // Enfin supprimer la localisation si elle existait
        if (localisationId) {
          await localisationRepository.delete({ id: localisationId });
        }
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des données de test:', error);
    } finally {
      await app.close();
    }
  });

  describe('PUT /users/me', () => {
    it('Devrait mettre à jour un utilisateur avec succès', async () => {
      const updateUserDto: UpdateUserDto = {
        first_name: 'Jane',
        last_name: 'Smith',
        email: testUser.email,
      };

      await request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ user: updateUserDto })
        .expect(HttpStatus.OK);

      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });
      expect(updatedUser.first_name).toBe('Jane');
      expect(updatedUser.last_name).toBe('Smith');
    });

    it("Devrait retourner une erreur si l'email existe déjà pour un autre utilisateur", async () => {
      // Créer un autre utilisateur
      const anotherUser = userRepository.create({
        first_name: 'Another',
        last_name: 'User',
        email: 'another.user@example.com',
        password: 'hashedPassword',
        phone: '0987654321',
      });
      await userRepository.save(anotherUser);

      try {
        // Tenter de mettre à jour testUser avec l'email d'anotherUser
        const conflictUpdateDto: UpdateUserDto = {
          email: 'another.user@example.com',
        };

        const response = await request(app.getHttpServer())
          .put('/users/me')
          .set('Authorization', `Bearer ${testUserToken}`)
          .send({ user: conflictUpdateDto })
          .expect(HttpStatus.CONFLICT);

        expect(response.body.message).toContain(
          "Un utilisateur avec l'email another.user@example.com existe déjà",
        );
      } finally {
        await userRepository.delete({ id: anotherUser.id });
      }
    });

    it("Devrait mettre à jour la localisation de l'utilisateur", async () => {
      // Nettoyer d'abord toute localisation existante
      const existingUser = await userRepository.findOne({
        where: { id: testUser.id },
        relations: ['localisation'],
      });
      if (existingUser?.localisation) {
        existingUser.localisation = null;
        await userRepository.save(existingUser);
      }

      const localisationDto: SaveLocalisationDto = {
        street_number: '123',
        street_name: 'Rue de la Paix',
        zip: '75001',
        city: 'Paris',
        country: 'France',
      };

      await request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ localisation: localisationDto })
        .expect(HttpStatus.OK);

      // Vérifier que la localisation a été créée et associée
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
        relations: ['localisation'],
      });

      expect(updatedUser.localisation).toBeDefined();
      expect(updatedUser.localisation.street_number).toBe('123');
      expect(updatedUser.localisation.street_name).toBe('Rue de la Paix');
      expect(updatedUser.localisation.zip).toBe('75001');
      expect(updatedUser.localisation.city).toBe('Paris');
      expect(updatedUser.localisation.country).toBe('France');

      // Maintenant tester la mise à jour de la localisation existante
      const updatedLocalisationDto: SaveLocalisationDto = {
        id: updatedUser.localisation.id, // Inclure l'ID de la localisation existante
        street_number: '456',
        street_name: 'Avenue Montaigne',
        zip: '75008',
        city: 'Paris',
        country: 'France',
      };

      await request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ localisation: updatedLocalisationDto })
        .expect(HttpStatus.OK);

      // Vérifier que la localisation a été mise à jour (même ID, nouvelles valeurs)
      const finalUser = await userRepository.findOne({
        where: { id: testUser.id },
        relations: ['localisation'],
      });

      expect(finalUser.localisation.id).toBe(updatedUser.localisation.id); // Même ID
      expect(finalUser.localisation.street_number).toBe('456');
      expect(finalUser.localisation.street_name).toBe('Avenue Montaigne');
      expect(finalUser.localisation.zip).toBe('75008');
    });

    it('Devrait mettre à jour les informations utilisateur sans modifier la localisation', async () => {
      // D'abord nettoyer et créer une localisation propre pour ce test
      const userBeforeTest = await userRepository.findOne({
        where: { id: testUser.id },
        relations: ['localisation'],
      });
      if (userBeforeTest?.localisation) {
        userBeforeTest.localisation = null;
        await userRepository.save(userBeforeTest);
      }

      // Créer une localisation spécifique pour ce test
      const localisationDto: SaveLocalisationDto = {
        street_number: '789',
        street_name: 'Boulevard Saint-Michel',
        zip: '75005',
        city: 'Paris',
        country: 'France',
      };

      await request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ localisation: localisationDto })
        .expect(HttpStatus.OK);

      // Récupérer la localisation initiale avec son ID
      const userWithInitialLocalisation = await userRepository.findOne({
        where: { id: testUser.id },
        relations: ['localisation'],
      });
      const initialLocalisation = userWithInitialLocalisation.localisation;

      // Mettre à jour seulement les informations utilisateur
      const updateUserDto: UpdateUserDto = {
        first_name: 'UpdatedName',
        last_name: 'UpdatedLastName',
      };

      await request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ user: updateUserDto })
        .expect(HttpStatus.OK);

      // Vérifier que l'utilisateur a été mis à jour mais pas la localisation
      const finalUser = await userRepository.findOne({
        where: { id: testUser.id },
        relations: ['localisation'],
      });

      expect(finalUser.first_name).toBe('UpdatedName');
      expect(finalUser.last_name).toBe('UpdatedLastName');
      expect(finalUser.localisation.id).toBe(initialLocalisation.id);
      expect(finalUser.localisation.street_number).toBe('789');
      expect(finalUser.localisation.street_name).toBe('Boulevard Saint-Michel');
    });
  });
});
