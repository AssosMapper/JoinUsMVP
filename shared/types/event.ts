import { Association } from './association';
import { User } from './user';
import { TypeEvents } from './type-events';

export interface Event {
  id?: number;
  titre: string;
  description: string;
  image?: string;
  date: Date;
  localisation: string;
  association: Association;
  user: User;
  typeEvent: TypeEvents;
  isPublic: boolean;
  isValid: boolean;
}
