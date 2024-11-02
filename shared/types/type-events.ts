import { Event } from './event';

export interface TypeEvents {
  id?: number;
  name: string;
  description?: string;
  events: Event[];
}
