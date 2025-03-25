import * as yup from "yup";
import { CreateLocalisationDto } from "../dto/localisation.dto";

export const createLocalisationSchema = yup.object().shape({
  street_number: yup.string().required("Le numéro de rue est requis"),
  street_name: yup.string().required("Le nom de la rue est requis"),
  zip: yup.string().required("Le code postal est requis"),
  city: yup.string().required("La ville est requise"),
  country: yup.string().required("Le pays est requis"),
}) satisfies yup.ObjectSchema<CreateLocalisationDto>;
