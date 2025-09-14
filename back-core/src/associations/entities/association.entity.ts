import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
} from 'typeorm';
import { Localisation } from '../../localisation/entities/localisation.entity';
import { Media } from '../../media/entities/media.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
import { User } from '../../users/entities/user.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class Association extends EntityStructure {
  @Column()
  name: string;

  @OneToOne(() => Localisation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  localisation?: Localisation;

  @Column('text')
  description: string;

  @OneToOne(() => Media, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  image?: Media;

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

  @Column('longtext', { nullable: true })
  content?: string;
}
