import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TypeAssociationsService } from './type-associations.service';
import { CreateTypeAssociationDto } from './dto/create-type-association.dto';
import { UpdateTypeAssociationDto } from './dto/update-type-association.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('type-associations')
@UseGuards(JwtAuthGuard)
export class TypeAssociationsController {
  constructor(private readonly typeAssociationsService: TypeAssociationsService) {}

  @Post()
  create(@Body() createTypeAssociationDto: CreateTypeAssociationDto) {
    return this.typeAssociationsService.create(createTypeAssociationDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.typeAssociationsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.typeAssociationsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTypeAssociationDto: UpdateTypeAssociationDto) {
    return this.typeAssociationsService.update(+id, updateTypeAssociationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeAssociationsService.remove(+id);
  }
}
