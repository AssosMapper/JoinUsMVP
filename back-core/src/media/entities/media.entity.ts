<<<<<<< HEAD
import {Column, Entity, ManyToOne} from 'typeorm';
import {EntityStructure} from "../../utils/structures/entity.structure";
import {User} from "../../users/entities/user.entity";
import {Association} from "../../associations/entities/association.entity";
=======
import { Column, Entity } from 'typeorm';
import { EntityStructure } from '../../utils/structures/entity.structure';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

@Entity()
export class Media extends EntityStructure {
  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    unique: true,
  })
  filepath: string;

  @Column({
    unique: true,
  })
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;
  @Column({
    default: false,
  })
  isPublic: boolean;
}
