import { Inject } from '@nestjs/common';
import { ApplicationStatus } from '@shared/types/association-applications';
import { Column, DataSource, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Association } from '../../associations/entities/association.entity';
import { User } from '../../users/entities/user.entity';
import { EntityStructure } from '../../utils/structures/entity.structure';

@Entity()
export class AssociationApplication extends EntityStructure {
  @Inject()
  private dataSource: DataSource;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Association)
  @JoinColumn()
  association: Association;

  @Column()
  associationId: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.IN_PROGRESS,
  })
  status: ApplicationStatus;

  @Column({ length: 255, nullable: true })
  applicationAnswer: string;

  @Column({ length: 255, nullable: true })
  applicationQuestion: string;
}
