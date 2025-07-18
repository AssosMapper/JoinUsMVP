import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';
import { Event } from './event.entity';

@Entity()
@Unique(['user', 'event'])
export class EventParticipation extends EntityStructure {
  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Event, (event) => event.participants, { eager: true })
  @JoinColumn()
  event: Event;

  @Column()
  registrationDate: Date;
}
