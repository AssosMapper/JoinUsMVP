import { Expose } from "class-transformer";
import { LocalisationDto } from "./localisation.dto";
import { PublicMediaDto } from "./media.dto";

export class PublicUserDto {
  @Expose() id: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() first_name: string;
  @Expose() last_name: string;
  @Expose() image: PublicMediaDto;
}

export class UserProfileDto extends PublicUserDto {
  @Expose() localisation?: LocalisationDto;
}

export class CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export class UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}
