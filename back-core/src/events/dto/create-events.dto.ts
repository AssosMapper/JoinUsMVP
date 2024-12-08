import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  associationId: string;

  @IsString()
  typeEventId: string;

  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  localisation: string;

  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  isValid?: boolean;
}
