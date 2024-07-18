import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { OnDev } from '../../utils/decorators/on-dev.decorator';

@Injectable()
export class AssociationSeedService {
  constructor(
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
  ) {}

  @OnDev()
  async seed() {
    await this.drop();
    const associations = [];
    for (let i = 0; i < 50; i++) {
      const association = new Association();
      association.name = `Association ${i}`;
      association.description = `Description ${i}`;
      associations.push(association);
    }
    console.log('Seeding associations...');
    await this.associationRepository.save(associations);
    console.log('Seeded associations...');
  }

  private async drop() {
    console.log('Dropping users...');
    await this.associationRepository.delete({});
    console.log('Dropped users...');
  }
}
