import { Inject, Injectable } from '@nestjs/common';
<<<<<<< HEAD
import { Repository, DataSource } from 'typeorm';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { Association } from '../../associations/entities/association.entity';
=======
import { DataSource, Repository } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

@Injectable()
export class TypeAssociationsSeedService {
  constructor(
    @Inject('TYPE_ASSOCIATIONS_REPOSITORY')
    private readonly typeAssociationsRepository: Repository<TypeAssociations>,
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
    @Inject('DATA_SOURCE')
    private readonly datasource: DataSource,
  ) {}

  async seed() {
    console.log('Starting TypeAssociations seed...');

    await this.drop();

    const types = [
<<<<<<< HEAD
      { name: "Écologie", description: "Associations engagées pour la protection de l'environnement." },
      { name: "Droits sociaux", description: "Associations défendant les droits sociaux et l'égalité." },
      { name: "Santé", description: "Associations œuvrant pour l'accès à la santé pour tous." },
      { name: "Droits humains", description: "Associations promouvant et défendant les droits humains." }
    ];

    const typeEntities = types.map(type => {
=======
      {
        name: 'Écologie',
        description:
          "Associations engagées pour la protection de l'environnement.",
      },
      {
        name: 'Droits sociaux',
        description: "Associations défendant les droits sociaux et l'égalité.",
      },
      {
        name: 'Santé',
        description: "Associations œuvrant pour l'accès à la santé pour tous.",
      },
      {
        name: 'Droits humains',
        description: 'Associations promouvant et défendant les droits humains.',
      },
    ];

    const typeEntities = types.map((type) => {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      const typeEntity = new TypeAssociations();
      typeEntity.name = type.name;
      typeEntity.description = type.description;
      return typeEntity;
    });

    console.log('Seeding type associations...', typeEntities);
    await this.typeAssociationsRepository.save(typeEntities);
    console.log('Seeded type associations...');

    const createdTypes = await this.typeAssociationsRepository.find();

<<<<<<< HEAD
    const associationsToCreate = createdTypes.map(type => {
      const association = new Association();
      association.name = `Join-us-${type.name.toLowerCase()}`;
      association.localisation = "Default Location";
      association.description = `Association pour ${type.name.toLowerCase()}`;
      association.image = `${type.name.toLowerCase()}.png`;
=======
    const associationsToCreate = createdTypes.map((type) => {
      const association = new Association();
      association.name = `Join-us-${type.name.toLowerCase()}`;
      association.localisation = 'Default Location';
      association.description = `Association pour ${type.name.toLowerCase()}`;
      association.image = null;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      association.types = [type];
      return association;
    });

    console.log('Seeding associations...', associationsToCreate);
    await this.associationRepository.save(associationsToCreate);
    console.log('Seeded associations...');
  }

  async drop() {
    console.log('Dropping type associations and related associations...');
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
<<<<<<< HEAD
      await queryRunner.query(`DELETE FROM association_types_type_associations`);
=======
      await queryRunner.query(
        `DELETE FROM association_types_type_associations`,
      );
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      await queryRunner.query(`DELETE FROM association`);
      await queryRunner.query(`DELETE FROM type_associations`);
      await queryRunner.commitTransaction();
      console.log('Dropped type associations and related associations...');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
