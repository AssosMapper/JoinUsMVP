import * as yup from "yup";
import { CreateEventDto, UpdateEventDto } from "../dto/events.dto";

export const createEventSchema = yup.object().shape({
  titre: yup.string()
    .required("Le titre est requis")
    .max(255, "Le titre ne peut pas dépasser 255 caractères"),
  
  description: yup.string()
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
  
  isValid: yup.boolean().optional(),
}) satisfies yup.ObjectSchema<CreateEventDto>;

export const updateEventSchema = yup.object().shape({
  id: yup.string()
    .uuid("L'ID de l'événement doit être un UUID valide")
    .required("L'ID de l'événement est requis"),

  titre: yup.string()
    .max(255, "Le titre ne peut pas dépasser 255 caractères")
    .optional(),
  
  description: yup.string()
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
  
  isValid: yup.boolean().optional(),
}) satisfies yup.ObjectSchema<UpdateEventDto>; 