import { Association } from './association';

export interface TypeAssociations {
  id?: string;
  name: string;
  description?: string;
  associations: Association[];
}
