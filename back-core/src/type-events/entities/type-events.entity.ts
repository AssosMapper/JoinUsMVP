import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class TypeEvents extends EntityStructure{

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Event, event => event.typeEvent)
  events: Event[];
}