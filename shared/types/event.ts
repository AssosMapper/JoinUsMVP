import { Association } from "./association";
import { TypeEvents } from "./type-events";
import { User } from "./user";

export interface Event {
  id?: string;
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
