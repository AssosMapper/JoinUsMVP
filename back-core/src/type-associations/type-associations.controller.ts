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
  }

  @Post()
  @BearAuthToken()
  @ApiBearerAuth()
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
  }

  @Delete(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return await this.typeAssociationsService.remove(id);
  }
}
