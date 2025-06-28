import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { Media } from '../../media/entities/media.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
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

      // Créer d'abord tous les médias
      const baseAssociations = [
        {
          name: 'Urgence Palestine',
          localisation: '11 boulevard Voltaire, 75004 Paris, France',
          description: 'From River to the Sea, Palestine will be free',
          imageFilename: 'freepalestine.png',
          types: [],
        },
        // ... autres associations de base
      ];

      // Créer les médias pour toutes les associations
      const mediaMap = new Map<string, Media>();

      // Créer les médias pour les associations de base
      for (const baseAssoc of baseAssociations) {
        const media = await this.createDefaultMedia(baseAssoc.imageFilename);
        mediaMap.set(baseAssoc.imageFilename, media);
      }

      // Créer les médias pour les associations générées
      for (const type of types) {
        const mediaFilename = `${type.name.toLowerCase()}.png`;
        const media = await this.createDefaultMedia(mediaFilename);
        mediaMap.set(mediaFilename, media);
      }

      // Créer les associations avec les médias correspondants
      const associationsToCreate = types.map((type) => {
        const association = new Association();
        association.name = `join-us-${type.name.toLowerCase()}`;
        association.localisation = 'Localisation par défaut';
        association.description = `Association pour ${type.name.toLowerCase()}`;
        const mediaFilename = `${type.name.toLowerCase()}.png`;
        association.image = mediaMap.get(mediaFilename)!;
        association.types = [type];
        association.applicationQuestion =
          questions[Math.floor(Math.random() * questions.length)];
        return association;
      });

      baseAssociations.forEach((baseAssoc) => {
        const association = new Association();
        association.name = baseAssoc.name;
        association.localisation = baseAssoc.localisation;
        association.description = baseAssoc.description;
        association.image = mediaMap.get(baseAssoc.imageFilename)!;
        association.types = baseAssoc.types;
        associationsToCreate.push(association);
      });

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
    media.size = 0; // Taille fictive pour le seed
    media.isPublic = true;
    return this.mediaRepository.save(media);
  }
}
