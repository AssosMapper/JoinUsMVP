import { Association } from "./association.types";

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  localisation: string;
  image: string;
  associations: Association[];
  roles: string[];
}