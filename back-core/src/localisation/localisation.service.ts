import { Inject, Injectable } from '@nestjs/common';
import { CreateLocalisationDto } from '@shared/dto/localisation.dto';
import { Repository } from 'typeorm';
import { Localisation } from './entities/localisation.entity';

@Injectable()
export class LocalisationService {
  constructor(
    @Inject('LOCALISATION_REPOSITORY')
    private repository: Repository<Localisation>,
  ) {}

  async create(
    createLocalisationDto: CreateLocalisationDto,
  ): Promise<Localisation> {
    const localisation = await this.repository.create(createLocalisationDto);
    return localisation;
  }
}
