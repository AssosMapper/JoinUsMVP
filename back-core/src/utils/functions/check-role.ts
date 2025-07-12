import { User } from '../../users/entities/user.entity';

export function checkRole(user: User, role: string): boolean {
  return user.roles.some((userRole) => userRole.name === role);
}

export function checkRoles(user: User, roles: string[]): boolean {
  return user.roles.some((userRole) => roles.includes(userRole.name));
}
