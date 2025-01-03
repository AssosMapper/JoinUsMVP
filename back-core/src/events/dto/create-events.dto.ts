<<<<<<< HEAD
import { IsString, IsInt, IsOptional, IsDate, IsNotEmpty, IsBoolean } from 'class-validator';
=======
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

<<<<<<< HEAD
  @IsString()
  associationId: string;

  @IsString()
  typeEventId: string;

  @IsOptional()
=======
  @IsUUID()
  @IsNotEmpty()
  associationId: string;

  @IsUUID()
  @IsNotEmpty()
  typeEventId: string;

  @IsString()
  @IsNotEmpty()
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  date?: Date;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsNotEmpty()
  localisation: string;

  @IsBoolean()
  isPublic: boolean;

<<<<<<< HEAD
  @IsBoolean()  
=======
  @IsBoolean()
  @IsOptional()
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  isValid?: boolean;
}
