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
};

const getAllAssociations = async () => {
  const apiStore = useApiStore();
  const {data,error,response} = await useApi(apiStore.associations.list).json();
  if(error.value){
    throw new Error(error.value);
  }
  return data.value;
};


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
};

const getAssociationByName = async (name: string) => {
  const apiStore = useApiStore();
  const {data, error, response} = await useApi(apiStore.resolveUrl(apiStore.associations.byName, {
    name: name
  })).json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

export default {
  createAssociation,
  getAllAssociations,
  updateAssociation,
  getAssociationById,
  getAssociationByName
};
