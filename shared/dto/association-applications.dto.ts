import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ApplicationStatus } from '../types/association-applications';
import { PublicAssociationDto } from './associations.dto';
import { PublicUserDto } from './user.dto';

export class JoinAssociationDto {
  @ApiProperty({
    description: "ID de l'association à rejoindre",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  associationId: string;

  @ApiProperty({
    description: 'Réponse à la question de candidature',
    example: 'Je souhaite rejoindre cette association car...',
    maxLength: 254,
  })
  applicationAnswer: string;
}

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'Nouveau statut de la demande',
    enum: ApplicationStatus,
    example: ApplicationStatus.APPROVED,
  })
  status: ApplicationStatus;
}

export class AssociationApplicationDto {
  @Expose() id: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() associationId: string;
  @Expose() status: ApplicationStatus;
  @Expose() applicationAnswer: string;
  @Expose() applicationQuestion: string;

  @Expose()
  @Type(() => PublicUserDto)
  user: PublicUserDto;

  @Expose()
  @Type(() => PublicAssociationDto)
  association: PublicAssociationDto;
}
