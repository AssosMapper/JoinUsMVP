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

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: Repository<Permission>,
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
      where: { id: user.id },
      relations: ['roles', 'roles.permissions', 'associations'],
    });
    const allPermissions = await this.permissionRepository.find();
    const permissions = fullUser.roles.map((role) => role.permissions);
    const flattedPermissions = permissions
      .flat()
      .map((permission) => permission.permission);
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
      permissions: {
        available: [
          ...allPermissions.map((permission) => permission.permission),
        ],
        granted: [...flattedPermissions],
      },
    };
  }
  /**
   * Register user
   */
  async register(registerDto: RegisterDto) {
    return await this.userService.register(registerDto);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
}
