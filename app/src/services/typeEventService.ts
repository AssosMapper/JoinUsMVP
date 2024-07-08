import axios from 'axios';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const createTypeEvent = async (typeEvent: { name: string }, token: string) => {
  const response = await axios.post(`${API_URL}/type-events`, typeEvent, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getAllTypeEvents = () => {
  return axios.get(`${API_URL}/type-events`);
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
