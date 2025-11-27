import { NotificationType } from '../notification.entity';

export class CreateNotificationDto {
    userId?: string;
    type: NotificationType;
    title: string;
    message: string;
    icon?: string;   // کلاس آیکون مثل "ti ti-coin text-rose-600"
    color?: string;  // رنگ پس‌زمینه مثل "bg-rose-100"
}