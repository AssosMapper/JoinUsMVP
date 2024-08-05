    import { Controller, Get, UseGuards } from '@nestjs/common';
    import { ProfileService } from './profile.service';
    import { User } from '../users/entities/user.entity';
    import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
    import { ApiBearerAuth } from '@nestjs/swagger';
    import { CurrentUserId } from 'src/utils/decorators/current-user-id.decorator';

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
