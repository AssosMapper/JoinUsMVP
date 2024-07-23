import {IsString, IsEmail, IsDate, IsNumber, IsOptional, MinLength, Matches, IsStrongPassword} from 'class-validator';
import {IsMatch, IsMatchConstraint} from "../../utils/decorators/IsMatchConstraint.decorator";

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;


  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsMatch('password')
  confirmPassword: string;

  @IsString()
  roleId: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  localisation?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString ()
  associationId?: string;
}