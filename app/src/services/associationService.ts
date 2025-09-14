import { useApi } from "@/composables/useApi.ts";
import { useApiStore } from "@/store/apiUrls.store.ts";
import { ResponseError } from "@/types/http.types";
import {
    CreateAssociationDto,
    PublicAssociationDto,
    UpdateAssociationDto,
} from "@shared/dto/associations.dto";
import { CreateLocalisationDto } from "@shared/dto/localisation.dto";

const createAssociation = async (
  association: CreateAssociationDto,
  localisation?: CreateLocalisationDto,
  file?: File
): Promise<PublicAssociationDto> => {
  const apiStore = useApiStore();

  // Créer un FormData pour gérer l'upload de fichier
  const formData = new FormData();

  formData.append("association", JSON.stringify(association));
  formData.append("localisation", JSON.stringify(localisation));

  // Ajouter le fichier s'il existe
  if (file) {
    formData.append("file", file);
  }

  const { data, error } = await useApi(apiStore.associations.create)
    .post(formData)
    .json();

  if (error.value) throw error.value as ResponseError;
  return data.value;
};

const getAllAssociations = async () => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(apiStore.associations.list).json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

const updateAssociation = async (
  id: string,
  association: UpdateAssociationDto,
  localisation?: CreateLocalisationDto,
  file?: File
): Promise<PublicAssociationDto> => {
  const apiStore = useApiStore();

  // Créer un FormData pour gérer l'upload de fichier
  const formData = new FormData();

  formData.append("association", JSON.stringify(association));
  if (localisation) {
    formData.append("localisation", JSON.stringify(localisation));
  }

  // Ajouter le fichier s'il existe
  if (file) {
    formData.append("file", file);
  }

  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.detail, { id })
  )
    .put(formData)
    .json();

  if (error.value) throw error.value as ResponseError;
  return data.value;
};

const getAssociationById = async (id: string) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.detail, {
      id: id,
    })
  ).json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value as PublicAssociationDto;
};

const getAssociationByName = async (name: string) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.byName, {
      name: name,
    })
  ).json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

const getMyAssociations = async () => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(apiStore.associations.my).json();
  if (error.value) throw error.value;

  return data.value;
};

const getAssociationMembers = async (id: string) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.members, { id })
  ).json();
  if (error.value) throw error.value as ResponseError;
  return data.value;
};

const removeMember = async (associationId: string, userId: string) => {
  const apiStore = useApiStore();
  const { error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.removeMember, {
      id: associationId,
      userId,
    })
  ).delete();
  if (error.value) throw error.value as ResponseError;
};

const updateAssociationContent = async (associationId: string, content: string): Promise<PublicAssociationDto> => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.updateContent, { id: associationId })
  )
    .put({ content })
    .json();

  if (error.value) throw error.value as ResponseError;
  return data.value;
};

export default {
  createAssociation,
  getAllAssociations,
  updateAssociation,
  getAssociationById,
  getAssociationByName,
  getMyAssociations,
  getAssociationMembers,
  removeMember,
  updateAssociationContent,
};
