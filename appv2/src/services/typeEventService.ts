import axios from 'axios';
import {useApiStore} from "@/store/apiUrls.store.ts";
import {useApi} from "@/composables/useApi.ts";

const API_URL = import.meta.env.VUE_APP_BACKEND_URL;

const createTypeEvent = async (typeEvent: { name: string }, token: string) => {
  const response = await axios.post(`${API_URL}/type-events`, typeEvent, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getAllTypeEvents = async () => {
  const apiStore = useApiStore();
  const {data,error,response}= await useApi(apiStore.typeEvents.list);
  if (error.value) {
    throw new Error(error.value);
  }
    return data.value;
};

const getTypeEventById = (id: number) => {
  return axios.get(`${API_URL}/type-events/${id}`);
};

const updateTypeEvent = async (id: number, typeEvent: { name: string }, token: string) => {
  const response = await axios.put(`${API_URL}/type-events/${id}`, typeEvent, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const deleteTypeEvent = async (id: number, token: string) => {
  const response = await axios.delete(`${API_URL}/type-events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  createTypeEvent,
  getAllTypeEvents,
  getTypeEventById,
  updateTypeEvent,
  deleteTypeEvent
};
