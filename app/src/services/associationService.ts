<<<<<<< HEAD
import axios from 'axios';
import { Association } from '@joinus/interfaces';
import {useApiStore} from "@/store/apiUrls.store.ts";
import {useApi} from "@/composables/useApi.ts";
import {IAssociation} from "@/types/association.types.ts";

const API_URL = import.meta.env.VUE_APP_BACKEND_URL;

const createAssociation = async (association: IAssociation, token: string) => {
  const apiStore = useApiStore();
  const {data,error,response}=await useApi(apiStore.associations.create).post(association).json();
    if(error.value){
        throw new Error(error.value);
    }
    return {data: data.value, response: response.value};
=======
import { useApi } from "@/composables/useApi.ts";
import { useApiStore } from "@/store/apiUrls.store.ts";
import { ResponseError } from "@/types/http.types";
import {
  CreateAssociationDto,
  PublicAssociationDto,
  UpdateAssociationDto,
} from "@shared/dto/associations.dto";

const createAssociation = async (association: CreateAssociationDto) => {
  const apiStore = useApiStore();
  const { data, error, response } = await useApi(apiStore.associations.create)
    .post(association)
    .json();
  if (error.value) {
    throw new Error(error.value);
  }
  return { data: data.value, response: response.value };
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
};

const getAllAssociations = async () => {
  const apiStore = useApiStore();
<<<<<<< HEAD
  const {data,error,response} = await useApi(apiStore.associations.list).json();
  if(error.value){
=======
  const { data, error } = await useApi(apiStore.associations.list).json();
  if (error.value) {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    throw new Error(error.value);
  }
  return data.value;
};

<<<<<<< HEAD

const updateAssociation = async (id: string, association: IUpdateAssociation) => {
  const apiStore = useApiStore();
    const {data,error,response}=await useApi(apiStore.resolveUrl(apiStore.associations.detail,{
      id: id
    })).put(association).json();
  if(error.value){
    throw new Error(error.value);
  }
    return data.value;
};

const getAssociationById = async (id: string)=> {
  const apiStore = useApiStore();
  const {data,error,response} = await useApi(apiStore.resolveUrl(apiStore.associations.detail,{
    id: id
  })).json();
  if(error.value){
    throw new Error(error.value);
  }
  return data.value;
=======
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
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
};

const getAssociationByName = async (name: string) => {
  const apiStore = useApiStore();
<<<<<<< HEAD
  const {data, error, response} = await useApi(apiStore.resolveUrl(apiStore.associations.byName, {
    name: name
  })).json();
=======
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.associations.byName, {
      name: name,
    })
  ).json();
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

<<<<<<< HEAD
=======
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

>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
export default {
  createAssociation,
  getAllAssociations,
  updateAssociation,
  getAssociationById,
<<<<<<< HEAD
  getAssociationByName
=======
  getAssociationByName,
  getMyAssociations,
  getAssociationMembers,
  removeMember,
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
};
