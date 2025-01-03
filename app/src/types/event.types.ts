<<<<<<< HEAD
export interface Event{
    id?: string;
    titre: string;
    description: string;
    date: string;
    localisation: string;
    associationId: number;
    typeEventId: number;
    isPublic: boolean;
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
}