export interface Association {
  id?: string;
  name: string;
  localisation: string;
  description: string;
  image?: string;
  members: number;
  typeIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdateAssociation{
    name?: string;
    description?: string;
    localisation?: string;
    members?: number;
    image?:string;
    typeIds?: string[];
}

