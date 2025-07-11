import { Association } from "./association";

export interface TypeAssociation {
  id?: string;
  name: string;
  description?: string;
  associations: Association[];
}
