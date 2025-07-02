import { Expose, Type } from "class-transformer";
import { PublicMediaDto } from "./media.dto";
import { TypeAssociationsDto } from "./type-associations.dto";
import { PublicUserDto } from "./user.dto";
import { CreateLocalisationDto, LocalisationDto } from "./localisation.dto";

export class RemoveMemberDto {
  userId: string;
}

export class MemberDto {
  id: string;
  first_name: string;
  last_name: string;
  image?: string;
}

export class CreateAssociationDto {
  name: string;
  description: string;
  isPublic: boolean;
  applicationQuestion?: string;
  typeIds: string[];
  localisation: CreateLocalisationDto;
}

export class UpdateAssociationDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
  applicationQuestion?: string;
  typeIds?: string[];
  localisation?: CreateLocalisationDto;
}

export class PublicAssociationDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() isPublic: boolean;
  @Expose() applicationQuestion: string;

  @Type(() => PublicMediaDto)
  @Expose()
  image?: PublicMediaDto;

  @Type(() => TypeAssociationsDto)
  @Expose()
  types: TypeAssociationsDto[];

  @Type(() => LocalisationDto)
  @Expose()
  localisation?: LocalisationDto;

  @Expose() description: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}

export class MyAssociationsDto extends PublicAssociationDto {
  @Type(() => PublicUserDto)
  @Expose()
  users: PublicUserDto[];
}
