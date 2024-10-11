export interface Event{
    id?: string;
    titre: string;
    description: string;
    date: string;
    localisation: string;
    associationId: number;
    typeEventId: number;
    isPublic: boolean;
}