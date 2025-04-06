import { RoleEnum } from "@shared/types/roles";
import type { User } from "@shared/types/user";

export function checkRole(user: User | null, role: RoleEnum): boolean {
  if (!user) return false;
  return user.roles.some((userRole) => userRole.name === role);
}

export function canManageAssociation(
  user: User | null,
  associationId: string
): boolean {
  console.log(user);
  console.log(user);
  console.log(user);
  if (!user) return false;

  // Si l'utilisateur est SuperAdmin, il peut tout gérer
  if (checkRole(user, RoleEnum.SUPER_ADMIN)) return true;

  // Vérifie si l'utilisateur est manager et membre de l'association
  return (
    checkRole(user, RoleEnum.ASSOCIATION_MANAGER) &&
    user.associations.some((assoc) => assoc.id === associationId)
  );
}
