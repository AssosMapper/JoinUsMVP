import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  ApplicationStatus,
  AssociationApplication,
} from './entities/association-application.entity';
import { User } from '../users/entities/user.entity';
import { Association } from '../associations/entities/association.entity';
import { JoinAssociationDto } from './dto/join-association.dto';

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

  async joinAssociation(
    userId: string,
    joinAssociationDto: JoinAssociationDto,
  ) {
    const { associationId, applicationAnswer } = joinAssociationDto;
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['associations'],
    });
    const association = await this.associationRepository.findOne({
      where: { id: associationId },
    });

    if (!user || !association)
      throw new NotFoundException(
        "L'utilisateur ou l'association n'a pas été trouvé(e)",
      );

    if (user.associations.some((a) => a.id === associationId)) {
      throw new ConflictException({
        message: `Vous êtes déjà dans cette association`,
      });
    }

    const existingApplication =
      await this.associationApplicationRepository.findOne({
        where: {
          user: { id: userId },
          association: { id: associationId },
          status: ApplicationStatus.IN_PROGRESS,
        },
      });

    if (existingApplication)
      throw new ConflictException({
        message: `Vous avez déjà demandé à joindre cette association`,
      });

    const application = new AssociationApplication();
    application.user = user;
    application.association = association;
    application.applicationQuestion = association.applicationQuestion;
    application.applicationAnswer = applicationAnswer;
    application.status = ApplicationStatus.IN_PROGRESS;
    return this.associationApplicationRepository.save(application);
  }

  async cancelApplication(userId: string, id: string) {
    const application = await this.associationApplicationRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
        status: ApplicationStatus.IN_PROGRESS,
      },
    });

    if (!application)
      throw new NotFoundException(
        'La demande n’a pas été trouvée ou a déjà été traitée',
      );

    await this.associationApplicationRepository.remove(application);
    return { message: 'Application cancelled successfully' };
  }
  /*
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
