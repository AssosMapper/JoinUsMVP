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
  AssociationApplicationDto,
  JoinAssociationDto,
  UpdateApplicationStatusDto,
} from '@shared/dto/association-applications.dto';
import { joinAssociationSchema } from '@shared/validations/association-applications.validation';
import { YupValidationPipe } from '@src/utils/pipes/yup-validation.pipe';
import { plainToInstance } from 'class-transformer';
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
  ): Promise<AssociationApplicationDto> {
    const application = await this.applicationService.joinAssociation(
      userId,
      joinAssociationDto,
    );
    return plainToInstance(AssociationApplicationDto, application, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Patch(':id/status/:associationId')
  @UseGuards(AssociationManagerGuard)
  async updateApplicationStatus(
    @Param('id') id: string,
    @Param('associationId') associationId: string,
    @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  ): Promise<AssociationApplicationDto> {
    const application = await this.applicationService.updateApplicationStatus(
      id,
      updateApplicationStatusDto,
    );
    return plainToInstance(AssociationApplicationDto, application, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('by-associations')
  async getApplicationsByAssociations(
    @CurrentUserId() userId: string,
    @Query(
      'associationIds',
      new ParseArrayPipe({ items: String, separator: ',' }),
    )
    associationIds: string[],
  ): Promise<AssociationApplicationDto[]> {
    const applications =
      await this.applicationService.getApplicationsByAssociations(
        userId,
        associationIds,
      );

    return plainToInstance(AssociationApplicationDto, applications, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('by-association/:associationId')
  @UseGuards(AssociationManagerGuard)
  async getApplicationsByAssociation(
    @Param('associationId') associationId: string,
  ): Promise<AssociationApplicationDto[]> {
    const applications =
      await this.applicationService.getApplicationsByAssociation(associationId);
    return plainToInstance(AssociationApplicationDto, applications, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id')
  async cancelApplication(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
  ): Promise<AssociationApplicationDto> {
    const application = await this.applicationService.cancelApplication(
      userId,
      id,
    );
    return plainToInstance(AssociationApplicationDto, application, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
