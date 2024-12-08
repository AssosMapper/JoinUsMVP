import { Expose } from "class-transformer";

export class TypeEventsDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
