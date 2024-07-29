import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterEventsDto {
  @IsOptional()
  @IsString()
  associationId?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @IsEnum(['past', 'future', 'all', 'today'])
  @Transform(({ value }) => value.toLowerCase())
  direction: 'past' | 'future' | 'all' | 'today';
}
