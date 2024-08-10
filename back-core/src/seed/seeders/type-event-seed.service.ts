import { Inject, Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { TypeEvents } from '../../type-events/entities/type-events.entity';

@Injectable()
export class TypeEventsSeedService {
  constructor(
    @Inject('TYPE_EVENTS_REPOSITORY')
    private readonly typeEventsRepository: Repository<TypeEvents>,
    @Inject('DATA_SOURCE')
    private readonly datasource: DataSource,
  ) {}

  async seed() {
    console.log('Starting TypeEvents seed...');

    await this.drop();

    const types = [
      { name: "Manifestation statique", description: "Manifestation où les participants restent stationnaires." },
      { name: "Manifestation mobile", description: "Manifestation où les participants se déplacent." },
      { name: "Distribution de tracts", description: "Distribution de documents pour informer le public." },
      { name: "Assemblée générale", description: "Réunion des membres d'une organisation pour discuter de sujets importants." },
      { name: "Maraude", description: "Action humanitaire de distribution de nourriture et de vêtements aux sans-abri." },
      { name: "Conférence", description: "Réunion où des spécialistes partagent leurs connaissances sur un sujet donné." },
      { name: "Demande de fourniture", description: "Demande de matériel ou de fournitures pour une cause spécifique." },
      { name: "Demande de bénévolat", description: "Appel à des volontaires pour aider dans des activités ou événements." }
    ];

    const typeEntities = types.map(type => {
      const typeEntity = new TypeEvents();
      typeEntity.name = type.name;
      typeEntity.description = type.description;
      return typeEntity;
    });

    console.log('Seeding type events...', typeEntities);
    await this.typeEventsRepository.save(typeEntities);
    console.log('Seeded type events...');
  }

  async drop() {
    console.log('Dropping type events...');
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(`DELETE FROM type_events`);
      await queryRunner.commitTransaction();
      console.log('Dropped type events...');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
