import {createFetch, useSessionStorage} from '@vueuse/core';
import {destr} from 'destr';
<<<<<<< HEAD
import {useCookies} from "@vueuse/integrations/useCookies";
=======
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

export const useApi = createFetch({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    fetchOptions: {
        headers: {
            Accept: 'application/json',
        },
    },
    options: {
        refetch: true,
        async beforeFetch({options}) {
            const user = useSessionStorage('user').value
<<<<<<< HEAD
=======

>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
            let accessToken = null;
            if(user){
                const data = JSON.parse(user);
                accessToken = data.token;
            }
            if (accessToken) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                };
            }
            return {options};
        },
        afterFetch(ctx) {
            const {data, response} = ctx;
<<<<<<< HEAD

=======
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
            let parsedData = null;
            try {
                parsedData = destr(data);
            } catch (error) {
                console.error(error);
            }
<<<<<<< HEAD

            return {data: parsedData, response};
        },
    },
});
=======
            return {data: parsedData, response};
        },
        onFetchError(ctx) {
            const {data,response} = ctx;
            let parsedData = null;
            try{
                parsedData = destr(data);
            } catch (error) {
                parsedData = {
                    statusCode: ctx.response?.status ?? 500,
                    timestamp: new Date().toISOString(),
                    path: ctx.response?.url ?? '',
                    message: "Erreur lors de la connexion"
                };
            }
            return {error: parsedData, response: ctx.response};
        }
    },
});

>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
