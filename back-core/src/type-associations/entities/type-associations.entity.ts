import { Column, Entity, ManyToMany } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class TypeAssociations extends EntityStructure {

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Association, association => association.types)
  associations: Association[];
}