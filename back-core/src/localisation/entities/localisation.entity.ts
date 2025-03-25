import { Column, Entity } from 'typeorm';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class Localisation extends EntityStructure {
  @Column()
  street_number: string;

  @Column()
  street_name: string;

  @Column()
  zip: string;

  @Column()
  city: string;

  @Column()
  country: string;
}
