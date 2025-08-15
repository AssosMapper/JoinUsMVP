import { Expose } from "class-transformer";
import * as yup from "yup";
import { PublicAssociationDto } from "./associations.dto";
import { LocalisationDto } from "./localisation.dto";
import { PublicMediaDto } from "./media.dto";
import { TypeEventsDto } from "./type-events.dto";
import { PublicUserDto } from "./user.dto";
import { ACCENT_STRING_REGEX } from "../utils/yup.util";

export const getEventsByMonthSchema = yup
  .object()
  .shape({
    year: yup.number().required("L'année est requise"),
    month: yup.number().min(1).max(12).required("Le mois est requis"),
    isValid: yup.boolean().optional(),
    search: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").max(255).optional(),
    typeEventId: yup.string().uuid().optional(),
  })
  .required();

export type GetEventsByMonthDto = yup.InferType<typeof getEventsByMonthSchema>;

export const getFilteredEventsSchema = yup
  .object()
  .shape({
    minDate: yup.date().optional(),
    maxDate: yup.date().optional(),
    isValid: yup.boolean().optional(),
    search: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").max(255).optional(),
    typeEventId: yup.string().uuid().optional(),
    page: yup.number().min(1).optional().default(1),
    limit: yup.number().min(1).max(100).optional().default(10),
  })
  .required();

export type GetFilteredEventsDto = yup.InferType<typeof getFilteredEventsSchema>;

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
  localisation?: LocalisationDto;

  @Expose()
  association?: PublicAssociationDto;

  @Expose()
  user: PublicUserDto;

  @Expose()
  typeEvent: TypeEventsDto;

  @Expose()
  isPublic: boolean;

  @Expose()
  isValid: boolean;
}

export class BaseEventDto {
  @Expose()
  titre: string;

  @Expose()
  description: string;

  @Expose()
  date: Date;

  @Expose()
  associationId?: string;

  @Expose()
  typeEventId: string;

  @Expose()
  isPublic: boolean;

}

export class CreateEventDto extends BaseEventDto {}

export class UpdateEventDto {
  @Expose()
  id: string;

  @Expose()
  titre?: string;

  @Expose()
  description?: string;

  @Expose()
  date?: Date;

  @Expose()
  associationId?: string;

  @Expose()
  typeEventId?: string;

  @Expose()
  isPublic?: boolean;

}
