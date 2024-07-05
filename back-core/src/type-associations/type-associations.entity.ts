import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Association } from '../associations/association.entity';

@Entity()
export class TypeAssociations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Association, association => association.types)
  associations: Association[];
}