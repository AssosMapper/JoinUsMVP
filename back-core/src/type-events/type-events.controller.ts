import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TypeEventsService } from './type-events.service';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';
import { TypeEvents } from './entities/type-events.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('type-events')
export class TypeEventsController {
  constructor(private readonly typeEventsService: TypeEventsService) {}

  @Get()
  findAll(): Promise<TypeEvents[]> {
    return this.typeEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TypeEvents> {
    return this.typeEventsService.findOne(id);
  }

  @Post()
  @BearAuthToken()
  @ApiBearerAuth()
  create(@Body() createTypeEventDto: CreateTypeEventDto): Promise<TypeEvents> {
    return this.typeEventsService.create(createTypeEventDto);
  }

  @Put(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateTypeEventDto: UpdateTypeEventDto) {
    return this.typeEventsService.update(id, updateTypeEventDto);
  }

  @Delete(':id')
  @BearAuthToken()
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.typeEventsService.remove(id);
  }
}
