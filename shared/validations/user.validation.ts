import * as yup from "yup";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";

// Schéma de base réutilisable pour les champs utilisateur
const baseUserSchema = {
  first_name: yup
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .matches(
      /^[a-zA-ZÀ-ÿ\s-']+$/,
      "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    ),

  last_name: yup
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .matches(
      /^[a-zA-ZÀ-ÿ\s-']+$/,
      "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    ),

  email: yup
    .string()
    .email("Veuillez entrer une adresse email valide")
    .max(255, "L'email ne peut pas dépasser 255 caractères"),

  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
    ),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas"),

  phone: yup
    .string()
    .matches(
      /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
      "Le numéro de téléphone doit être un numéro français valide"
    ),
};

// Schéma pour la création d'utilisateur (tous les champs requis sauf phone)
export const createUserSchema = yup.object().shape({
  first_name: baseUserSchema.first_name.required("Le prénom est requis"),
  last_name: baseUserSchema.last_name.required("Le nom est requis"),
  email: baseUserSchema.email.required("L'email est requis"),
  password: baseUserSchema.password.required("Le mot de passe est requis"),
  confirmPassword: baseUserSchema.confirmPassword.required(
    "La confirmation du mot de passe est requise"
  ),
  phone: baseUserSchema.phone
    .transform((value, originalValue) => {
      if (value === "" || value === null || originalValue === null || originalValue === undefined) return undefined;
      return value;
    })
    .optional(),
}) satisfies yup.ObjectSchema<CreateUserDto>;

export const updateUserSchema = yup.object().shape({
  first_name: baseUserSchema.first_name.optional(),
  last_name: baseUserSchema.last_name.optional(),
  email: baseUserSchema.email.optional(),
  password: baseUserSchema.password
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  confirmPassword: baseUserSchema.confirmPassword
    .when("password", {
      is: (password: string) => password && password.length > 0,
      then: (schema) =>
        schema.required("La confirmation du mot de passe est requise"),
      otherwise: (schema) => schema.optional(),
    })
    .transform((value) => (value === "" ? undefined : value)),
  phone: baseUserSchema.phone
    .transform((value, originalValue) => {
      if (value === "" || value === null || originalValue === null || originalValue === undefined) return undefined;
      return value;
    })
    .optional(),
  imageId: yup
    .string()
    .uuid("L'ID de l'image doit être un UUID valide")
    .optional(),
}) satisfies yup.ObjectSchema<UpdateUserDto>;
