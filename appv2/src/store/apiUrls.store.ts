import {defineStore} from "pinia";

export const useApiStore = defineStore('api',{
    state() {
        return{
            security: {
                auth:{
                    login: "/v1/auth/login",
                    register: "/v1/auth/register",
                }
            },
            events:{
                list: "/events",
                detail: "/events/:id",
            },
            associations:{
                list: "/associations",
                detail: "/associations/:id",
            }
        }
    },
    actions:{
        resolveUrl(url: string, params: Record<string, string>){
            let resolvedUrl = url;
            Object.keys(params).forEach((key) => {
                resolvedUrl = resolvedUrl.replace(`:${key}`, params[key]);
            });
            return resolvedUrl;
        }
    }
});