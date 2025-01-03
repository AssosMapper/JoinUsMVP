<<<<<<< HEAD
import axios from 'axios';
import {useApiStore} from "@/store/apiUrls.store.ts";
import {useApi} from "@/composables/useApi.ts";

const API_URL = import.meta.env.VUE_APP_BACKEND_URL;

const createTypeEvent = async (typeEvent: any) => {
  const apiStore = useApiStore();
    const {data,error,response}= await useApi(apiStore.typeEvents.create,typeEvent).post(typeEvent).json();
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
=======
import { useApi } from "@/composables/useApi.ts";
import { useApiStore } from "@/store/apiUrls.store.ts";
import axios from "axios";

const API_URL = import.meta.env.VUE_APP_BACKEND_URL;

interface TypeEvent {
  id?: string;
  name: string;
  description?: string;
}

const createTypeEvent = async (typeEvent: TypeEvent) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(apiStore.typeEvents.create)
    .post(typeEvent)
    .json();

  if (error.value) throw new Error(error.value);
  return data.value;
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
};

const getAllTypeEvents = async () => {
  const apiStore = useApiStore();
<<<<<<< HEAD
  const {data,error,response}= await useApi(apiStore.typeEvents.list);
  if (error.value) {
    throw new Error(error.value);
  }
    return data.value;
};

const getTypeEventById = async (id: number) => {
  const apiStore = useApiStore();
    const {data,error,response}= await useApi(apiStore.resolveUrl(apiStore.typeEvents.detail,{
        id:id
    })).json();
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
};

const updateTypeEvent = async (id: string, typeEvent) => {
  const apiStore = useApiStore();
    const {data,error,response}= await useApi(apiStore.resolveUrl(apiStore.typeEvents.update,{id:id}),typeEvent).put(typeEvent).json();
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
};

const deleteTypeEvent = async (id: number, token: string) => {
  const response = await axios.delete(`${API_URL}/type-events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
=======
  const { data, error } = await useApi(apiStore.typeEvents.list);
  if (error.value) {
    throw error.value;
  }
  return data.value;
};

const getTypeEventById = async (id: string) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.typeEvents.detail, { id })
  ).json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

const updateTypeEvent = async (typeEvent: TypeEvent) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(apiStore.typeEvents.update)
    .put(typeEvent)
    .json();

  if (error.value) throw new Error(error.value);
  return data.value;
};

const deleteTypeEvent = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/type-events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
  });
  return response.data;
};

export default {
  createTypeEvent,
  getAllTypeEvents,
  getTypeEventById,
  updateTypeEvent,
<<<<<<< HEAD
  deleteTypeEvent
=======
  deleteTypeEvent,
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
};
