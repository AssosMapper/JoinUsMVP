import { IsEnum, IsString } from 'class-validator';
import { ApplicationStatus } from '../entities/association-application.entity';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
