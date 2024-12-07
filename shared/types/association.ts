import { Media } from "@src/shared/types/media";
import { TypeAssociations } from "./type-associations";
import { PublicUser, User } from "./user";

export interface Association {
  id?: string;
  name: string;
  localisation?: string;
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
