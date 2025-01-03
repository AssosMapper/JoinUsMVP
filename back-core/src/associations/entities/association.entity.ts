<<<<<<< HEAD
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TypeAssociations } from '../../type-associations/entities/type-associations.entity';
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class Association extends EntityStructure {
<<<<<<< HEAD

=======
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  @Column()
  name: string;

  @Column({ nullable: true })
  localisation: string;

  @Column('text')
  description: string;

<<<<<<< HEAD
  @Column({ nullable: true })
  image: string;

  @OneToMany(() => User, user => user.association)
  users: Array<User>;

  @Column({ nullable: true, type: 'int' })
  members: number;

  @ManyToMany(() => TypeAssociations, typeAssociation => typeAssociation.associations)
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  @JoinTable()
  types: Array<TypeAssociations>;
}
