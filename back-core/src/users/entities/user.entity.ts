import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
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

  @Column({ nullable: true })
  localisation: string;

  @Column({ nullable: true })
  image: string;

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
}
