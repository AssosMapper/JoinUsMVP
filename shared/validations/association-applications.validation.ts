import * as yup from 'yup';
import { ApplicationStatus } from '../types/association-applications';
import { JoinAssociationDto, UpdateApplicationStatusDto } from '@shared/dto/association-applications.dto';

export const joinAssociationSchema = yup.object().shape({
  associationId: yup.string().uuid().required('L\'association est requise'),
  applicationAnswer: yup.string()
    .max(255, 'La réponse ne peut pas dépasser 255 caractères')
    .required('Une réponse est requise'),
}) satisfies yup.ObjectSchema<JoinAssociationDto>;

export const updateApplicationStatusSchema = yup.object().shape({
  status: yup.string()
    .oneOf(
      Object.values(ApplicationStatus),
      'Le statut est incorrect',
    )
    .required('Le statut est requis'),
}) satisfies yup.ObjectSchema<UpdateApplicationStatusDto>;

