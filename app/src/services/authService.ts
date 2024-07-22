import axios from 'axios';
import { useUserStore } from '@/store';
import { Login } from '@joinus/interfaces';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const login = async (credentials: Login) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  const userStore = useUserStore();
  userStore.loginUser(response.data);
  return response.data;
};

const logout = () => {
  const userStore = useUserStore();
  userStore.logoutUser();
};

export default {
  login,
  logout,
};