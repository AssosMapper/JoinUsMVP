import { ForgotPasswordDto, ResetPasswordDto } from "@shared/dto/auth.dto";
import * as yup from "yup";

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
