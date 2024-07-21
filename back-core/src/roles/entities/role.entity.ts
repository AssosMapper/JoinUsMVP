import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { User } from '../../users/entities/user.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class Role extends EntityStructure {
  @Column({
    unique: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: ['remove'],
  })
  @JoinTable()
  permissions: Array<Permission>;

  @ManyToMany(() => User, (user) => user.roles)
  users: Array<User>;
}