import { Expose, Type } from "class-transformer";
import { LocalisationDto } from "./localisation.dto";
import { PublicMediaDto } from "./media.dto";
import { RoleDto } from "./roles.dto";

export class PublicUserDto {
  @Expose() id: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() first_name: string;
  @Expose() last_name: string;
  @Expose() image: PublicMediaDto;
}

export class UserDto {
  @Expose() id: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() first_name: string;
  @Expose() last_name: string;
  @Expose() email: string;
  @Expose() phone?: string;
  @Expose() image?: PublicMediaDto;
  @Type(() => RoleDto)
  @Expose()
  roles: RoleDto[];
  @Expose() localisation?: LocalisationDto;
}
export class UserProfileDto extends UserDto {}

export class CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export class UpdateUserDto {
  @Expose() first_name?: string;
  @Expose() last_name?: string;
  @Expose() email?: string;
  @Expose() password?: string;
  @Expose() confirmPassword?: string;
  @Expose() phone?: string;
  @Expose() imageId?: string;
}
