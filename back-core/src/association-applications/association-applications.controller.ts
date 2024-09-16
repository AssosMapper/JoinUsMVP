import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { AssociationApplicationsService } from './association-applications.service';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { JoinAssociationDto } from './dto/join-association.dto';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

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

  @Delete(':id')
  async cancelApplication(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.applicationService.cancelApplication(userId, id);
  }

  /**
   * @todo Add denyApplication and acceptApplication routes
   */
}
