<<<<<<< HEAD
export interface IAssociation{
    name: string;
    description: string;
    localisation: string;
    members: number;
    image:string;
    typeIds: string[];
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
}

export interface IUpdateAssociation{
    name?: string;
    description?: string;
    localisation?: string;
    members?: number;
    image?:string;
    typeIds?: string[];
<<<<<<< HEAD
}
=======
}

>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
