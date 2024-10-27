import { IsEnum, IsString } from 'class-validator';
import { ApplicationStatus } from '@shared/enums/association-applications.enum';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
