import { IsEnum, IsString } from 'class-validator';
import { ApplicationStatus } from '@joinus/packages/src/enums/association-applications.enum';

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
