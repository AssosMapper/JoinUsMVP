export interface IEvent{
    id: number;
    titre: string;
    description: string;
    date: string;
    localisation: string;
    associationId: number;
    typeEventId: number;
    isPublic: boolean;
}