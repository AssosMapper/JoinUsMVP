import {
  CreateAssociationDto,
  UpdateAssociationDto,
} from "@shared/dto/associations.dto";
import * as yup from "yup";

export const associationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .required("Le nom est requis"),
  isPublic: yup.boolean(),
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
    .min(1, "Sélectionnez au moins un type")
    .required("Les types sont requis"),
}) satisfies yup.ObjectSchema<CreateAssociationDto | UpdateAssociationDto>;
