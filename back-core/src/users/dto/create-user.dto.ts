import { IsString, IsEmail, IsDate, IsNumber, IsOptional, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsDate()
  dateCreated: Date;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre ou un caractère spécial',
  })
  password: string;

  @IsString()
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
  idAssociation?: string;
}