import * as yup from "yup";

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
