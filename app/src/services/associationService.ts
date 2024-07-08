import axios from 'axios';
import { Association } from '@interfaces/Association';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const createAssociation = async (association: Association, token: string) => {
  const response = await axios.post(`${API_URL}/associations`, association, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default {
  createAssociation,
};
