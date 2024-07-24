import {createFetch, useSessionStorage} from '@vueuse/core';
import {destr} from 'destr';
import {useCookies} from "@vueuse/integrations/useCookies";

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

            // Parse data if it's JSON

            let parsedData = null;
            try {
                parsedData = destr(data);
            } catch (error) {
                console.error(error);
            }

            return {data: parsedData, response};
        },
    },
});
