import axios from 'axios';
import {useApiStore} from "@/store/apiUrls.store.ts";
import {useApi} from "@/composables/useApi.ts";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const createTypeAssociation = async (typeAssociation) => {
    const apiStore = useApiStore();
    const {data, error} = await useApi(apiStore.associationTypes.create).post(typeAssociation).json(typeAssociation);
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
};

const getAllTypeAssociations = async () => {
    const apiStore = useApiStore();
    const {data, error} = await useApi(apiStore.associationTypes.list).json();
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
};

const getTypeAssociationById = async (id: string) => {
    const apiStore = useApiStore();
    const {data, error} = await useApi(apiStore.resolveUrl(apiStore.associationTypes.detail, {
        id
    })).json();
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
};

const updateTypeAssociation = async (id: string, typeAssociation) => {
    const apiStore = useApiStore();
    const {data, error} = await useApi(apiStore.resolveUrl(apiStore.associationTypes.detail, {
        id
    })).put(typeAssociation).json(typeAssociation);
    if (error.value) {
        throw new Error(error.value);
    }
    return data.value;
};

const deleteTypeAssociation = async (id: number, token: string) => {
    const response = await axios.delete(`${API_URL}/type-associations/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export default {
    createTypeAssociation,
    getAllTypeAssociations,
    getTypeAssociationById,
    updateTypeAssociation,
    deleteTypeAssociation,
};
