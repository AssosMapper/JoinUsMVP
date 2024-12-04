export class RemoveMemberDto {
  userId: string;
}

export class MemberDto {
  id: string;
  first_name: string;
  last_name: string;
  image?: string;
}

export interface CreateAssociationDto {
  name: string;
  isPublic: boolean;
  applicationQuestion?: string;
  typeIds: string[];
}

export interface UpdateAssociationDto extends Partial<CreateAssociationDto> {}
