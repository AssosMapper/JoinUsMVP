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
import { User } from '../users/entities/user.entity';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { AssociationsService } from './associations.service';
import { CreateAssociationDto } from './dto/create-association.dto';
import { UpdateAssociationDto } from './dto/update-association.dto';
import { Association } from './entities/association.entity';
import { AssociationManagerGuard } from './guards/association-manager.guard';

@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
  findAll(): Promise<Association[]> {
    return this.associationsService.findAll();
  }

  @Get('/my')
  @BearAuthToken()
  findUserAssociations(
    @CurrentUserId() userId: string,
  ): Promise<Association[]> {
    return this.associationsService.findUserAssociations(userId);
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
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  update(
    @Param('id') id: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ) {
    return this.associationsService.update(id, updateAssociationDto);
  }

  @Delete(':id')
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  remove(@Param('id') id: string) {
    return this.associationsService.remove(id);
  }

  @Get(':id/members')
  @BearAuthToken()
  getMembers(@Param('id') id: string) {
    return this.associationsService.getMembers(id);
  }

  @Delete(':id/members/:userId')
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.associationsService.removeMember(id, userId);
  }
}
