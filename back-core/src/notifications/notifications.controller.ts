import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  Sse,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@BearAuthToken()
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto, @Req() req: any) {
    return this.notificationsService.findAllForUser(
      req.user.userId,
      paginationQuery,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.notificationsService.remove(id, req.user.userId);
  }

  @Patch('read')
  markAsRead(@Body('ids') ids: string[], @Req() req: any) {
    return this.notificationsService.markAsRead(ids, req.user.userId);
  }

  @Sse('sse')
  notificationStream(@Req() req: any): Observable<MessageEvent> {
    return this.notificationsService.newNotification(req.user.userId);
  }

  @Get('unread/count')
  countUnread(@Req() req: any) {
    return this.notificationsService.countUnreadNotifications(req.user.userId);
  }
}
