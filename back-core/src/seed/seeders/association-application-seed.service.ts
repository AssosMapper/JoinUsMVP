import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssociationApplication, ApplicationStatus } from '../../association-applications/entities/association-application.entity';
import { User } from '../../users/entities/user.entity';
import { Association } from '../../associations/entities/association.entity';

@Injectable()
export class AssociationApplicationSeedService {
    constructor(
        @InjectRepository(AssociationApplication)
        private readonly associationApplicationRepository: Repository<AssociationApplication>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Association)
        private readonly associationRepository: Repository<Association>,
    ) {}

    async seed() {
        const users = await this.userRepository.find();
        const associations = await this.associationRepository.find();

        if (users.length === 0 || associations.length === 0) {
            console.log('No users or associations found. Skipping AssociationApplication seeding.');
            return;
        }

        const applications = [];

        for (let i = 0; i < 5; i++) {
            const application = new AssociationApplication();
            application.user = users[Math.floor(Math.random() * users.length)];
            application.association = associations[Math.floor(Math.random() * associations.length)];
            application.status = ApplicationStatus.IN_PROGRESS;
            application.applicationQuestion = "Pourquoi voulez-vous rejoindre notre association ?";
            application.applicationAnswer = "Je souhaite m'impliquer dans des actions locales.";
            applications.push(application);
        }

        await this.associationApplicationRepository.save(applications);
        console.log('AssociationApplications seeded successfully.');
    }
}

