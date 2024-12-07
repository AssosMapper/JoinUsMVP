import { Expose } from "class-transformer";

export class TypeAssociationsDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() description: string;
}
