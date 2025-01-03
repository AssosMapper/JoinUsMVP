import { Expose } from 'class-transformer';
import { PublicMediaDto } from './media.dto';

export class PublicUserDto {
  @Expose() id: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() first_name: string;
  @Expose() last_name: string;
  @Expose() image: PublicMediaDto;
}
