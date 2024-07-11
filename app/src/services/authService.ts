import axios from 'axios';
import { Login } from '@interfaces/login';
import { useUserStore } from '../store/usersStore';

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