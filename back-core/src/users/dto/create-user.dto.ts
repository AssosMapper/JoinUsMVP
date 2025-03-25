import { Localisation } from '@src/localisation/entities/localisation.entity';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsMatch } from '../../utils/decorators/IsMatchConstraint.decorator';

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
  localisation?: Localisation;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  associationId?: string;
}
