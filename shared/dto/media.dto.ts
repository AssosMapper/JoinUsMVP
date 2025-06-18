import { Expose } from "class-transformer";

export class PublicMediaDto {
  @Expose() id: string;
  @Expose() filename: string;
  @Expose() filepath: string;
  @Expose() mimetype: string;
  @Expose() size: number;
  @Expose() createdAt: Date;
}
