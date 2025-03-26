import { Localisation } from '@src/localisation/entities/localisation.entity';
import { Media } from '@src/media/entities/media.entity';
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

  @OneToOne(() => Localisation, { nullable: true })
  @JoinColumn()
  localisation: Localisation;

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

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ default: false })
  isActive: boolean;
}
