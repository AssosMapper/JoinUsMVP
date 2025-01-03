<<<<<<< HEAD
import { Body, Controller, Post } from '@nestjs/common';
=======
import { Body, Controller, Get, Post } from '@nestjs/common';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import {RegisterDto} from "./dto/register.dto";
<<<<<<< HEAD

=======
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
@ApiTags('Authentification')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }
}