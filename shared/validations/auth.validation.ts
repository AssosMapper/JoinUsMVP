import {
  ForgotPasswordDto,
  ResetPasswordDto,
  RegisterDto,
} from "../dto/auth.dto";
import * as yup from "yup";
import { ACCENT_STRING_REGEX } from "../utils/yup.util";

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Veuillez entrer une adresse email valide")
    .required("L'email est requis"),
}) satisfies yup.ObjectSchema<ForgotPasswordDto>;

export const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Veuillez entrer une adresse email valide")
    .required("L'email est requis"),
  token: yup.string().required("Le token est requis"),
  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
    )
    .required("Le mot de passe est requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("La confirmation du mot de passe est requise"),
}) satisfies yup.ObjectSchema<ResetPasswordDto>;

export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .matches(
      /^[a-zA-ZÀ-ÿ\s-']+$/,
      "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    )
    .required("Le prénom est requis"),
  lastName: yup
    .string()
    .matches(ACCENT_STRING_REGEX, "Caractères non autorisés")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .matches(
      /^[a-zA-ZÀ-ÿ\s-']+$/,
      "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    )
    .required("Le nom est requis"),
  email: yup
    .string()
    .email("Veuillez entrer une adresse email valide")
    .max(255, "L'email ne peut pas dépasser 255 caractères")
    .required("L'email est requis"),
  password: yup
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
    )
    .required("Le mot de passe est requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
    .required("La confirmation du mot de passe est requise"),
  phone: yup
    .string()
    .matches(
      /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
      "Le numéro de téléphone doit être un numéro français valide"
    )
    .optional(),
  localisation: yup.string().optional(),
  image: yup.string().optional(),
}) satisfies yup.ObjectSchema<RegisterDto>;
