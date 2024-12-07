import {
  CreateAssociationDto,
  UpdateAssociationDto,
} from "@shared/dto/associations.dto";
import * as yup from "yup";

export const associationSchema = yup.object().shape({
  name: yup.string().min(2).max(100).required(),
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
  typeIds: yup.array().of(yup.string().uuid()).min(1).required(),
  image: yup.string().uuid().nullable().optional(),
}) satisfies yup.ObjectSchema<CreateAssociationDto | UpdateAssociationDto>;
