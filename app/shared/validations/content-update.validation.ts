import * as yup from 'yup';
import { UpdateContentDto } from '../dto/content-update.dto';

export const updateContentSchema = yup.object().shape({
  content: yup.string().required('Le contenu est requis'),
}) satisfies yup.ObjectSchema<UpdateContentDto>;
