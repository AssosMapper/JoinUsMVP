<<<<<<< HEAD
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TypeEventsService } from './type-events.service';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';
import { TypeEvents } from './entities/type-events.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
=======
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TypeEventsDto } from '@shared/dto/type-events.dto';
import { plainToInstance } from 'class-transformer';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';
import { TypeEventsService } from './type-events.service';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

@Controller('type-events')
export class TypeEventsController {
  constructor(private readonly typeEventsService: TypeEventsService) {}

  @Get()
<<<<<<< HEAD
  findAll(): Promise<TypeEvents[]> {
    return this.typeEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TypeEvents> {
    return this.typeEventsService.findOne(id);
=======
  async findAll(): Promise<TypeEventsDto[]> {
    const typeEvents = await this.typeEventsService.findAll();
    return plainToInstance(TypeEventsDto, typeEvents, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TypeEventsDto> {
    const typeEvent = await this.typeEventsService.findOne(id);
    return plainToInstance(TypeEventsDto, typeEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }

  @Post()
  @BearAuthToken()
  @ApiBearerAuth()
<<<<<<< HEAD
  create(@Body() createTypeEventDto: CreateTypeEventDto): Promise<TypeEvents> {
    return this.typeEventsService.create(createTypeEventDto);
=======
  async create(
    @Body() createTypeEventDto: CreateTypeEventDto,
  ): Promise<TypeEventsDto> {
    const typeEvent = await this.typeEventsService.create(createTypeEventDto);
    return plainToInstance(TypeEventsDto, typeEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }

  @Put(':id')
  @BearAuthToken()
  @ApiBearerAuth()
<<<<<<< HEAD
  update(@Param('id') id: string, @Body() updateTypeEventDto: UpdateTypeEventDto) {
    return this.typeEventsService.update(id, updateTypeEventDto);
=======
  async update(
    @Param('id') id: string,
    @Body() updateTypeEventDto: UpdateTypeEventDto,
  ): Promise<TypeEventsDto> {
    const typeEvent = await this.typeEventsService.update(
      id,
      updateTypeEventDto,
    );
    return plainToInstance(TypeEventsDto, typeEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }

  @Delete(':id')
  @BearAuthToken()
  @ApiBearerAuth()
<<<<<<< HEAD
  remove(@Param('id') id: string) {
=======
  remove(@Param('id') id: string): Promise<void> {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    return this.typeEventsService.remove(id);
  }
}
