import { IsString, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

export class JoinAssociationDto {
    @IsUUID()
    @IsNotEmpty()
    associationId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    applicationAnswer: string;
}