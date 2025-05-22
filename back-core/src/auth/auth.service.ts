import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto, ResetPasswordDto } from '@shared/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { comparePassword, hashPassword } from '../utils/functions';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,

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
   * Génère un JWT à partir d'un email pour les tests d'intégration
   * @param email Email de l'utilisateur
   * @returns Le token JWT généré
   */
  async generateJwtByEmail(email: string): Promise<string> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'email ${email} non trouvé`,
      );
    }

    return this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1h',
      },
    );
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

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    console.log(this.mailerService);
    if (user) {
      const token = crypto.randomBytes(20).toString('hex');

      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 2);

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiresIn;
      await this.userRepository.save(user);

      await this.sendForgotPasswordEmail({
        email,
        token,
        context: {
          name: `${user.first_name} ${user.last_name}`,
        },
      });
    }

    return {
      message:
        "Nous avons envoyé votre demande de mot de passe par e-mail si l'utilisateur existe",
    };
  }
  async sendForgotPasswordEmail({
    email,
    token,
    context,
  }: {
    email: string;
    token: string;
    context: {
      name: string;
    };
  }) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Réinitialisation de votre mot de passe JoinUs',
      template: 'forgot-password',
      context: { ...context, resetUrl },
    });
  }
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { email, token, password, confirmPassword } = resetPasswordDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
        resetPasswordToken: token,
      },
    });

    if (!user || user.resetPasswordExpires < new Date()) {
      throw new NotFoundException(
        "La demande de changement de mot de passe n'existe pas ou a expiré",
      );
    }

    if (password !== confirmPassword)
      throw new BadRequestException('Les mots de passe ne correspondent pas');

    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Votre mot de passe a bien été changé' };
  }
}
