import { Expose, Type } from "class-transformer";
import * as yup from "yup";
import { PublicAssociationDto } from "./associations.dto";
import { PublicMediaDto } from "./media.dto";
import { TypeEventsDto } from "./type-events.dto";
import { PublicUserDto } from "./user.dto";

export const getEventsByMonthSchema = yup
  .object()
  .shape({
    year: yup.number().required("L'année est requise"),
    month: yup.number().min(1).max(12).required("Le mois est requis"),
    isValid: yup.boolean().optional(),
    search: yup.string().max(255).optional(),
    typeEventId: yup.string().uuid().optional(),
  })
  .required();

export type GetEventsByMonthDto = yup.InferType<typeof getEventsByMonthSchema>;

export class EventDto {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  titre: string;

  @Expose()
  description: string;

  @Expose()
  image: PublicMediaDto;

  @Expose()
  date: Date;

  @Expose()
  localisation?: string;

  @Expose()
  association: PublicAssociationDto;

  @Expose()
  user: PublicUserDto;

  @Expose()
  typeEvent: TypeEventsDto;

  @Expose()
  isPublic: boolean;

  @Expose()
  isValid: boolean;
}
