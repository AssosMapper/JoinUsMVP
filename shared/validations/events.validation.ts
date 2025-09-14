import * as yup from "yup";
import { CreateEventDto, UpdateEventDto } from "../dto/events.dto";
import { ACCENT_STRING_REGEX } from "../utils/yup.util";

export const createEventSchema = yup.object().shape({
  titre: yup.string()
    .required("Le titre est requis")
    .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
    .max(255, "Le titre ne peut pas dépasser 255 caractères"),
  
  description: yup.string()
    .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
    .required("La description est requise")
    .max(1000, "La description ne peut pas dépasser 1000 caractères"),
  
  date: yup.date()
    .required("La date est requise")
    .min(new Date(), "La date ne peut pas être dans le passé"),
  
  associationId: yup.string()
    .uuid("L'association doit être valide")
    .optional(),
  
  typeEventId: yup.string()
    .uuid("Le type d'événement doit être valide")
    .required("Le type d'événement est requis"),
  
  isPublic: yup.boolean()
    .required("Le statut public/privé est requis"),

  content: yup.string().optional(),
  
}) satisfies yup.ObjectSchema<CreateEventDto>;

export const updateEventSchema = yup.object().shape({
  id: yup.string()
    .uuid("L'ID de l'événement doit être un UUID valide")
    .required("L'ID de l'événement est requis"),

  titre: yup.string()
    .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
    .max(255, "Le titre ne peut pas dépasser 255 caractères")
    .optional(),
  
  description: yup.string()
    .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional(),
  
  date: yup.date()
    .min(new Date(), "La date ne peut pas être dans le passé")
    .optional(),

  associationId: yup.string()
    .uuid("L'association doit être valide")
    .optional(),
  
  typeEventId: yup.string()
    .uuid("Le type d'événement doit être valide")
    .optional(),
  
  isPublic: yup.boolean().optional(),

  content: yup.string().optional(),
  
}) satisfies yup.ObjectSchema<UpdateEventDto>; 