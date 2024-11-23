import { User } from "./user";

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationSseEnum {
  NEW_NOTIFICATION = "new-notification",
}
