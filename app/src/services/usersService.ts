import { useApi } from "@/composables/useApi";
import { useApiStore } from "@/store/apiUrls.store";
import { ResponseError } from "@/types/http.types";
import { SaveLocalisationDto } from "@shared/dto/localisation.dto";
import { UpdateUserDto, UserProfileDto } from "@shared/dto/user.dto";
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

export const getProfile = async (): Promise<UserProfileDto> => {
  const apiStore = useApiStore();
  const { data, error } = await useApi(apiStore.security.auth.profile)
    .get()
    .json<UserProfileDto>();

  if (error.value) throw error.value as ResponseError;
  return data.value;
};

export const updateProfile = async (
  updateUserDto?: UpdateUserDto,
  saveLocalisationDto?: SaveLocalisationDto
): Promise<void> => {
  const apiStore = useApiStore();
  const payload: any = {};

  if (updateUserDto) payload.user = updateUserDto;
  if (saveLocalisationDto) payload.localisation = saveLocalisationDto;

  const { error } = await useApi(apiStore.security.auth.profile)
    .put(payload)
    .json();

  if (error.value) throw error.value as ResponseError;
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};
