import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUserId } from 'src/utils/decorators/current-user-id.decorator';

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
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
