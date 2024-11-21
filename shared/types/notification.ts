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
