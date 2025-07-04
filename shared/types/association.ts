import { Media } from "@shared/types/media";
import { TypeAssociations } from "./type-associations";
import { PublicUser, User } from "./user";
import { Localisation } from "./localisation";

export interface Association {
  id?: string;
  name: string;
  localisation?: Localisation;
  description: string;
  image?: Media;
  users: User[];
  members?: number;
  applicationQuestion?: string;
  isPublic?: boolean;
  types: TypeAssociations[];
}

export interface PublicAssociation extends Omit<Association, "users"> {
  users: PublicUser[];
}
