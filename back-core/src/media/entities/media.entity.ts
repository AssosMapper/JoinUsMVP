import {Column, Entity, ManyToOne} from 'typeorm';
import {EntityStructure} from "../../utils/structures/entity.structure";
import {User} from "../../users/entities/user.entity";
import {Association} from "../../associations/entities/association.entity";

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
