import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EntityStructure } from '../../utils/structures/entity.structure';
import { User } from '../../users/entities/user.entity';
import { Association } from '../../associations/entities/association.entity';

export enum ApplicationStatus {
    IN_PROGRESS = 0,
    APPROVED = 1,
    DENIED = 2,
}

@Entity()
export class AssociationApplication extends EntityStructure {
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToOne(() => Association)
    @JoinColumn()
    association: Association;

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

