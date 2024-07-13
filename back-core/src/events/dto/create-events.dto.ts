import { IsString, IsInt, IsOptional, IsDate } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  userId: number;

  @IsInt()
  association_id: number;

  @IsInt()
  typeEventId: number;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  image?: string;
}
