import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import { AssociationApplicationsService } from './association-applications.service';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { JoinAssociationDto } from '@shared/dto/association-applications.dto';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateApplicationStatusDto } from '@shared/dto/association-applications.dto';
import {
  joinAssociationSchema,
  updateApplicationStatusSchema,
} from '@shared/validations/association-applications.validation';
import { YupValidationPipe } from '@src/utils/pipes/yup-validation.pipe';
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
    @Body(new YupValidationPipe(joinAssociationSchema)) joinAssociationDto: JoinAssociationDto,
  ) {
    return this.applicationService.joinAssociation(userId, joinAssociationDto);
  }

  @Patch(':id')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body(new YupValidationPipe(updateApplicationStatusSchema)) updateApplicationStatusDto: UpdateApplicationStatusDto,
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

  @Get('by-associations')
  async getApplicationsByAssociations(
    @CurrentUserId() userId: string,
    @Query(
      'associationIds',
      new ParseArrayPipe({ items: String, separator: ',' }),
    )
    associationIds: string[],
  ) {
    return this.applicationService.getApplicationsByAssociations(
      userId,
      associationIds,
    );
  }
  
  @Get(':associationId/current')
  async getCurrentApplication(
    @CurrentUserId() userId: string,
    @Param('associationId') associationId: string,
  ) {
    return this.applicationService.getCurrentApplication(userId, associationId);
  }
}
