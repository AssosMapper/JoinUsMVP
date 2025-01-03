import { Inject, Injectable } from '@nestjs/common';
import { NotificationType } from '@shared/types/notifications';
import { Repository } from 'typeorm';
import { Notification } from '../../notifications/entities/notification.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class NotificationSeedService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private readonly notificationRepository: Repository<Notification>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    await this.drop();

    const users = await this.userRepository.find();

    if (!users.length) {
      console.log('No users found. Skipping Notification seeding.');
      return;
    }

    const notifications = [];
    const messages = [
      {
        type: NotificationType.APPLICATION,
        message: 'Votre candidature a été acceptée',
      },
      {
        type: NotificationType.EVENT,
        message: 'Un nouvel événement a été créé',
      },
      { type: NotificationType.EVENT, message: 'Rappel: événement à venir' },
      {
        type: NotificationType.ASSOCIATION,
        message: "Mise à jour importante de l'association",
      },
      {
        type: NotificationType.APPLICATION,
        message: "Nouvelle demande d'adhésion",
      },
    ];

    // Créer des notifications pour chaque utilisateur
    for (const user of users) {
      const numNotifications = Math.floor(Math.random() * 5) + 3; // 3-7 notifications par utilisateur

      for (let i = 0; i < numNotifications; i++) {
        const messageIndex = Math.floor(Math.random() * messages.length);
        const notification = new Notification();
        notification.user = user;
        notification.title = `Notification ${i + 1}`;
        notification.message = messages[messageIndex].message;
        notification.isRead = Math.random() > 0.7; // 30% de chances d'être lu
        notification.createdAt = new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
        ); // Dans les 7 derniers jours

        notifications.push(notification);
      }
    }

    await this.notificationRepository.save(notifications);
    console.log(`Seeded ${notifications.length} notifications.`);
  }

  private async drop() {
    await this.notificationRepository.delete({});
  }
}
