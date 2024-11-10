import { User } from '../../users/entities/user.entity';
import { Role } from '@shared/types';

export function checkRole(user: User, role: string): boolean {
    return user.roles.some(userRole => userRole.name === role);
} 