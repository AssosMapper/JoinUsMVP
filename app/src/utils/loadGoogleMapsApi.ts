let scriptLoaded = false;
let scriptLoadingPromise: Promise<void> | null = null;

export function loadGoogleMapsApi(): Promise<void> {
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is missing"));
  }

  if (scriptLoaded) {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise<void>((resolve, reject) => {
    if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
      scriptLoaded = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = (error) => {
      scriptLoadingPromise = null;
      reject(error);
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}