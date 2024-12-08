import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { TypeEvents } from '../../type-events/entities/type-events.entity';
import { User } from '../../users/entities/user.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';
import { Media } from '@src/media/entities/media.entity';

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

  @Column()
  localisation: string;

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

  @Column({ default: false })
  isValid: boolean;
}
