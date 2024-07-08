export interface Event {
    id?: number;
    titre: string;
    description: string;
    image?: string;
    date: Date | string;
    lieu: string;
    association_id: number;
    user_id: number;
    type_event_id: number;
    isPublic: boolean;
  }