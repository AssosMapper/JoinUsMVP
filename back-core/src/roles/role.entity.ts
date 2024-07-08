import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { UserRole } from '../../../interfaces/roles';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  name: UserRole;

  @OneToMany(() => User, user => user.role)
  users: User[];
}

