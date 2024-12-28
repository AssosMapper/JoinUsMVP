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

  @OneToOne(() => Media, { nullable: true })
  @JoinColumn()
  image: Media;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Association, (association) => association.users)
  @JoinTable()
  associations: Array<Association>;

  @ManyToMany(() => Role, (role) => role.users, {
    cascade: ['remove'],
  })
  @JoinTable()
  roles: Array<Role>;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @Column({ nullable: true })
  associationId?: string;
}
