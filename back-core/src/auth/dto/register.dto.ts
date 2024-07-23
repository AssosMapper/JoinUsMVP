import {IsString, IsEmail, IsOptional, IsStrongPassword} from 'class-validator';
import {IsMatch,} from "../../utils/decorators/IsMatchConstraint.decorator";

export class RegisterDto {
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

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    localisation?: string;

    @IsOptional()
    @IsString()
    image?: string;

}