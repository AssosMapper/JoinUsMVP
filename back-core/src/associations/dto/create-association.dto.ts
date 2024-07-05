import { IsString, IsInt, IsOptional, IsDate, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateAssociationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  code_postal?: string;

  @IsString()
  @IsOptional()
  ville?: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsInt()
  userId: number;

  @IsDate()
  @IsOptional()
  dateCreated?: Date;

  @IsInt()
  @IsOptional()
  members?: number;

  @IsArray()
  @ArrayNotEmpty()
  typeIds: number[];
}
