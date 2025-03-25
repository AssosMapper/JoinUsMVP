import { Inject, Injectable } from '@nestjs/common';
import { Localisation } from '@src/localisation/entities/localisation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocalisationSeedService {
  constructor(
    @Inject('LOCALISATION_REPOSITORY')
    private repository: Repository<Localisation>,
  ) {}

  async seed(): Promise<Localisation[]> {
    const localisations = [
      {
        street_number: '1',
        street_name: 'Rue de la Paix',
        zip: '75000',
        city: 'Paris',
        country: 'France',
      },
      {
        street_number: '2',
        street_name: 'Avenue des Champs-Élysées',
        zip: '75008',
        city: 'Paris',
        country: 'France',
      },
      {
        street_number: '3',
        street_name: 'Boulevard Saint-Germain',
        zip: '75006',
        city: 'Paris',
        country: 'France',
      },
    ];

    const savedLocalisations = [];
    for (const localisation of localisations) {
      const existingLocalisation = await this.repository.findOne({
        where: {
          street_number: localisation.street_number,
          street_name: localisation.street_name,
          zip: localisation.zip,
        },
      });

      if (!existingLocalisation) {
        const newLocalisation = this.repository.create(localisation);
        savedLocalisations.push(await this.repository.save(newLocalisation));
      } else {
        savedLocalisations.push(existingLocalisation);
      }
    }

    return savedLocalisations;
  }
}
