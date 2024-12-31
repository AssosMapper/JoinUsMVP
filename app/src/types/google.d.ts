declare namespace google.maps {
  class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    addListener(event: string, handler: Function): void;
  }

  class Geocoder {
    geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: string) => void): void;
  }

  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    open(map?: Map, anchor?: Marker): void;
    close(): void;
  }

  interface MapOptions {
    center: LatLngLiteral;
    zoom: number;
  }

  interface MarkerOptions {
    position: LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon;
  }

  interface Icon {
    url: string;
    scaledSize: Size;
  }

  class Size {
    constructor(width: number, height: number);
  }

  interface GeocoderRequest {
    address: string;
  }

  interface GeocoderResult {
    geometry: {
      location: { lat: () => number; lng: () => number };
    };
  }

  interface InfoWindowOptions {
    content: string;
  }

  namespace places {
    class Autocomplete {
      constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions);
      addListener(eventName: string, handler: Function): void;
      getPlace(): PlaceResult;
    }

    interface AutocompleteOptions {
      types?: string[];
      componentRestrictions?: {
        country: string | string[];
      };
    }

    interface PlaceResult {
      formatted_address?: string;
    }
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
} 