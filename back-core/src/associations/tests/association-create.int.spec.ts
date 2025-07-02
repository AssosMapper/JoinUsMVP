import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Association } from '../entities/association.entity';
import { User } from '../../users/entities/user.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { CreateAssociationDto } from '@shared/dto/associations.dto';
import { CreateLocalisationDto } from '@shared/dto/localisation.dto';
import { AssociationsModule } from '../associations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Media } from '../../media/entities/media.entity';
import { Localisation } from '../../localisation/entities/localisation.entity';
import { MediaModule } from '../../media/media.module';
import { LocalisationModule } from '../../localisation/localisation.module';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { TypeAssociationsModule } from '../../type-associations/type-associations.module';
import { NotificationsModule } from '../../notifications/notifications.module';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '@shared/types/roles';

describe('Association Create (Integration)', () => {
  let app: INestApplication;
  let associationRepository: Repository<Association>;
  let userRepository: Repository<User>;
  let typeAssociationRepository: Repository<TypeAssociations>;
  let jwtService: JwtService;
  let authToken: string;
  let testUser: User;
  let testTypeAssociation: TypeAssociations;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Association, User, TypeAssociations, Media, Localisation],
          synchronize: true,
        }),
        AssociationsModule,
        AuthModule,
        UsersModule,
        TypeAssociationsModule,
        MediaModule,
        LocalisationModule,
        NotificationsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    associationRepository = moduleFixture.get('ASSOCIATION_REPOSITORY');
    userRepository = moduleFixture.get('USER_REPOSITORY');
    typeAssociationRepository = moduleFixture.get(
      'TYPE_ASSOCIATIONS_REPOSITORY',
    );
    jwtService = moduleFixture.get(JwtService);

    // Créer un utilisateur de test avec le rôle ASSOCIATION_MANAGER
    testUser = await userRepository.save({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@test.com',
      password: 'hashedpassword',
      roles: [{ name: RoleEnum.ASSOCIATION_MANAGER }],
    });

    // Créer un type d'association de test
    testTypeAssociation = await typeAssociationRepository.save({
      name: 'Sport',
      description: 'Association sportive',
    });

    // Générer un token JWT pour l'utilisateur
    authToken = jwtService.sign({
      userId: testUser.id,
      email: testUser.email,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    // Nettoyer les associations créées après chaque test
    await associationRepository.delete({});
  });

  describe('POST /associations', () => {
    it('should create a new association successfully', async () => {
      const localisationDto: CreateLocalisationDto = {
        street_number: '123',
        street_name: 'Rue de la Paix',
        zip: '75001',
        city: 'Paris',
        country: 'France',
      };

      const createAssociationDto: CreateAssociationDto = {
        name: 'Association Test',
        description: 'Une association de test',
        isPublic: true,
        typeIds: [testTypeAssociation.id],
        localisation: localisationDto,
      };

      const response = await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createAssociationDto)
        .expect(201);

      expect(response.body).toMatchObject({
        name: 'Association Test',
        description: 'Une association de test',
        isPublic: true,
      });

      expect(response.body.id).toBeDefined();
      expect(response.body.localisation).toContain('Paris');
      expect(response.body.types).toHaveLength(1);
      expect(response.body.types[0].name).toBe('Sport');

      // Vérifier que l'association a été créée en base
      const savedAssociation = await associationRepository.findOne({
        where: { id: response.body.id },
        relations: ['users', 'types'],
      });

      expect(savedAssociation).toBeDefined();
      expect(savedAssociation.users).toHaveLength(1);
      expect(savedAssociation.users[0].id).toBe(testUser.id);
    });

    it('should return 409 for duplicate association name', async () => {
      const localisationDto: CreateLocalisationDto = {
        street_number: '789',
        street_name: 'Boulevard Saint-Germain',
        zip: '75006',
        city: 'Paris',
        country: 'France',
      };

      const createAssociationDto: CreateAssociationDto = {
        name: 'Association Unique',
        description: 'Première association',
        isPublic: true,
        typeIds: [testTypeAssociation.id],
        localisation: localisationDto,
      };

      // Créer la première association
      await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createAssociationDto)
        .expect(201);

      // Tenter de créer une association avec le même nom
      const duplicateDto = {
        ...createAssociationDto,
        description: 'Deuxième association (dupliquée)',
      };

      const response = await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send(duplicateDto)
        .expect(409);

      expect(response.body.message).toContain('Association Unique');
    });

    it('should return 401 for unauthorized user', async () => {
      const createAssociationDto = {
        name: 'Association Non Autorisée',
        description: 'Description',
        isPublic: true,
        typeIds: [testTypeAssociation.id],
      };

      await request(app.getHttpServer())
        .post('/associations')
        .send(createAssociationDto)
        .expect(401);
    });
  });
});
