export interface Association{
    id?: string;
    name?: string;
    description?: string;
    localisation?: string;
    members?: number;
    image?:string;
    typeIds?: string[];
}

export interface IUpdateAssociation{
    name?: string;
    description?: string;
    localisation?: string;
    members?: number;
    image?:string;
    typeIds?: string[];
}

