import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { Media } from '../../media/entities/media.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { Localisation } from '../../localisation/entities/localisation.entity';
import { OnDev } from '../../utils/decorators/on-dev.decorator';
import { ASSOCIATION_PICTURE_PATH } from '@src/media/enums/media.enum';

@Injectable()
export class AssociationSeedService {
  constructor(
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
    @Inject('TYPE_ASSOCIATIONS_REPOSITORY')
    private readonly typeAssociationsRepository: Repository<TypeAssociations>,
    @Inject('DATA_SOURCE')
    private readonly datasource: DataSource,
    @Inject('MEDIA_REPOSITORY')
    private mediaRepository: Repository<Media>,
    @Inject('LOCALISATION_REPOSITORY')
    private localisationRepository: Repository<Localisation>,
  ) {
    console.log('AssociationSeedService initialized');
  }

  @OnDev()
  async seed() {
    console.log('Starting seed method...');
    await this.drop();

    try {
      console.log('Retrieving types...');
      const types = await this.typeAssociationsRepository.find();
      console.log('Types retrieved:', types);

      const questions = [
        "Quel anecdote avez vous avec l'association ?",
        'Quel est le mot de passe et par qui il est donné ?',
      ];

      const baseAssociations = [
        {
          name: 'Urgence Palestine',
          localisation: {
            street_number: '11',
            street_name: 'boulevard Voltaire',
            zip: '75004',
            city: 'Paris',
            country: 'France',
          },
          description: 'From River to the Sea, Palestine will be free',
          imageFilename: 'freepalestine.png',
          types: [],
        },
      ];

      const mediaMap = new Map<string, Media>();

      for (const baseAssoc of baseAssociations) {
        const media = await this.createDefaultMedia(baseAssoc.imageFilename);
        mediaMap.set(baseAssoc.imageFilename, media);
      }

      const associationsToCreate = [];

      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const association = new Association();
        association.name = `join-us-${type.name.toLowerCase()}`;

        if (i % 2 === 0) {
          association.localisation = await this.createDefaultLocalisation();
        }

        const media = await this.createDefaultMedia(association.name);
        association.description = `Association pour ${type.name.toLowerCase()}`;
        association.image = media;
        association.types = [type];
        association.applicationQuestion =
          questions[Math.floor(Math.random() * questions.length)];
        associationsToCreate.push(association);
      }

      for (const baseAssoc of baseAssociations) {
        const association = new Association();
        association.name = baseAssoc.name;

        const localisation = await this.localisationRepository.save(
          baseAssoc.localisation,
        );
        association.localisation = localisation;

        association.description = baseAssoc.description;
        association.image = mediaMap.get(baseAssoc.imageFilename)!;
        association.types = baseAssoc.types;
        associationsToCreate.push(association);
      }

      if (associationsToCreate.length > 0) {
        console.log('Seeding associations...');
        await this.associationRepository.save(associationsToCreate);
        console.log('Seeded associations:', associationsToCreate);
      }
    } catch (error) {
      console.error('Error during seeding:', error);
      throw error;
    }
  }

  async drop() {
    console.log('Dropping associations created by types...');
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(
        `DELETE FROM association_types_type_associations WHERE associationId IN (SELECT id FROM association WHERE name LIKE 'join-us-%')`,
      );
      await queryRunner.query(
        `DELETE FROM association WHERE name LIKE 'join-us-%'`,
      );
      await queryRunner.commitTransaction();
      console.log('Dropped associations created by types...');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createDefaultMedia(filename: string): Promise<Media> {
    const media = new Media();
    media.filename = filename;
    media.filepath = ASSOCIATION_PICTURE_PATH + `/${filename}`;
    media.mimetype = 'image/png';
    media.size = 0;
    media.isPublic = true;
    return this.mediaRepository.save(media);
  }

  async createDefaultLocalisation(): Promise<Localisation> {
    const localisation = new Localisation();
    localisation.street_number = '1';
    localisation.street_name = 'Rue de la République';
    localisation.zip = '75001';
    localisation.city = 'Paris';
    localisation.country = 'France';
    return this.localisationRepository.save(localisation);
  }
}
