import { Column, Entity, ManyToMany } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class TypeAssociations extends EntityStructure {
<<<<<<< HEAD

=======
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

<<<<<<< HEAD
  @ManyToMany(() => Association, association => association.types)
  associations: Association[];
}
=======
  @ManyToMany(() => Association, (association) => association.types)
  associations: Association[];
}
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
