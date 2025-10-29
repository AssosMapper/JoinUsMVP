import * as yup from "yup";
import {
  CreateLocalisationDto,
  SaveLocalisationDto,
} from "../dto/localisation.dto";
import { ACCENT_STRING_REGEX } from "../utils/yup.util";

export const createLocalisationSchema = yup.object().shape({
  street_number: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").optional(),
  street_name: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").required("Le nom de la rue est requis"),
  zip: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").required("Le code postal est requis"),
  city: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").required("La ville est requise"),
  country: yup.string().matches(ACCENT_STRING_REGEX, "Caractères non autorisés").required("Le pays est requis"),
}) satisfies yup.ObjectSchema<CreateLocalisationDto>;

export const saveLocalisationSchema =
  createLocalisationSchema satisfies yup.ObjectSchema<
    Omit<SaveLocalisationDto, "id">
  >;
