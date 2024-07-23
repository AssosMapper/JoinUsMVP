import axios from 'axios';
import {useApiStore} from "@/store/apiUrls.store.ts";
import {useApi} from "@/composables/useApi.ts";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const createTypeAssociation = async (typeAssociation: { name: string }, token: string) => {
  const response = await axios.post(`${API_URL}/type-associations`, typeAssociation, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getAllTypeAssociations = async () => {
  const apiStore = useApiStore();
  const {data,error} = await useApi(apiStore.associationTypes.list).json();
    if(error.value){
        throw new Error(error.value);
    }
    return data.value;
};

const getTypeAssociationById = (id: number) => {
  return axios.get(`${API_URL}/type-associations/${id}`);
};

const updateTypeAssociation = async (id: number, typeAssociation: { name: string; description?: string }, token: string) => {
  const response = await axios.put(`${API_URL}/type-associations/${id}`, typeAssociation, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const deleteTypeAssociation = async (id: number, token: string) => {
  const response = await axios.delete(`${API_URL}/type-associations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  createTypeAssociation,
  getAllTypeAssociations,
  getTypeAssociationById,
  updateTypeAssociation,
  deleteTypeAssociation,
};
