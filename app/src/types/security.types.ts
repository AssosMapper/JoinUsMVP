import * as yup from "yup";
import { registerSchema as sharedRegisterSchema } from "@shared/validations/auth.validation";

export interface ICredentials {
  email: string;
  password: string;
}

export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  localisation?: string;
  image?: string;
}

export const credentialSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

export const registerSchema = sharedRegisterSchema;
