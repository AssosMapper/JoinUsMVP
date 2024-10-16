import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { Association } from './entities/association.entity';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { User } from '../users/entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';

@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
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
  }

  @Post()
  @BearAuthToken()
  create(
    @CurrentUserId() user: User,
    @Body() createAssociationDto: CreateAssociationDto,
  ): Promise<Association> {
    return this.associationsService.create(user, createAssociationDto);
  }

  @Put(':id')
  @BearAuthToken()
  update(
    @Param('id') id: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ) {
    return this.associationsService.update(id, updateAssociationDto);
  }

  @Delete(':id')
  @BearAuthToken()
  remove(@Param('id') id: string) {
    return this.associationsService.remove(id);
  }
}
