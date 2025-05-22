import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @BearAuthToken()
  @ApiBearerAuth()
  async getProfile(@CurrentUserId() userId: string): Promise<User> {
    console.log('ProfileController - userId:', userId);
    return this.profileService.findOne(userId);
  }
}
