import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { In, Not, Repository } from 'typeorm';
import { Association } from '../entities/association.entity';
import { User } from '../../users/entities/user.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { CreateAssociationDto } from '@shared/dto/associations.dto';
import { SaveLocalisationDto } from '@shared/dto/localisation.dto';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '@shared/types/roles';
import { AppModule } from '@src/app.module';
import { v4 as uuidv4 } from 'uuid';

describe('Association Create (Integration)', () => {
  let app: INestApplication;
  let associationRepository: Repository<Association>;
  let userRepository: Repository<User>;
  let typeAssociationRepository: Repository<TypeAssociations>;
  let jwtService: JwtService;

  let basicUser: User;
  let associationManagerUser: User;
  let basicUserToken: string;
  let associationManagerToken: string;
  let testTypeAssociation: TypeAssociations;
  let createdAssociationIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

    // Récupérer les utilisateurs existants
    basicUser = await userRepository.findOne({
      where: {
        roles: {
          name: Not(In([RoleEnum.SUPER_ADMIN, RoleEnum.ASSOCIATION_MANAGER])),
        },
      },
      relations: ['roles'],
    });

    associationManagerUser = await userRepository.findOne({
      where: {
        roles: { name: RoleEnum.ASSOCIATION_MANAGER },
      },
      relations: ['roles'],
    });

    if (!basicUser || !associationManagerUser) {
      throw new Error(
        "Les utilisateurs requis n'existent pas dans la base de données",
      );
    }

    // Créer un type d'association unique pour tous les tests
    testTypeAssociation = await typeAssociationRepository.save({
      name: `Sport-${uuidv4()}`,
      description: 'Association sportive',
    });

    // Générer les tokens JWT
    basicUserToken = jwtService.sign({
      userId: basicUser.id,
      email: basicUser.email,
    });

    associationManagerToken = jwtService.sign({
      userId: associationManagerUser.id,
      email: associationManagerUser.email,
    });
  }, 10000);

  afterEach(async () => {
    // Nettoyer uniquement les associations créées dans ce test
    if (createdAssociationIds.length > 0) {
      try {
        const associations = await associationRepository.find({
          where: { id: In(createdAssociationIds) },
          relations: ['users', 'types'],
        });

        for (const association of associations) {
          association.users = [];
          association.types = [];
          await associationRepository.save(association);
        }

        await associationRepository.delete(createdAssociationIds);
        createdAssociationIds = [];
      } catch (error) {
        // Ignorer les erreurs de nettoyage
      }
    }
  });

  afterAll(async () => {
    // Nettoyer le type d'association créé
    try {
      if (testTypeAssociation?.id) {
        await typeAssociationRepository.delete({ id: testTypeAssociation.id });
      }
    } catch (error) {
      // Ignorer les erreurs de nettoyage
    }
    await app.close();
  });

  describe('POST /associations', () => {
    it('should create a new association successfully when user is associationManager', async () => {
      const { associationData, localisationData } = generateData();

      const response = await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${associationManagerToken}`)
        .field('association', JSON.stringify(associationData))
        .field('localisation', JSON.stringify(localisationData))
        .expect(HttpStatus.CREATED);

      console.log(response.body);
      // Ajouter l'ID de l'association créée pour le nettoyage
      createdAssociationIds.push(response.body.id);

      expect(response.body.name).toBe(associationData.name);
      expect(response.body.id).toBeDefined();
    });

    /*it('should not create a new association when user is not association manager', async () => {
      const { associationData, localisationData } = generateData();

      await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${basicUserToken}`)
        .send({
          association: associationData,
          localisation: localisationData,
        })
        .expect(HttpStatus.FORBIDDEN);
    });*/

    /*it('should create association without localisation', async () => {
      const { associationData } = generateData();

      const response = await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          association: associationData,
        })
        .expect(201);

      expect(response.body).toMatchObject({
        name: 'Association Test',
        description: 'Une association de test',
        isPublic: true,
      });

      expect(response.body.id).toBeDefined();
      expect(response.body.types).toHaveLength(1);
    });*/

    /*   it('should return 409 for duplicate association name', async () => {
      const { associationData, localisationData } = generateData();

      await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          association: associationData,
          localisation: localisationData,
        })
        .expect(201);

      const duplicateAssociationData = {
        ...associationData,
        description: 'Deuxième association (dupliquée)',
      };

      const response = await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          association: duplicateAssociationData,
          localisation: localisationData,
        })
        .expect(409);

      expect(response.body.message).toContain('Association Test');
    }); */

    /* it('should return 401 for unauthorized user', async () => {
      const { associationData } = generateData();

      await request(app.getHttpServer())
        .post('/associations')
        .send({
          association: associationData,
        })
        .expect(401);
    });

    it('should return 400 for invalid association data', async () => {
      const invalidAssociationData = {
        name: '',
        description: 'Description',
        isPublic: true,
        typeIds: [testTypeAssociation.id],
      };

      await request(app.getHttpServer())
        .post('/associations')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          association: invalidAssociationData,
        })
        .expect(400);
    });*/
  });

  function generateData() {
    const associationData: CreateAssociationDto = {
      name: `Association-${uuidv4()}`,
      description: 'Une association de test',
      isPublic: true,
      typeIds: [testTypeAssociation.id],
      applicationQuestion: 'Pourquoi voulez-vous rejoindre cette association ?',
    };

    const localisationData: SaveLocalisationDto = {
      street_number: '123',
      street_name: 'Rue de la Paix',
      zip: '75001',
      city: 'Paris',
      country: 'France',
    };

    return {
      associationData,
      localisationData,
    };
  }
});
