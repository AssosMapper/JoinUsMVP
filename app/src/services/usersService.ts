import axios from 'axios';
import { User } from '@interfaces/User';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const createUser = async (user: User) => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};

export default {
  createUser,
};
