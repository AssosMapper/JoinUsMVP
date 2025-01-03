<<<<<<< HEAD
import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { comparePassword } from '../utils/functions';
import {RegisterDto} from "./dto/register.dto";
import {Repository} from "typeorm";
import {Permission} from "../permissions/entities/permission.entity";
=======
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../utils/functions';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
<<<<<<< HEAD
    @Inject("USER_REPOSITORY") private readonly userRepository: Repository<User>,
    @Inject("PERMISSION_REPOSITORY") private readonly permissionRepository: Repository<Permission>,
=======
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  ) {}

  /**
   *
   * validate user by email and password and return user if it's valid or null if it's not
   */
  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   *
   * Login user and return access token
   */
  async login(loginDto: LoginDto) {
    const user = await this.validate(loginDto.email, loginDto.password);
    const fullUser = await this.userRepository.findOne({
<<<<<<< HEAD
        where: {id: user.id},
        relations: ['roles', 'roles.permissions']
    })
    const allPermissions = await this.permissionRepository.find()
    let permissions = fullUser.roles.map((role) => role.permissions);
    let flattedPermissions = permissions
        .flat()
        .map((permission) => permission.permission);
=======
      where: { id: user.id },
      relations: ['roles', 'roles.permissions', 'associations'],
    });
    const allPermissions = await this.permissionRepository.find();
    const permissions = fullUser.roles.map((role) => role.permissions);
    const flattedPermissions = permissions
      .flat()
      .map((permission) => permission.permission);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    return {
      access_token: this.jwtService.sign(
        {
          sub: user.id,
        },
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        },
      ),
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      user: user,
<<<<<<< HEAD
      permissions:{
        available: [...allPermissions.map(permission => permission.permission)],
        granted: [...flattedPermissions]
      }
=======
      permissions: {
        available: [
          ...allPermissions.map((permission) => permission.permission),
        ],
        granted: [...flattedPermissions],
      },
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    };
  }
  /**
   * Register user
   */
  async register(registerDto: RegisterDto) {
    return await this.userService.register(registerDto);
  }
<<<<<<< HEAD
}
=======

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
}
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
