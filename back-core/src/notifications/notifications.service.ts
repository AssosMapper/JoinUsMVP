import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationSseEnum } from '@shared/types/notification';
import { map, Observable, Subject } from 'rxjs';
import { In, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Notification } from './entities/notification.entity';
@Injectable()
export class NotificationsService {
  private notificationSubjects: Map<string, Subject<MessageEvent>> = new Map();

  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const user = await this.userRepository.findOne({
      where: { id: createNotificationDto.userId },
    });

    if (!user) throw new NotFoundException(`L'utilisateur n'existe pas`);

    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      user,
    });
    const result = await this.notificationRepository.save(notification);
    const unreadCount = await this.countUnreadNotifications(user.id);
    this.notificationSubjects.get(user.id).next({
      data: { notification: result, unreadCount },
      type: NotificationSseEnum.NEW_NOTIFICATION,
    } as MessageEvent);

    return result;
  }

  async findAllForUser(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<[Notification[], number]> {
    const { skip, take } = paginationQuery;

    return this.notificationRepository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!notification) {
      throw new NotFoundException(`La notification n'a pas été trouvée`);
    }

    await this.notificationRepository.remove(notification);
  }

  async markAsRead(ids: string[], userId: string): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      where: {
        id: In(ids),
        user: { id: userId },
      },
    });

    if (notifications.length === 0) {
      throw new NotFoundException(`Aucune notification n'a été trouvée`);
    }

    notifications.forEach((notification) => {
      notification.isRead = true;
    });

    return this.notificationRepository.save(notifications);
  }

  async countUnreadNotifications(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: {
        user: { id: userId },
        isRead: false,
      },
    });
  }

  newNotification(userId: string): Observable<MessageEvent> {
    if (!this.notificationSubjects.has(userId))
      this.notificationSubjects.set(userId, new Subject<MessageEvent>());

    return this.notificationSubjects.get(userId).pipe(
      map((messageEvent: MessageEvent) => ({
        ...messageEvent,
        data: JSON.stringify(messageEvent.data),
      })),
    );
  }
}
