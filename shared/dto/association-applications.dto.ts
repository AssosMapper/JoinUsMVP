import { Expose, Type } from "class-transformer";
import { ApplicationStatus } from "../types/association-applications";
import { PublicAssociationDto } from "./associations.dto";
import { PublicUserDto } from "./user.dto";

export class JoinAssociationDto {
  associationId: string;

  applicationAnswer: string;
}

export class UpdateApplicationStatusDto {
  status: ApplicationStatus;
}

export class AssociationApplicationDto {
  @Expose() id: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
  @Expose() associationId: string;
  @Expose() status: ApplicationStatus;
  @Expose() applicationAnswer: string;
  @Expose() applicationQuestion: string;

  @Expose()
  @Type(() => PublicUserDto)
  user: PublicUserDto;

  @Expose()
  @Type(() => PublicAssociationDto)
  association: PublicAssociationDto;
}
