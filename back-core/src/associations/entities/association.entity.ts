import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class Association extends EntityStructure {
  @Column()
  name: string;

  @Column({ nullable: true })
  localisation: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  image: string;

  @ManyToMany(() => User, (user) => user.associations)
  users: Array<User>;

  @Column({ nullable: true, type: 'int' })
  members: number;

  @Column({ length: 255, nullable: true })
  applicationQuestion: string;

  @ManyToMany(
    () => TypeAssociations,
    (typeAssociation) => typeAssociation.associations,
  )
  @JoinTable()
  types: Array<TypeAssociations>;
}
