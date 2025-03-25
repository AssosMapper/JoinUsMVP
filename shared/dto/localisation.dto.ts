export class LocalisationDto {
  id: string;
  street_number: string;
  street_name: string;
  zip: string;
  city: string;
  country: string;
}

export class CreateLocalisationDto {
  street_number: string;
  street_name: string;
  zip: string;
  city: string;
  country: string;
}
