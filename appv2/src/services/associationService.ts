import axios from 'axios';
import { Association } from '@joinus/interfaces';
import {useApiStore} from "@/store/apiUrls.store.ts";
import {useApi} from "@/composables/useApi.ts";

const API_URL = import.meta.env.VUE_APP_BACKEND_URL;

const createAssociation = async (association: Association, token: string) => {
  const response = await axios.post(`${API_URL}/associations`, association, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getAllAssociations = async () => {
  const urls = useApiStore();
  const {data,error,response} = await useApi(urls.associations.list).json();
  if(error.value){
    throw new Error(error.value);
  }
  return data.value;
};

const updateAssociation = async (id: number, association: Association, token: string) => {
  const response = await axios.put(`${API_URL}/associations/${id}`, association, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
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
export default {
  createAssociation,
  getAllAssociations,
  updateAssociation,
  getAssociationById
};
