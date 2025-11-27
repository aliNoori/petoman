import {
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Delete,
    Body,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
    constructor(private service: NotificationService) {}

    // 📌 ایجاد نوتیفیکیشن
    @Post()
    create(@Body() dto: CreateNotificationDto) {
        return this.service.create(dto);
    }

    // 📌 دریافت همه نوتیف‌های یک کاربر
    @Get('user/:id')
    getUserNotifications(@Param('id') id: string) {
        return this.service.findUserNotifications(id);
    }
    // 📌 گرفتن فقط نوتیف‌های خوانده نشده
    @Get('user/:id/unread')
    getUserUnread(@Param('id') id: string) {
        return this.service.findUnread(id);
    }

    // 📌 شمارش نوتیف‌های unread
    @Get('user/:id/unread-count')
    getUnreadCount(@Param('id') id: string) {
        return this.service.countUnread(id);
    }

    // 📌 خواندن یک نوتیف
    @Patch('read/:id')
    markRead(@Param('id') id: string) {
        return this.service.markAsRead(id);
    }

    // 📌 خواندن همه نوتیف‌های یک کاربر
    @Patch('user/:id/read-all')
    markAllRead(@Param('id') id: string) {
        return this.service.markAllAsRead(id);
    }

    // 📌 حذف یک نوتیف
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }

    // 📌 حذف همه نوتیف‌های یک کاربر
    @Delete('user/:id')
    deleteUserNotifications(@Param('id') id: string) {
        return this.service.deleteAllForUser(id);
    }
}
