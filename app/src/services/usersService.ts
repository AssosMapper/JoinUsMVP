import { useApi } from "@/composables/useApi";
import { useApiStore } from "@/store/apiUrls.store";
import { User } from "@shared/types/user";
import axios from "axios";
const API_URL = import.meta.env.VUE_APP_BACKEND_URL;

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
      Authorization: `Bearer ${token}`,
    },
  });
};

const updateUser = async (id: number, user: User, token: string) => {
  const response = await axios.put(`${API_URL}/users/${id}`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteUser = async (id: number, token: string) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getProfile = async (token: string) => {
  const urls = useApiStore();
  const { data, error } = await useApi(urls.security.auth.profile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .get()
    .json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
};
