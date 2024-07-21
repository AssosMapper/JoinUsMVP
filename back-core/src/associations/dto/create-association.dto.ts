import { IsString, IsInt, IsOptional, IsDate, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateAssociationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  localisation?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsInt()
  @IsOptional()
  members?: number;

  @IsArray()
  @ArrayNotEmpty()
  typeIds: Array<string>;
}
