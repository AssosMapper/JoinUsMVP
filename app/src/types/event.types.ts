import type { Association, TypeEvents } from "@shared/types";
import type { Localisation } from "@shared/types/localisation";
import type { Media } from "@shared/types/media";
import { Expose, Transform, plainToInstance } from "class-transformer";
import type { Event as SharedEvent } from "@shared/types/event";

export interface IEvent {
  id?: string;
  titre?: string;
  description?: string;
  image?: Media;
  date?: string;
  localisation?: Localisation;
  associationId?: string;
  typeEventId?: string;
  isPublic?: boolean;
  isValid?: boolean;
}

export class Event {
  id: string;
  titre: string;
  updatedAt: Date;
  createdAt: Date;
  description: string;
  image: Media;
  date: string;
  localisation: Localisation;
  association: Association;
  typeEvent: TypeEvents;
  isPublic: boolean;
  isValid: boolean;
}

export interface EventParticipation {
  id: string;
  registrationDate: Date;
}

export interface EventFilters {
  minDate?: Date;
  maxDate?: Date;
  search?: string;
  isValid?: boolean;
  typeEventId?: string;
}

export interface EventPagination {
  page: number;
  limit: number;
  total: number;
}

export interface FilteredEventsResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}

export class EventCard {
  @Expose()
  id: string;

  @Expose()
  titre: string;

  @Expose()
  description: string;

  @Expose()
  image?: Media;

  @Expose()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @Expose()
  localisation: string;

  @Expose()
  association: Association;

  @Expose()
  typeEvent: TypeEvents;

  @Expose()
  isPublic: boolean;

  @Expose()
  isValid: boolean;

  constructor(partial: Partial<EventCard>) {
    Object.assign(this, partial);
  }

  /**
   * Transforme un objet Event en EventCard pour l'affichage
   */
  static fromEvent(event: SharedEvent): EventCard {
    return plainToInstance(EventCard, event, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Transforme un tableau d'objets Event en tableau d'EventCard
   */
  static fromEvents(events: SharedEvent[]): EventCard[] {
    return events.map((event) => EventCard.fromEvent(event));
  }
}
