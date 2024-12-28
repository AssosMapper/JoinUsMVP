export interface IEvent {
  id?: string;
  titre: string;
  description: string;
  image: string;
  date: string;
  localisation: string;
  associationId: string;
  typeEventId: string;
  isPublic: boolean;
  isValid: boolean;
}