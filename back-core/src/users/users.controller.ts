import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateUserDto,
  UpdateUserDto,
  UserProfileDto,
} from '@shared/dto/user.dto';
import {
  createUserSchema,
  updateUserSchema,
} from '@shared/validations/user.validation';
import { CurrentUserId } from '@src/utils/decorators/current-user-id.decorator';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { YupValidationPipe } from '../utils/pipes/yup-validation.pipe';
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
  async getProfile(@Req() req: any): Promise<User> {
    return this.usersService.findOne(req.user.userId);
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
    @Body(new YupValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
