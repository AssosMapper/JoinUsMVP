export interface Association {
    id?: string;
    name: string;
    localisation?: string;
    description: string;
    image?: string;
    dateCreated?: Date;
    members?: number;
    typeIds: number[];
  }
  