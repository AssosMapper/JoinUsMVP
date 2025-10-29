import { Event } from "./event";

export interface TypeEvents {
  id?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  events?: Event[];
}
