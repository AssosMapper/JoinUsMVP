import { Expose, Type } from "class-transformer";
import { PermissionDto } from "./permissions.dto";
export class RoleDto {
  @Expose() id: string;
  @Expose() name: string;
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
