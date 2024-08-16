import { Inject, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { Association } from '../../associations/entities/association.entity';

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
      { name: "Écologie", description: "Associations engagées pour la protection de l'environnement." },
      { name: "Droits sociaux", description: "Associations défendant les droits sociaux et l'égalité." },
      { name: "Santé", description: "Associations œuvrant pour l'accès à la santé pour tous." },
      { name: "Droits humains", description: "Associations promouvant et défendant les droits humains." }
    ];

    const typeEntities = types.map(type => {
      const typeEntity = new TypeAssociations();
      typeEntity.name = type.name;
      typeEntity.description = type.description;
      return typeEntity;
    });

    console.log('Seeding type associations...', typeEntities);
    await this.typeAssociationsRepository.save(typeEntities);
    console.log('Seeded type associations...');

    const createdTypes = await this.typeAssociationsRepository.find();

    const associationsToCreate = createdTypes.map(type => {
      const association = new Association();
      association.name = `Join-us-${type.name.toLowerCase()}`;
      association.localisation = "Default Location";
      association.description = `Association pour ${type.name.toLowerCase()}`;
      association.image = `${type.name.toLowerCase()}.png`;
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
      await queryRunner.query(`DELETE FROM association_types_type_associations`);
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
