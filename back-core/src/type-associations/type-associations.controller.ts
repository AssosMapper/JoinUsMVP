<<<<<<< HEAD
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TypeAssociationsService } from './type-associations.service';
import { CreateTypeAssociationDto } from './dto/create-type-association.dto';
import { UpdateTypeAssociationDto } from './dto/update-type-association.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';

@Controller('type-associations')
export class TypeAssociationsController {
  constructor(private readonly typeAssociationsService: TypeAssociationsService) {}

  @Get()
  findAll() {
    return this.typeAssociationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeAssociationsService.findOne(id);
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
import { TypeAssociationsDto } from '@shared/dto/type-associations.dto';
import { plainToInstance } from 'class-transformer';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CreateTypeAssociationDto } from './dto/create-type-association.dto';
import { UpdateTypeAssociationDto } from './dto/update-type-association.dto';
import { TypeAssociationsService } from './type-associations.service';

@Controller('type-associations')
export class TypeAssociationsController {
  constructor(
    private readonly typeAssociationsService: TypeAssociationsService,
  ) {}

  @Get()
  async findAll(): Promise<TypeAssociationsDto[]> {
    const typeAssociations = await this.typeAssociationsService.findAll();
    return plainToInstance(TypeAssociationsDto, typeAssociations, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TypeAssociationsDto> {
    const typeAssociation = await this.typeAssociationsService.findOne(id);
    return plainToInstance(TypeAssociationsDto, typeAssociation, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }

  @Post()
  @BearAuthToken()
  @ApiBearerAuth()
<<<<<<< HEAD
  create(@Body() createTypeAssociationDto: CreateTypeAssociationDto) {
    return this.typeAssociationsService.create(createTypeAssociationDto);
  }


  @Put(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateTypeAssociationDto: UpdateTypeAssociationDto) {
    return this.typeAssociationsService.update(id, updateTypeAssociationDto);
=======
  async create(
    @Body() createTypeAssociationDto: CreateTypeAssociationDto,
  ): Promise<TypeAssociationsDto> {
    const typeAssociation = await this.typeAssociationsService.create(
      createTypeAssociationDto,
    );
    return plainToInstance(TypeAssociationsDto, typeAssociation, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Put(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateTypeAssociationDto: UpdateTypeAssociationDto,
  ): Promise<TypeAssociationsDto> {
    const typeAssociation = await this.typeAssociationsService.update(
      id,
      updateTypeAssociationDto,
    );
    return plainToInstance(TypeAssociationsDto, typeAssociation, {
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
    return this.typeAssociationsService.remove(id);
=======
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return await this.typeAssociationsService.remove(id);
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  }
}
