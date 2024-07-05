import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Association } from '../associations/association.entity';
import { TypeEvents } from '../type-events/type-events.entity'; 

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  date: Date;

  @Column()
  lieu: string;

  @Column()
  association_id: number;

  @ManyToOne(() => Association)
  @JoinColumn({ name: 'association_id' })
  organisation: Association;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  type_event_id: number;

  @ManyToOne(() => TypeEvents)
  @JoinColumn({ name: 'type_event_id' })
  typeEvent: TypeEvents;

  @Column()
  isPublic: boolean;
}