import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SaveLocalisationDto } from '@shared/dto/localisation.dto';
import {
  CreateUserDto,
  UpdateUserDto,
  UserProfileDto,
} from '@shared/dto/user.dto';
import { saveLocalisationSchema } from '@shared/validations/localisation.validation';
import {
  createUserSchema,
  updateUserSchema,
} from '@shared/validations/user.validation';
import { CurrentUserId } from '@src/utils/decorators/current-user-id.decorator';
import { plainToInstance } from 'class-transformer';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import {
  OptionalYupValidationPipe,
  YupValidationPipe,
} from '../utils/pipes/yup-validation.pipe';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @BearAuthToken()
  @ApiBearerAuth()
  async getProfile(@CurrentUserId() id: string): Promise<UserProfileDto> {
    const user = await this.usersService.getProfile(id);
    return plainToInstance(UserProfileDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @BearAuthToken()
  @ApiBearerAuth()
  create(
    @Body(new YupValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ): Promise<UserProfileDto> {
    return this.usersService.create(createUserDto);
  }

  @Put('me')
  @BearAuthToken()
  @ApiBearerAuth()
  async update(
    @CurrentUserId() id: string,
    @Body('user', new OptionalYupValidationPipe(updateUserSchema))
    updateUserDto?: UpdateUserDto,
    @Body('localisation', new OptionalYupValidationPipe(saveLocalisationSchema))
    saveLocalisationDto?: SaveLocalisationDto,
  ): Promise<void> {
    await this.usersService.updateProfile(
      id,
      updateUserDto,
      saveLocalisationDto,
    );
  }

  @Post('me/change-picture')
  @BearAuthToken()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async changeProfilePicture(
    @CurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.usersService.changeProfilePicture(userId, file);
  }

  @Delete('me/remove-picture')
  @BearAuthToken()
  @ApiBearerAuth()
  async removeProfilePicture(@CurrentUserId() userId: string): Promise<void> {
    await this.usersService.removeProfilePicture(userId);
  }

  @Delete(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
