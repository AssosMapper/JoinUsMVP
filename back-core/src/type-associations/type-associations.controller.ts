import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TypeAssociationsService } from './type-associations.service';
import { CreateTypeAssociationDto } from './dto/create-type-association.dto';
import { UpdateTypeAssociationDto } from './dto/update-type-association.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';

@Controller('type-associations')
export class TypeAssociationsController {
  constructor(private readonly typeAssociationsService: TypeAssociationsService) {}

  @Get()
  @Public()
  findAll() {
    return this.typeAssociationsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.typeAssociationsService.findOne(id);
  }

  @Post()
  @BearAuthToken()
  @ApiBearerAuth()
  create(@Body() createTypeAssociationDto: CreateTypeAssociationDto) {
    return this.typeAssociationsService.create(createTypeAssociationDto);
  }


  @Put(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateTypeAssociationDto: UpdateTypeAssociationDto) {
    return this.typeAssociationsService.update(id, updateTypeAssociationDto);
  }

  @Delete(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.typeAssociationsService.remove(id);
  }
}
