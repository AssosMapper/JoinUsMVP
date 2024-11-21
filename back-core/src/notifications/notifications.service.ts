import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
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

    return this.notificationRepository.save(notification);
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

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!notification) {
      throw new NotFoundException(`La notification n'a pas été trouvée`);
    }

    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }
}
