import { Inject, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { OnDev } from '../../utils/decorators/on-dev.decorator';

@Injectable()
export class AssociationSeedService {
  constructor(
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
    @Inject('TYPE_ASSOCIATIONS_REPOSITORY')
    private readonly typeAssociationsRepository: Repository<TypeAssociations>,
    @Inject('DATA_SOURCE')
    private readonly datasource: DataSource,
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
      
      const baseAssociations = [
        {
          name: "Urgence Palestine",
          localisation: "11 boulevard Voltaire, 75004 Paris, France",
          description: "From River to the Sea, Palestine will be free",
          image: "freepalestine.png",
          types: []
        },
        {
          name: "NPA - Nouveau Parti Anticapitaliste",
          localisation: "5 Rue Monge, 75005 Paris, France",
          description: "Pour le peuple, contre le patronat et la finance",
          image: "NPA.png",
          types: []
        },
        {
          name: "Extinction Rebellion",
          localisation: "60 Av. des Ternes, 75017 Paris, France",
          description: "Pour le vivant, sous toutes ses formes",
          image: "extinctionrebellion.png",
          types: []
        }
      ];

      const associationsToCreate = types.map(type => {
        const association = new Association();
        association.name = `join-us-${type.name.toLowerCase()}`;
        association.localisation = "Localisation par défaut";
        association.description = `Association pour ${type.name.toLowerCase()}`;
        association.image = `${type.name.toLowerCase()}.png`;
        association.types = [type];
        return association;
      });

      baseAssociations.forEach(baseAssoc => {
        const association = new Association();
        association.name = baseAssoc.name;
        association.localisation = baseAssoc.localisation;
        association.description = baseAssoc.description;
        association.image = baseAssoc.image;
        association.types = baseAssoc.types;
        associationsToCreate.push(association);
      });

      if (associationsToCreate.length > 0) {
        console.log('Seeding associations...');
        await this.associationRepository.save(associationsToCreate);
        console.log('Seeded associations:', associationsToCreate);
      } else {
        console.log('No new associations to seed.');
      }

    } catch (error) {
      console.error('Error during type retrieval or association creation:', error);
    }
  }

  async drop() {
    console.log('Dropping associations created by types...');
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`DELETE FROM association_types_type_associations WHERE associationId IN (SELECT id FROM association WHERE name LIKE 'join-us-%')`);
      await queryRunner.query(`DELETE FROM association WHERE name LIKE 'join-us-%'`);
      await queryRunner.commitTransaction();
      console.log('Dropped associations created by types...');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
