import { Expose } from "class-transformer";
export class LocalisationDto {
  @Expose() id: string;
  @Expose() street_number: string;
  @Expose() street_name: string;
  @Expose() zip: string;
  @Expose() city: string;
  @Expose() country: string;
}

export class CreateLocalisationDto {
  @Expose() street_number?: string;
  @Expose() street_name: string;
  @Expose() zip: string;
  @Expose() city: string;
  @Expose() country: string;
}

export class SaveLocalisationDto extends CreateLocalisationDto {
  @Expose() id?: string;
}
