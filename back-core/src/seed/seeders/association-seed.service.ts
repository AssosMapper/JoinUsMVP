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

    const association1 = new Association();
    association1.name = "Urgence Palestine";
    association1.localisation = "11 boulevard Voltaire, 75004 Paris, France";
    association1.description = "From River to the Sea, Palestine will be free";
    association1.image = "freepalestine.png";
    associations.push(association1);

    const association2 = new Association();
    association2.name = "NPA - Nouveau Parti Anticapitaliste";
    association2.localisation = "5 Rue Monge, 75005 Paris, France";
    association2.description = "Pour le peuple, contre le patronat et la finance";
    association2.image = "NPA.png";
    associations.push(association2);

    const association3 = new Association();
    association3.name = "Extinction Rebellion";
    association3.localisation = "60 Av. des Ternes, 75017 Paris, France";
    association3.description = "Pour le vivant, sous toutes ses formes";
    association3.image = "extinctionrebellion.png";
    associations.push(association3);

    console.log('Seeding associations...');
    await this.associationRepository.save(associations);
    console.log('Seeded associations...');
  }

  private async drop() {
    console.log('Dropping associations...');
    await this.associationRepository.delete({});
    console.log('Dropped associations...');
  }
}
