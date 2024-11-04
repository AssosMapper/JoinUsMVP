import { Association } from "./association";
import { User } from "./user";

export enum ApplicationStatus {
  IN_PROGRESS = '0',
  APPROVED = '1',
  DENIED = '2',
}


export interface AssociationApplication {
    id?: string;
    user: User;
    association: Association;
    associationId: string;
    status: ApplicationStatus;  
    applicationAnswer?: string; 
    applicationQuestion?: string; 
    createdAt?: Date;
    updatedAt?: Date;
  }