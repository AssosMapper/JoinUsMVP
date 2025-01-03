import { Expose, Type } from "class-transformer";
import { PublicMediaDto } from "./media.dto";
import { TypeAssociationsDto } from "./type-associations.dto";
import { PublicUserDto } from "./user.dto";
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
  image?: string;
}

export interface UpdateAssociationDto extends Partial<CreateAssociationDto> {}

export class PublicAssociationDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() isPublic: boolean;
  @Expose() applicationQuestion: string;

  @Expose()
  @Type(() => PublicMediaDto)
  image: PublicMediaDto;

  @Expose()
  @Type(() => TypeAssociationsDto)
  types: TypeAssociationsDto[];

  @Expose() localisation: string;
  @Expose() description: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}

export class MyAssociationsDto extends PublicAssociationDto {
  @Expose()
  @Type(() => PublicUserDto)
  users: PublicUserDto[];
}
