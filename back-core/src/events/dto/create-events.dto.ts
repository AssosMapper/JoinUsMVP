import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  associationId: string;

  @IsUUID()
  @IsNotEmpty()
  typeEventId: string;

  @IsString()
  @IsNotEmpty()
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
  @IsOptional()
  isValid?: boolean;
}
