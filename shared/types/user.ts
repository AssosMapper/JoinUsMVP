import { Association } from './association';
import { Role } from './roles';

export interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  localisation?: string;
  image?: string;
  deletedAt?: Date;
  associations: Association[];
  roles: Role[];
}

