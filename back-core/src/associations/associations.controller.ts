import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { Association } from './association.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('associations')
@UseGuards(JwtAuthGuard)
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
  @Public()
  findAll(): Promise<Association[]> {
    return this.associationsService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string): Promise<Association> {
    return this.associationsService.findOne(+id);
  }

  @Post()
  create(@Body() createAssociationDto: CreateAssociationDto): Promise<Association> {
    return this.associationsService.create(createAssociationDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAssociationDto: UpdateAssociationDto) {
    return this.associationsService.update(+id, updateAssociationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.associationsService.remove(+id);
  }
}
