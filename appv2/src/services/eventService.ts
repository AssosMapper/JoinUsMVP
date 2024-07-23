import axios from 'axios';
import {Event} from '@joinus/interfaces';
import {useApi} from "@/composables/useApi.ts";
import {useApiStore} from "@/store/apiUrls.store.ts";
import {IEvent} from "@/types/event.types.ts";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const createEvent = async (event: IEvent) => {
    const {data, error, response} = await useApi(useApiStore().events.create).post(event).json();
};

const getAllEvents = async () => {
    const urls = useApiStore();
    const {data, error, response} = await useApi(urls.events.list).json();
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
};

const getEventById = async (id: string) => {
    const apiStore = useApiStore();
    const {data, error, response} = await useApi(apiStore.resolveUrl(apiStore.events.detail, {
        id: id
    })).json();
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
    const {data, error, response} = await useApi(apiStore.resolveUrl(apiStore.events.update)).put(event).json();
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
};

const deleteEvent = async (id: number, token: string) => {
    const response = await axios.delete(`${API_URL}/events/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export default {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventsByUserId
};