import { TypeAssociations } from "./type-associations";
import { User } from "./user";

export interface Association {
  id?: string;
  name: string;
  localisation?: string;
  description: string;
  image?: string;
  users: User[];
  members?: number;
  applicationQuestion?: string;
  types: TypeAssociations[];
}
