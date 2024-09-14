import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApplicationStatus } from '../entities/association-application.entity';

export class UpdateApplicationStatusDto {
    @IsEnum(ApplicationStatus)
    status: ApplicationStatus;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    applicationAnswer?: string;
}
