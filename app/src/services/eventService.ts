import { useApi } from "@/composables/useApi.ts";
import { useApiStore } from "@/store/apiUrls.store.ts";
import { IEvent } from "@/types/event.types.ts";
import { ResponseError } from "@/types/http.types";
import axios from "axios";
import { useUserStore } from '@/store';

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const createEvent = async (event: IEvent) => {
  const userStore = useUserStore();
  const apiStore = useApiStore();
  
  const payload = {
    ...event,
    associationId: userStore.user?.associationId || event.associationId
  };

  const { data, error } = await useApi(apiStore.events.create)
    .post(payload)
    .json();

  if (error.value) {
    console.error('Error creating event:', error.value);
    throw error.value;
  }

  return data.value;
};

const getAllEvents = async (
  isValid?: boolean,
  page: number = 1,
  limit: number = 10
) => {
  const urls = useApiStore();
  let url = `${urls.events.list}?page=${page}&limit=${limit}`;

  if (isValid !== undefined) {
    url += `&isValid=${isValid}`;
  }

  const { data, error, response } = await useApi(url).json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

const getEventById = async (id: string) => {
  const apiStore = useApiStore();
  const { data, error, response } = await useApi(
    apiStore.resolveUrl(apiStore.events.detail, {
      id: id,
    })
  ).json();
  if (error.value) {
    throw new Error(error.value);
  }
  console.log(data.value);
  return data.value;
};

const getEventsByUserId = async (userId: number) => {
  const response = await axios.get(`${API_URL}/events/user/${userId}`);
  return response.data;
};

const updateEvent = async (id: string, event: Partial<IEvent>) => {
  const apiStore = useApiStore();
  const { data, error, response } = await useApi(
    apiStore.resolveUrl(apiStore.events.update, {
      id: id,
    })
  )
    .put(event)
    .json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

const deleteEvent = async (id: number, token: string) => {
  const response = await axios.delete(`${API_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getEventsByAssociationId = async (
  associationId: string,
  limit: number
) => {
  const apiStore = useApiStore();
  const url = `${apiStore.events.byAssociation}?associationId=${associationId}&limit=${limit}`;

  const { data, error, response } = await useApi(url).json();

  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

const getEventsByDate = async (date: string, limit: number) => {
  const apiStore = useApiStore();
  const url = `${apiStore.events.byDate}?date=${date}&limit=${limit}`;

  const { data, error } = await useApi(url).json();
  if (error.value) throw new Error(error.value);

  return data.value;
};

const getEventsByMonth = async (
  year: number,
  month: number,
  isValid?: boolean,
  search?: string,
  typeEventId?: string
) => {
  const apiStore = useApiStore();
  let url = `${apiStore.events.byMonth}?year=${year}&month=${month}`;

  if (isValid !== undefined) url += `&isValid=${isValid}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (typeEventId) url += `&typeEventId=${typeEventId}`;

  const { data, error } = await useApi(url).json();
  if (error.value) throw error.value as ResponseError;

  return data.value;
};

export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByUserId,
  getEventsByAssociationId,
  getEventsByDate,
  getEventsByMonth,
};
