import {
  JoinAssociationDto,
  UpdateApplicationStatusDto,
} from "../dto/association-applications.dto";
import * as yup from "yup";
import { ApplicationStatus } from "../types/association-applications";
import { ACCENT_STRING_REGEX } from "../utils/yup.util";

export const joinAssociationSchema = yup.object().shape({
  associationId: yup.string().uuid().required("L'association est requise"),
  applicationAnswer: yup
    .string()
    .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
    .max(255, "La réponse ne peut pas dépasser 255 caractères")
      .nullable()
      .optional(),
}) satisfies yup.ObjectSchema<JoinAssociationDto>;

export const updateApplicationStatusSchema = yup.object().shape({
  status: yup
    .string()
    .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
    .oneOf(Object.values(ApplicationStatus), "Le statut est incorrect")
    .required("Le statut est requis"),
}) satisfies yup.ObjectSchema<UpdateApplicationStatusDto>;
