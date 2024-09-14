import {Injectable, ConflictException, NotFoundException, Inject} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssociationApplication, ApplicationStatus } from './entities/association-application.entity';
import { User } from '../users/entities/user.entity';
import { Association } from '../associations/entities/association.entity';
import { JoinAssociationDto } from './dto/join-association.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { SetApplicationQuestionDto } from './dto/set-application-question.dto';

@Injectable()
export class AssociationApplicationsService {
    constructor(
        @Inject('ASSOCIATION_APPLICATION_REPOSITORY')
        private readonly associationApplicationRepository: Repository<AssociationApplication>,
        @Inject('USER_REPOSITORY')
        private readonly userRepository: Repository<User>,
        @Inject('ASSOCIATION_REPOSITORY')
        private readonly associationRepository: Repository<Association>,
    ) {}

    /*async joinAssociation(userId: string, joinAssociationDto: JoinAssociationDto) {
        const { associationId, applicationAnswer } = joinAssociationDto;
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['association'],
        });
        const association = await this.associationRepository.findOne({ where: { id: associationId } });

        if (!user || !association)
            throw new NotFoundException('User or Association not found');

        if (user.association)
            throw new ConflictException({
                message: `User is already in association ${user.association.name}`,
                associationId: user.association.id
            });

        const existingApplication = await this.associationApplicationRepository.findOne({
            where: {
                user: { id: userId },
                status: ApplicationStatus.IN_PROGRESS
            },
            relations: ['association'],
        });


        if (existingApplication)
            throw new ConflictException({
                message: `A request is already in progress for association ${existingApplication.association.name}`,
                associationId: existingApplication.association.id
            });

        const application = new AssociationApplication();
        application.user = user;
        application.association = association;
        application.applicationAnswer = applicationAnswer;
        application.status = ApplicationStatus.IN_PROGRESS;

        return this.associationApplicationRepository.save(application);
    }

    async cancelApplication(userId: string) {
        const application = await this.associationApplicationRepository.findOne({
            where: { user: { id: userId }, status: ApplicationStatus.IN_PROGRESS },
        });

        if (!application)
            throw new NotFoundException('No ongoing application found for this user');

        await this.associationApplicationRepository.remove(application);
        return { message: 'Application cancelled successfully' };
    }

    async updateApplicationStatus(applicationId: string, updateStatusDto: UpdateApplicationStatusDto) {
        const { status, applicationAnswer } = updateStatusDto;
        const application = await this.associationApplicationRepository.findOne({
            where: { id: applicationId },
            relations: ['user', 'association'],
        });

        if (!application)
            throw new NotFoundException('Application not found');

        application.status = status;
        if (applicationAnswer)
            application.applicationAnswer = applicationAnswer;

        if (status === ApplicationStatus.APPROVED) {
            application.user.association = application.association;
            await this.userRepository.save(application.user);
        }

        return this.associationApplicationRepository.save(application);
    }

    async setApplicationQuestion(associationId: string, setQuestionDto: SetApplicationQuestionDto) {
        const association = await this.associationRepository.findOne({ where: { id: associationId } });
        if (!association)
            throw new NotFoundException('Association not found');

        association.applicationQuestion = setQuestionDto.question;
        return this.associationRepository.save(association);
    }

    async getApplicationsByAssociation(associationId: string) {
        return this.associationApplicationRepository.find({
            where: { association: { id: associationId } },
            relations: ['user'],
        });
    }

    async getApplicationsByUser(userId: string) {
        return this.associationApplicationRepository.find({
            where: { user: { id: userId } },
            relations: ['association'],
        });
    }*/
}
