import { useApi } from "@/composables/useApi.ts";
import { useApiStore } from "@/store/apiUrls.store.ts";
import { ResponseError } from "@/types/http.types";
import {
  EventParticipantResponseDto,
  ParticipateEventDto,
  UserParticipationResponseDto,
} from "@shared/dto/event-participation.dto";
import { CreateEventDto, UpdateEventDto, EventDto } from "@shared/dto/events.dto";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const createEvent = async (
  eventData: CreateEventDto,
  localisation?: SaveLocalisationDto,
  imageFile?: File
) => {
  const apiStore = useApiStore();

  const formData = new FormData();
  
  formData.append('event', JSON.stringify(eventData));
  
  if (localisation) 
    formData.append('localisation', JSON.stringify(localisation));
  
  if (imageFile) 
    formData.append('file', imageFile);
  

  const { data, error } = await useApi(apiStore.events.create)
    .post(formData)
    .json();

  if (error.value) {
    throw error.value as ResponseError;
  }

  return data.value as EventDto;
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

  const { data, error } = await useApi(url).json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

const getEventById = async (id: string) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
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

const getEventsByUserId = async (userId: string) => {
  const response = await axios.get(`${API_URL}/events/user/${userId}`);
  return response.data;
};

const updateEvent = async (
  id: string,
  eventData: UpdateEventDto,
  localisation?: SaveLocalisationDto,
  imageFile?: File
) => {
  const apiStore = useApiStore();

  // Préparer FormData pour l'envoi avec fichier
  const formData = new FormData();
  
  // Ajouter les données de l'événement
  formData.append('event', JSON.stringify(eventData));
  
  // Ajouter la localisation si fournie
  if (localisation) {
    formData.append('localisation', JSON.stringify(localisation));
  }
  
  // Ajouter l'image si fournie
  if (imageFile) {
    formData.append('file', imageFile);
  }

  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.events.update, { id })
  )
    .put(formData)
    .json();

  if (error.value) {
    throw error.value as ResponseError;
  }

  return data.value as EventDto;
};

const updateEventImage = async (eventId: string, imageFile: File) => {
  const apiStore = useApiStore();

  const formData = new FormData();
  formData.append('file', imageFile);

  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.events.updateImage, { eventId })
  )
    .post(formData)
    .json();

  if (error.value) {
    throw error.value as ResponseError;
  }

  return data.value as EventDto;
};

const deleteEvent = async (id: string, token: string) => {
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
  const url = apiStore.resolveUrl(apiStore.events.byAssociation, {
    associationId,
  });

  const { data, error } = await useApi(url).json();
  if (error.value) throw new Error(error.value);

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

// Méthodes pour la participation aux événements
const participateEvent = async (participateEventDto: ParticipateEventDto) => {
  const apiStore = useApiStore();

  const { data, error } = await useApi(apiStore.events.participate)
    .post(participateEventDto)
    .json();

  if (error.value) {
    console.error("Error participating to event:", error.value);
    throw error.value as ResponseError;
  }

  return data.value;
};

const cancelParticipation = async (eventId: string) => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.events.cancelParticipation, { eventId })
  )
    .delete()
    .json();

  if (error.value) {
    console.error("Error canceling participation:", error.value);
    throw error.value as ResponseError;
  }

  return data.value;
};

const getEventParticipants = async (
  eventId: string
): Promise<EventParticipantResponseDto[]> => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.events.participants, { eventId })
  ).json();

  if (error.value) throw error.value as ResponseError;

  return data.value;
};

const getUserParticipations = async (): Promise<
  UserParticipationResponseDto[]
> => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(apiStore.events.participations).json();

  if (error.value) throw error.value as ResponseError;

  return data.value;
};

const getUserParticipation = async (
  eventId: string
): Promise<UserParticipationResponseDto> => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.events.getUserParticipation, { eventId })
  ).json();

  if (error.value) throw error.value as ResponseError;

  return data.value;
};

const getFilteredEvents = async (
  filters: {
    minDate?: Date;
    maxDate?: Date;
    search?: string;
    isValid?: boolean;
    typeEventId?: string;
  },
  page: number = 1,
  limit: number = 10,
  sortField?: string,
  sortOrder?: 'asc' | 'desc'
) => {
  const apiStore = useApiStore();
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'minDate' || key === 'maxDate') {
        params.append(key, (value as Date).toISOString());
      } else {
        params.append(key, value.toString());
      }
    }
  });

  if (sortField) {
    params.append('sortField', sortField);
  }
  if (sortOrder) {
    params.append('sortOrder', sortOrder);
  }

  const url = `${apiStore.events.filtered}?${params.toString()}`;
  
  const { data, error } = await useApi(url).json();
  if (error.value) throw error.value as ResponseError;

  return data.value;
};

const updateEventStatus = async (eventId: string): Promise<EventDto> => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(
    apiStore.resolveUrl(apiStore.events.updateStatus, { id: eventId })
  )
    .put({})
    .json();

  if (error.value) {
    throw error.value as ResponseError;
  }

  return data.value as EventDto;
};

export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  updateEventImage,
  deleteEvent,
  getEventsByUserId,
  getEventsByAssociationId,
  getEventsByDate,
  getEventsByMonth,
  getFilteredEvents,
  participateEvent,
  cancelParticipation,
  getEventParticipants,
  getUserParticipations,
  getUserParticipation,
  updateEventStatus,
};
