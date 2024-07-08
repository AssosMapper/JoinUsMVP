export interface Association {
    id?: number;
    name: string;
    address?: string;
    code_postal?: string;
    ville?: string;
    description: string;
    image?: string;
    user_id: number;
    dateCreated?: Date;
    members?: number;
    typeIds: number[];
  }
  