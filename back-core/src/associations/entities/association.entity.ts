import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Media } from '../../media/entities/media.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { User } from '../../users/entities/user.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class Association extends EntityStructure {
  @Column()
  name: string;

  @Column({ nullable: true })
  localisation: string;

  @Column('text')
  description: string;

  @OneToOne(() => Media, { nullable: true })
  @JoinColumn()
  image: Media;

  @ManyToMany(() => User, (user) => user.associations)
  users: Array<User>;

  @Column({ length: 255, nullable: true })
  applicationQuestion: string;

  @Column({ default: false })
  isPublic: boolean;

  @ManyToMany(
    () => TypeAssociations,
    (typeAssociation) => typeAssociation.associations,
  )
  @JoinTable()
  types: Array<TypeAssociations>;

  @Column({ default: false })
  isActive: boolean;
}
