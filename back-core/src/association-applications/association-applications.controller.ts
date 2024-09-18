import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
} from '@nestjs/common';
import { AssociationApplicationsService } from './association-applications.service';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { JoinAssociationDto } from './dto/join-association.dto';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { ApplicationStatus } from './entities/association-application.entity';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Controller('association-applications')
@BearAuthToken()
@ApiBearerAuth()
export class AssociationApplicationsController {
  constructor(
    private readonly applicationService: AssociationApplicationsService,
  ) {}

  @Post('join')
  async joinAssociation(
    @CurrentUserId() userId: string,
    @Body() joinAssociationDto: JoinAssociationDto,
  ) {
    return this.applicationService.joinAssociation(userId, joinAssociationDto);
  }
  @Patch(':id')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateApplicationStatus(
      id,
      updateApplicationStatusDto,
    );
  }
  @Delete(':id')
  async cancelApplication(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.applicationService.cancelApplication(userId, id);
  }

  @Get('current/:associationId')
  async getCurrentApplication(
    @CurrentUserId() userId: string,
    @Param('associationId') associationId: string,
  ) {
    return this.applicationService.getCurrentApplication(userId, associationId);
  }
}
