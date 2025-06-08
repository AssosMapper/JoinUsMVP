import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from '@shared/dto/user.dto';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { AuthService } from '../../auth/auth.service';
import { User } from '../entities/user.entity';

describe('Users Integration Tests', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userRepository: Repository<User>;

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
        await userRepository.delete({ id: testUser.id });
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
        email: 'jane.smith.test@example.com',
      };

      await request(app.getHttpServer())
        .put('/users/me')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send(updateUserDto)
        .expect(HttpStatus.OK);

      // Vérifier que les changements ont été persistés
      const updatedUser = await userRepository.findOne({
        where: { id: testUser.id },
      });
      expect(updatedUser.first_name).toBe('Jane');
      expect(updatedUser.last_name).toBe('Smith');
      expect(updatedUser.email).toBe('jane.smith.test@example.com');
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
          .send(conflictUpdateDto)
          .expect(HttpStatus.CONFLICT);

        expect(response.body.message).toContain(
          "Un utilisateur avec l'email another.user@example.com existe déjà",
        );
      } finally {
        // Nettoyer l'utilisateur créé pour ce test
        await userRepository.delete({ id: anotherUser.id });
      }
    });
  });
});
