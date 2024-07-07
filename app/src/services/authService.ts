import axios from 'axios';
import { Login } from '@interfaces/login';
import store from '@/store';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const login = async (credentials: Login) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  store.dispatch('user/loginUser', response.data);
  return response.data;
};

const logout = () => {
  store.dispatch('user/logoutUser');
};

export default {
  login,
  logout,
};