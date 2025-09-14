import { Expose } from "class-transformer";

export class UpdateContentDto {
  @Expose()
  content: string;
}
