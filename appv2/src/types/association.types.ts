export interface IAssociation{
    name: string;
    description: string;
    localisation: string;
    members: number;
    image:string;
    typeIds: string[];
}

export interface IUpdateAssociation{
    name?: string;
    description?: string;
    localisation?: string;
    members?: number;
    image?:string;
    typeIds?: string[];
}