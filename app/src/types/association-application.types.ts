import { Association } from './association.types';
import { User } from './user.types';

export enum ApplicationStatus {
  IN_PROGRESS = '0',
  APPROVED = '1',
  DENIED = '2',
}

export type AssociationApplication = {
  id?: string;
  user?: User;
  association?: Association;
  status?: ApplicationStatus;
  applicationAnswer?: string | null;
  applicationQuestion?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
