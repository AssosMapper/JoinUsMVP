<<<<<<< HEAD
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Association } from '../../associations/entities/association.entity';
import { TypeEvents } from '../../type-events/entities/type-events.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class Event extends EntityStructure{

=======
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { TypeEvents } from '../../type-events/entities/type-events.entity';
import { User } from '../../users/entities/user.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';
import { Media } from '@src/media/entities/media.entity';

@Entity()
export class Event extends EntityStructure {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  @Column()
  titre: string;

  @Column('text')
  description: string;

<<<<<<< HEAD
  @Column({ nullable: true })
  image: string;
=======
  @OneToOne(() => Media, { nullable: true })
  @JoinColumn()
  image: Media;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

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

<<<<<<< HEAD
  @Column({ default: false }) 
  isValid: boolean;
}
=======
  @Column({ default: false })
  isValid: boolean;
}
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
