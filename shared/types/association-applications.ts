import { Association } from "./association";
import { User } from "./user";

export enum ApplicationStatus {
  IN_PROGRESS = '0',
  APPROVED = '1',
  DENIED = '2',
}


export interface AssociationApplication {
    user: User;
    association: Association;
    status: ApplicationStatus;  
    applicationAnswer?: string; 
    applicationQuestion?: string; 
  }