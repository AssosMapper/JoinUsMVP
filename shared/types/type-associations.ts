import { Association } from './association';

export interface TypeAssociations {
  id?: number;
  name: string;
  description?: string;
  associations: Association[];
}
