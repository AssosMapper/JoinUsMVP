import axios from 'axios';
import { Event } from '@joinus/interfaces';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const createEvent = async (event: Event, token: string) => {
  const response = await axios.post(`${API_URL}/events`, event, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getAllEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

const getEventById = async (id: number) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

const getEventsByUserId = async (userId: number) => {
  const response = await axios.get(`${API_URL}/events/user/${userId}`);
  return response.data;
};

const updateEvent = async (id: number, event: Partial<Event>, token: string) => {
  const response = await axios.put(`${API_URL}/events/${id}`, event, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
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