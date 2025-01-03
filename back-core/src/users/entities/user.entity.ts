<<<<<<< HEAD
import {Column, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany} from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { Role } from '../../roles/entities/role.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';
import {Media} from "../../media/entities/media.entity";

@Entity()
export class User extends EntityStructure{

=======
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Role } from '../../roles/entities/role.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';
import { Media } from '@src/media/entities/media.entity';

@Entity()
export class User extends EntityStructure {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  localisation: string;

<<<<<<< HEAD
  @Column({ nullable: true })
  image: string;
=======
  @OneToOne(() => Media, { nullable: true })
  @JoinColumn()
  image: Media;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

  @DeleteDateColumn()
  deletedAt: Date;

<<<<<<< HEAD
  @ManyToOne(() => Association, association => association.users)
  @JoinColumn()
  association: Association;
=======
  @ManyToMany(() => Association, (association) => association.users)
  @JoinTable()
  associations: Array<Association>;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ['remove'],
  })
  @JoinTable()
  roles: Array<Role>;
<<<<<<< HEAD
=======

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Column({ nullable: true })
  associationId?: string;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
}
