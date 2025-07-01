export interface MapType {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: string;
}

export interface EventMapType {
  id: string;
  titre: string;
  description: string;
  localisation: string;
  date: string;
  association?: {
    id: string;
    name: string;
    image?: string;
  };
  typeEvent?: {
    name: string;
  };
}

export interface MapState {
  loading: boolean;
  error: boolean;
  initialized: boolean;
}

export interface MarkerInfo {
  position: google.maps.LatLngLiteral;
  title: string;
  content: string;
  icon?: google.maps.Icon;
  clickAction?: () => void;
}
