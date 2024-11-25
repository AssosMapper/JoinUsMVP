import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  JoinAssociationDto,
  UpdateApplicationStatusDto,
} from '@shared/dto/association-applications.dto';
import {
  joinAssociationSchema,
  updateApplicationStatusSchema,
} from '@shared/validations/association-applications.validation';
import { YupValidationPipe } from '@src/utils/pipes/yup-validation.pipe';
import { AssociationManagerGuard } from '../associations/guards/association-manager.guard';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { AssociationApplicationsService } from './association-applications.service';

@Controller('association-applications')
@BearAuthToken()
export class AssociationApplicationsController {
  constructor(
    private readonly applicationService: AssociationApplicationsService,
  ) {}

  @Post('join')
  async joinAssociation(
    @CurrentUserId() userId: string,
    @Body(new YupValidationPipe(joinAssociationSchema))
    joinAssociationDto: JoinAssociationDto,
  ) {
    return this.applicationService.joinAssociation(userId, joinAssociationDto);
  }

  @Patch(':id')
  @UseGuards(AssociationManagerGuard)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body(new YupValidationPipe(updateApplicationStatusSchema))
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateApplicationStatus(
      id,
      updateApplicationStatusDto,
    );
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

  @Get('by-association/:associationId')
  @UseGuards(AssociationManagerGuard)
  async getApplicationsByAssociation(
    @Param('associationId') associationId: string,
  ) {
    return this.applicationService.getApplicationsByAssociation(associationId);
  }

  @Delete(':id')
  async cancelApplication(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.applicationService.cancelApplication(userId, id);
  }
}
