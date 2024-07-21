import axios from 'axios';
import { Association } from '@joinus/interfaces';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const createAssociation = async (association: Association, token: string) => {
  const response = await axios.post(`${API_URL}/associations`, association, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getAllAssociations = () => {
  return axios.get(`${API_URL}/associations`);
};

const updateAssociation = async (id: number, association: Association, token: string) => {
  const response = await axios.put(`${API_URL}/associations/${id}`, association, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

const getAssociationById = (id: number) => {
  return axios.get(`${API_URL}/associations/${id}`);
};

export default {
  createAssociation,
  getAllAssociations,
  updateAssociation,
  getAssociationById
};
