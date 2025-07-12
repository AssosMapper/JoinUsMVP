import { Media } from '@src/media/entities/media.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { TypeEvents } from '../../type-events/entities/type-events.entity';
import { User } from '../../users/entities/user.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';
import { EventParticipation } from './event-participation.entity';
import { Localisation } from '../../localisation/entities/localisation.entity';

@Entity()
export class Event extends EntityStructure {
  @Column()
  titre: string;

  @Column('text')
  description: string;

  @OneToOne(() => Media, { nullable: true })
  @JoinColumn()
  image: Media;

  @Column()
  date: Date;

  @OneToOne(() => Localisation, { nullable: true })
  @JoinColumn()
  localisation: Localisation;

  @ManyToOne(() => Association)
  @JoinColumn()
  association: Association;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => TypeEvents)
  @JoinColumn()
  typeEvent: TypeEvents;

  @Column()
  isPublic: boolean;

  @Column({ default: true })
  isValid: boolean;

  @OneToMany(() => EventParticipation, (participation) => participation.event, {
    cascade: true,
  })
  participants: EventParticipation[];

  @BeforeInsert()
  setValidationStatus() {
    this.isValid = !!this.association;
  }
}
