import * as yup from "yup";

export interface ICredentials {
    email: string;
    password: string;
}

export interface IRegister{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    localisation: string;
    image: string;
}

export const credentialSchema =  yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
});

export const registerSchema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required(),
    phone: yup.string().matches(/^0\d{9}$/).required(),
    localisation: yup.string().required(),
    image: yup.string().required(),
});