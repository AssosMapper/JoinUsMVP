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

  // Ajouter les données de l'association
  Object.keys(association).forEach((key) => {
    const value = association[key as keyof CreateAssociationDto];
    if (value !== undefined && value !== null) {
      if (key === "typeIds" && Array.isArray(value)) {
        // Gérer le tableau des typeIds
        value.forEach((id, index) => {
          formData.append(`association[typeIds][${index}]`, id);
        });
      } else {
        formData.append(`association[${key}]`, value.toString());
      }
    }
  });

  // Ajouter les données de localisation si présentes
  if (localisation) {
    Object.keys(localisation).forEach((key) => {
      const value = localisation[key as keyof CreateLocalisationDto];
      if (value !== undefined && value !== null) {
        formData.append(`localisation[${key}]`, String(value));
      }
    });
  }

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

const updateAssociation = async (id: string, data: UpdateAssociationDto) => {
  const apiStore = useApiStore();
  const { data: response, error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.detail, { id })
  )
    .put(data)
    .json();

  if (error.value) throw error.value;
  return response.value;
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

export default {
  createAssociation,
  getAllAssociations,
  updateAssociation,
  getAssociationById,
  getAssociationByName,
  getMyAssociations,
  getAssociationMembers,
  removeMember,
};
