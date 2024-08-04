import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
    console.log('JwtStrategy constructed');
  }

  async validate(payload: any) {
    console.log('JwtStrategy validate called with payload:', payload);
    const user = await this.usersService.findOne(payload.sub);
    if (!user) {
      console.log('User not found for sub:', payload.sub);
      throw new UnauthorizedException();
    }
    console.log('User found:', user);
    return { userId: user.id, email: user.email, roles: user.roles };
  }
}