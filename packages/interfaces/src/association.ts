export interface Association {
    id?: string;
    name: string;
    localisation?: string;
    description: string;
    image?: string;
    // user_id: number;
    dateCreated?: Date;
    members?: number;
    typeIds: number[];
  }
  