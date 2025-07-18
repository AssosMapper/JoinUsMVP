import { useApi } from "@/composables/useApi.ts";
import { useApiStore } from "@/store/apiUrls.store.ts";
import axios from "axios";

const API_URL = import.meta.env.VUE_APP_BACKEND_URL;

interface TypeEvent {
  id?: number;
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
};

const getAllTypeEvents = async () => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(apiStore.typeEvents.list);
  if (error.value) {
    throw error.value;
  }
  return data.value;
};

const getTypeEventById = async (id: number) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.typeEvents.detail, { id: id.toString() })
  ).json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

const updateTypeEvent = async (id: number, typeEvent: TypeEvent) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.typeEvents.update, { id: id.toString() })
  )
    .put(typeEvent)
    .json();

  if (error.value) throw new Error(error.value);
  return data.value;
};

const deleteTypeEvent = async (id: string, token: string) => {
  const response = await axios.delete(`${API_URL}/type-events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default {
  createTypeEvent,
  getAllTypeEvents,
  getTypeEventById,
  updateTypeEvent,
  deleteTypeEvent,
};
