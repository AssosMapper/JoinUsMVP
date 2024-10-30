import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import {  AssociationApplication} from './entities/association-application.entity';
import { ApplicationStatus } from '@shared/types/association-applications';
import { User } from '../users/entities/user.entity';
import { Association } from '../associations/entities/association.entity';
import { JoinAssociationDto } from './dto/join-association.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

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

  async updateApplicationStatus(
    id,
    updateApplicationStatusDto: UpdateApplicationStatusDto,
  ) {
    const { status } = updateApplicationStatusDto;
    const application = await this.associationApplicationRepository.findOne({
      where: { id: id },
      relations: ['user.associations', 'association'],
    });

    if (!application) throw new NotFoundException('Candidature non trouvée');

    if (
      application.user.associations.some(
        (a) => a.id === application.association.id,
      )
    )
      throw new ConflictException({
        message: `Cet utilisateur est déjà dans cette association`,
      });

    application.status = status;

    if (status === ApplicationStatus.APPROVED) {
      application.user.associations.push(application.association);
      await this.userRepository.save(application.user);
    }

    return this.associationApplicationRepository.save(application);
  }
  async getCurrentApplication(userId: string, associationId: string) {
    let application = await this.associationApplicationRepository.findOne({
      where: {
        user: { id: userId },
        association: { id: associationId },
        status: ApplicationStatus.IN_PROGRESS,
      },
    });
    if (!application) throw new NotFoundException('Candidature non trouvée');
    return application;
  }
  async getApplicationsByAssociations(
    userId: string,
    associationIds: string[],
  ) {
    const applications = await this.associationApplicationRepository.find({
      where: {
        user: { id: userId },
        association: { id: In(associationIds) },
      },
    });
    const mostRecentApplications = Object.values(
      applications.reduce((acc, app) => {
        if (
          !acc[app.association.id] ||
          app.createdAt > acc[app.association.id].createdAt
        ) {
          acc[app.association.id] = app;
        }
        return acc;
      }, {}),
    );

    return mostRecentApplications;
  }
  /*
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
