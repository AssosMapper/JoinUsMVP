import { Expose } from "class-transformer";
export class PermissionDto {
  @Expose() id: string;
  @Expose() permission: string;
}
