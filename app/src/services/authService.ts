import { useUserStore } from '@/store';
import { ICredentials, IRegister } from "@/types/security.types.ts";
import { useApi } from "@/composables/useApi.ts";
import { useApiStore } from "@/store/apiUrls.store.ts";


export const login = async (credentials: ICredentials) => {
  const urls = useApiStore();
  const {data,error,response} = await useApi(urls.security.auth.login).post(credentials).json();
  if(error.value){
    throw new Error(error.value);
  }
  return data.value;
};

export const register = async (register: IRegister) =>{
  const urls = useApiStore();
  const {data,error}= await useApi(urls.security.auth.register).post(register).json();
    if(error.value) 
      throw error.value;
    return data.value;
}

export const logout = () => {
  const userStore = useUserStore();
  userStore.logout();
};

export const getProfile = async (token: string) => {
  const urls = useApiStore();
  const { data, error } = await useApi(urls.security.auth.profile, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).get().json();
  if (error.value) {
    throw new Error(error.value);
  }
  return data.value;
};

export default {
  login,
  logout,
  register,
  getProfile
};