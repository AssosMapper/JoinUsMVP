import axios from 'axios';
import { Login } from '@interfaces/login';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const login = async (credentials: Login) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export default {
  login,
};
