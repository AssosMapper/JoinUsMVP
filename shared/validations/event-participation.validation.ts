import * as yup from "yup";
import { ParticipateEventDto } from "../dto/event-participation.dto";

export const participateEventSchema = yup.object().shape({
  eventId: yup
    .string()
    .uuid()
    .required("L'identifiant de l'événement est requis"),
}) satisfies yup.ObjectSchema<ParticipateEventDto>;
