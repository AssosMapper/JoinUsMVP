import { Association } from "./association";
import { Media } from "./media";
import { TypeEvents } from "./type-events";
import { User } from "./user";

export interface Event {
  id?: string;
  titre?: string;
  description: string;
  image?: Media;
  date: Date;
  localisation: string;
  association: Association;
  user: User;
  typeEvent: TypeEvents;
  isPublic: boolean;
  isValid: boolean;
}
