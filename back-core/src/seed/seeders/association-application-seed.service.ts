import { Inject, Injectable } from '@nestjs/common';
import { ApplicationStatus } from '@shared/types/association-applications';
import { Repository } from 'typeorm';
import { AssociationApplication } from '../../association-applications/entities/association-application.entity';
import { Association } from '../../associations/entities/association.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AssociationApplicationSeedService {
  constructor(
    @Inject('ASSOCIATION_APPLICATION_REPOSITORY')
    private readonly associationApplicationRepository: Repository<AssociationApplication>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('ASSOCIATION_REPOSITORY')
    private readonly associationRepository: Repository<Association>,
  ) {}

  async seed() {
    await this.drop();

    const users = await this.userRepository.find({
      relations: ['associations'],
    });
    const associations = await this.associationRepository.find();

    if (users.length === 0 || associations.length === 0) {
      console.log(
        'No users or associations found. Skipping AssociationApplication seeding.',
      );
      return;
    }

    const applications = [];
    const statuses = [ApplicationStatus.IN_PROGRESS];
    const questions = [
      'Pourquoi voulez-vous rejoindre notre association ?',
      'Quelles sont vos motivations ?',
      "Que pensez-vous apporter à l'association ?",
    ];
    const answers = [
      "Je souhaite m'impliquer dans des actions locales.",
      "Je partage les valeurs de l'association.",
      "J'ai des compétences qui pourraient être utiles.",
    ];

    // Créer des applications pour chaque utilisateur
    for (const user of users) {
      // Filtrer les associations auxquelles l'utilisateur n'appartient pas déjà
      const availableAssociations = associations.filter(
        (assoc) =>
          !user.associations.some((userAssoc) => userAssoc.id === assoc.id),
      );

      if (availableAssociations.length === 0) continue;

      // Créer 2-3 applications par utilisateur
      const numApplications = Math.floor(Math.random() * 2) + 2;

      for (
        let i = 0;
        i < numApplications && i < availableAssociations.length;
        i++
      ) {
        const application = new AssociationApplication();
        application.user = user;
        application.association = availableAssociations[i];
        application.status =
          statuses[Math.floor(Math.random() * statuses.length)];
        application.applicationQuestion =
          questions[Math.floor(Math.random() * questions.length)];
        application.applicationAnswer =
          answers[Math.floor(Math.random() * answers.length)];
        applications.push(application);
      }
    }

    await this.associationApplicationRepository.save(applications);
    console.log(`Seeded ${applications.length} association applications.`);
  }

  private async drop() {
    await this.associationApplicationRepository.delete({});
  }
}
