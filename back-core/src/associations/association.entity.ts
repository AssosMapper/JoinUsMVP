import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { TypeAssociations } from '../type-associations/type-associations.entity';

@Entity()
export class Association {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  code_postal: string;

  @Column({ nullable: true })
  ville: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, user => user.associations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  dateCreated: Date;

  @Column({ nullable: true, type: 'int' })
  members: number;

  @ManyToMany(() => TypeAssociations, typeAssociation => typeAssociation.associations)
  @JoinTable()
  types: TypeAssociations[];
}
