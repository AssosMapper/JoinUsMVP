import { Media } from "../types/media";
import { Association } from "./association";
import { Role } from "./roles";

export interface User {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  localisation?: string;
  image?: Media;
  deletedAt?: Date;
  associations: Association[];
  roles: Role[];
}

export type PublicUser = Pick<
  User,
  "id" | "first_name" | "last_name" | "image"
>;
