import { useApi } from "@/composables/useApi.ts";
import { useApiStore } from "@/store/apiUrls.store.ts";
import { IUpdateAssociation } from "@/types/association.types";
import { ResponseError } from "@/types/http.types";
import { Association } from "@shared/types/association";

const createAssociation = async (association: Association) => {
  const apiStore = useApiStore();
  const { data, error, response } = await useApi(apiStore.associations.create)
    .post(association)
    .json();
  if (error.value) {
    throw new Error(error.value);
  }
  return { data: data.value, response: response.value };
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
  association: IUpdateAssociation
) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.detail, {
      id: id,
    })
  )
    .put(association)
    .json();
  if (error.value) {
    throw new Error(error.value);
  }
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
  return data.value;
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
