import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Association } from '../../associations/entities/association.entity';
import { TypeEvents } from '../../type-events/entities/type-events.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class Event extends EntityStructure{

  @Column()
  titre: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  image: string;

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
}