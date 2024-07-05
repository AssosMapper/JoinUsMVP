import { IsString, IsOptional } from 'class-validator';

export class CreateTypeAssociationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
