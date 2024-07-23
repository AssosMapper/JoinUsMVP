import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

export function useGoogleMapsLoader() {
    const isLoaded = ref(false);
    const loadError = ref<Error | null>(null);

    onMounted(async () => {
        try {
            const loader = new Loader({
                apiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
                version: 'weekly',
                libraries: ['places'],
            });

            await loader.load();
            isLoaded.value = true;
        } catch (error) {
            loadError.value = error as Error;
        }
    });

    return { isLoaded, loadError };
}