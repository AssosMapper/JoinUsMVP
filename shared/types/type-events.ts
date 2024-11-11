import { Event } from "./event";

export interface TypeEvents {
  id?: string;
  name: string;
  description?: string;
  events: Event[];
}
