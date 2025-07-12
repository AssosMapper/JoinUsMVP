import { formatFullAddress } from "@shared/utils/address.util";
import { Transform } from "class-transformer";

export interface MapType {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  height?: string;
}

export class EventMapType {
  id: string;
  titre: string;
  description: string;
  @Transform(({ value }) => formatFullAddress(value))
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
