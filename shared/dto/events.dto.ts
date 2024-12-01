import * as yup from "yup";
import { PaginationDto } from "./pagination.dto";

export const getEventsByMonthSchema = yup
  .object()
  .shape({
    year: yup.number().required("L'année est requise"),
    month: yup.number().min(1).max(12).required("Le mois est requis"),
    page: yup.number().min(1).default(1),
    limit: yup.number().min(1).default(10),
    isValid: yup.boolean().optional(),
    search: yup.string().max(255).optional(),
  })
  .required();
export type GetEventsByMonthDto = yup.InferType<typeof getEventsByMonthSchema> &
  PaginationDto;
