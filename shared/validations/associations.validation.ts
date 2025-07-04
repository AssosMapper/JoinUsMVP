import { createLocalisationSchema } from "./localisation.validation";
import * as yup from "yup";

export const createAssociationSchema = yup.object().shape({
  name: yup.string().min(2).max(100).required("Le nom est requis"),
  description: yup.string().required("La description est requise"),
  isPublic: yup.boolean().required("Le type d'association est requis"),
  applicationQuestion: yup.string().when(["isPublic"], {
    is: (isPublic: boolean) => !isPublic,
    then: (schema) =>
      schema
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
  name: yup.string().min(2).max(100).optional(),
  description: yup.string().optional(),
  isPublic: yup.boolean().optional(),
  applicationQuestion: yup.string().when(["isPublic"], {
    is: (isPublic: boolean) => !isPublic,
    then: (schema) =>
      schema
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
  localisation: createLocalisationSchema.optional(),
});

// Garde l'ancien schéma pour la compatibilité
export const associationSchema = createAssociationSchema;
