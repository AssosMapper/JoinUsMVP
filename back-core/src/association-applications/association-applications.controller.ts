import { Controller, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { AssociationApplicationsService } from './association-applications.service';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { JoinAssociationDto } from './dto/join-association.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { SetApplicationQuestionDto } from './dto/set-application-question.dto';

@Controller('association-applications')
@UseGuards(BearAuthToken)
export class AssociationApplicationsController {
    constructor(private readonly applicationService: AssociationApplicationsService) {}

 /*   @Post('join')
    async joinAssociation(
        @CurrentUserId() userId: string,
        @Body() joinAssociationDto: JoinAssociationDto
    ) {
        return this.applicationService.joinAssociation(userId, joinAssociationDto);
    }

    @Delete('cancel')
    async cancelApplication(@CurrentUserId() userId: string) {
        return this.applicationService.cancelApplication(userId);
    }

    @Patch(':id/status')
    async updateApplicationStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateApplicationStatusDto
    ) {
        return this.applicationService.updateApplicationStatus(id, updateStatusDto);
    }

    @Patch(':associationId/question')
    async setApplicationQuestion(
        @Param('associationId') associationId: string,
        @Body() setQuestionDto: SetApplicationQuestionDto
    ) {
        return this.applicationService.setApplicationQuestion(associationId, setQuestionDto);
    }*/
}