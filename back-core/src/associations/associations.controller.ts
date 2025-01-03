<<<<<<< HEAD
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { Association } from './entities/association.entity';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { User } from '../users/entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
=======
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  MyAssociationsDto,
  PublicAssociationDto,
} from '@shared/dto/associations.dto';
import { PublicUserDto } from '@shared/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from '../users/entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { AssociationManagerGuard } from './guards/association-manager.guard';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
<<<<<<< HEAD
  findAll(): Promise<Association[]> {
    return this.associationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Association> {
    return this.associationsService.findOne(id);
  }

  @Get('by-name/:name')
  findByName(@Param('name') name: string): Promise<Association> {
    return this.associationsService.findByName(name);
=======
  async findAll(): Promise<PublicAssociationDto[]> {
    const associations = await this.associationsService.findAll();
    return plainToInstance(PublicAssociationDto, associations, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('/my')
  @BearAuthToken()
  async findUserAssociations(
    @CurrentUserId() userId: string,
  ): Promise<MyAssociationsDto[]> {
    const associations =
      await this.associationsService.findUserAssociations(userId);
    return plainToInstance(MyAssociationsDto, associations, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PublicAssociationDto> {
    const association = await this.associationsService.findOne(id);
    return plainToInstance(PublicAssociationDto, association, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('by-name/:name')
  async findByName(@Param('name') name: string): Promise<PublicAssociationDto> {
    const association = await this.associationsService.findByName(name);
    return plainToInstance(PublicAssociationDto, association, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }

  @Post()
  @BearAuthToken()
<<<<<<< HEAD
  create(@CurrentUserId() user: User,@Body() createAssociationDto: CreateAssociationDto): Promise<Association> {
    return this.associationsService.create(user,createAssociationDto);
  }

  @Put(':id')
  @BearAuthToken()
  update(@Param('id') id: string, @Body() updateAssociationDto: UpdateAssociationDto) {
    return this.associationsService.update(id, updateAssociationDto);
  }

  @Delete(':id')
  @BearAuthToken()
  remove(@Param('id') id: string) {
    return this.associationsService.remove(id);
=======
  async create(
    @CurrentUserId() user: User,
    @Body() createAssociationDto: CreateAssociationDto,
  ): Promise<PublicAssociationDto> {
    const association = await this.associationsService.create(
      user,
      createAssociationDto,
    );
    return plainToInstance(PublicAssociationDto, association, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Put(':id')
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  async update(
    @Param('id') id: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ): Promise<PublicAssociationDto> {
    console.log('Controller received update data:', updateAssociationDto);
    const association = await this.associationsService.update(
      id,
      updateAssociationDto,
    );
    return plainToInstance(PublicAssociationDto, association, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id')
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  async remove(@Param('id') id: string): Promise<void> {
    await this.associationsService.remove(id);
  }

  @Get(':id/members')
  @BearAuthToken()
  async getMembers(@Param('id') id: string): Promise<PublicUserDto[]> {
    const members = await this.associationsService.getMembers(id);
    return plainToInstance(PublicUserDto, members, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id/members/:userId')
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.associationsService.removeMember(id, userId);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
}
