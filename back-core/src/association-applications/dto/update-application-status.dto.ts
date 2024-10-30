import { IsEnum, IsString } from 'class-validator';
import { ApplicationStatus } from '@shared/types/association-applications';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
