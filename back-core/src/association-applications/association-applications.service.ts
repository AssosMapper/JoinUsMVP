import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  JoinAssociationDto,
  UpdateApplicationStatusDto,
} from '@shared/dto/association-applications.dto';
import { ApplicationStatus } from '@shared/types/association-applications';
import { Repository } from 'typeorm';
import { Association } from '../associations/entities/association.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';
import { AssociationApplication } from './entities/association-application.entity';

@Injectable()
export class AssociationApplicationsService {
  constructor(
    @Inject('ASSOCIATION_APPLICATION_REPOSITORY')
    private readonly associationApplicationRepository: Repository<AssociationApplication>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
    private readonly notificationsService: NotificationsService,
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

    if (association.isPublic) {
      user.associations.push(association);
      await this.userRepository.save(user);
      await this.notificationsService.create({
        title: 'Bienvenue !',
        message: `Vous avez rejoint l'association ${association.name}`,
        userId: user.id,
      });
      return;
    }

    const application =
      (await this.associationApplicationRepository.findOne({
        where: {
          user: { id: userId },
          association: { id: associationId },
          status: ApplicationStatus.IN_PROGRESS,
        },
      })) || new AssociationApplication();

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
      order: {
        createdAt: 'DESC',
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
      await this.notificationsService.create({
        title: 'Candidature acceptée',
        message: `Votre candidature pour rejoindre l'association ${application.association.name} a été acceptée !`,
        userId: application.user.id,
      });
    }

    if (status === ApplicationStatus.DENIED) {
      await this.notificationsService.create({
        title: 'Candidature refusée',
        message: `Votre candidature pour rejoindre l'association ${application.association.name} a été refusée.`,
        userId: application.user.id,
      });
    }

    return this.associationApplicationRepository.remove(application);
  }
  async getCurrentApplication(userId: string, associationId: string) {
    const application = await this.associationApplicationRepository.findOne({
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
    const applications = await this.associationApplicationRepository
      .createQueryBuilder('application')
      .distinctOn(['application.associationId'])
      .where('application.userId = :userId', { userId })
      .andWhere('application.associationId IN (:...associationIds)', {
        associationIds,
      })
      .orderBy('application.associationId')
      .addOrderBy('application.createdAt', 'DESC')
      .getMany();

    return applications;
  }
  async getApplicationsByAssociation(associationId: string) {
    const applications = await this.associationApplicationRepository.find({
      where: {
        association: { id: associationId },
        status: ApplicationStatus.IN_PROGRESS,
      },
      relations: ['user', 'association'],
      order: {
        createdAt: 'DESC',
      },
    });

    return applications;
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
