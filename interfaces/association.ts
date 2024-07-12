export interface Association {
    id?: number;
    name: string;
    localisation?: string;
    description: string;
    image?: string;
    user_id: number;
    dateCreated?: Date;
    members?: number;
    typeIds: number[];
  }
  