import { ApplicationStatus } from '../types/association-applications';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JoinAssociationDto {
    @ApiProperty({
        description: 'ID de l\'association à rejoindre',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    associationId: string;

    @ApiProperty({
        description: 'Réponse à la question de candidature',
        example: 'Je souhaite rejoindre cette association car...',
        maxLength: 254
    })
    applicationAnswer: string;
}

export class UpdateApplicationStatusDto {
    @ApiProperty({
        description: 'Nouveau statut de la demande',
        enum: ApplicationStatus,
        example: ApplicationStatus.APPROVED
    })
    status: ApplicationStatus;
}

