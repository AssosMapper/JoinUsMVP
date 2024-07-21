import axios from 'axios';
import { User } from '@joinus/interfaces';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const createUser = async (user: User) => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};

const getAllUsers = () => {
  return axios.get(`${API_URL}/users`);
};

const getUserById = (id: number, token: string) => {
  return axios.get(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const updateUser = async (id: number, user: User, token: string) => {
  const response = await axios.put(`${API_URL}/users/${id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const deleteUser = async (id: number, token: string) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
