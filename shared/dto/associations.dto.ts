import { PublicMediaDto } from "@src/shared/dto/media.dto";
import { PublicUserDto } from "@src/shared/dto/user.dto";
import { Expose, Type } from "class-transformer";
import { TypeAssociationsDto } from "./type-associations.dto";
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

  @Expose()
  @Type(() => PublicUserDto)
  users: PublicUserDto[];

  @Expose() localisation: string;
  @Expose() description: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}
