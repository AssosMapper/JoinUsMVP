import * as yup from "yup";
import { ACCENT_STRING_REGEX } from "../utils/yup.util";

export const createAssociationSchema = yup.object().shape({
  name: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").min(2).max(100).required("Le nom est requis"),
  description: yup.string()
  .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
  .required("La description est requise"),
  isPublic: yup.boolean().required("Le type d'association est requis"),
  applicationQuestion: yup.string().when(["isPublic"], {
    is: (isPublic: boolean) => !isPublic,
    then: (schema) =>
      schema
        .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
        .required(
          "La question est requise pour les associations sur candidature"
        )
        .max(255, "La question ne peut pas dépasser 255 caractères"),
    otherwise: (schema) => schema.nullable(),
  }),
  typeIds: yup
    .array()
    .of(yup.string().uuid())
    .min(1, "Au moins un type est requis")
    .required("Les types sont requis"),
});

export const updateAssociationSchema = yup.object().shape({
  name: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").min(2).max(100).optional(),
  description: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").optional(),
  isPublic: yup.boolean().optional(),
  applicationQuestion: yup.string().when(["isPublic"], {
    is: (isPublic: boolean) => !isPublic,
    then: (schema) =>
      schema
        .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
        .required(
          "La question est requise pour les associations sur candidature"
        )
        .max(255, "La question ne peut pas dépasser 255 caractères"),
    otherwise: (schema) => schema.nullable(),
  }),
  typeIds: yup
    .array()
    .of(yup.string().uuid())
    .min(1, "Au moins un type est requis")
    .optional(),
});

// Garde l'ancien schéma pour la compatibilité
export const associationSchema = createAssociationSchema;
