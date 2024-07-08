export interface User {
    id?: number;
    first_name: string;
    last_name: string;
    dateCreated: Date;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: number;
    associationId: number;
    phone?: string;
    address?: string;
    zip?: string;
    country?: string;
    image?: string;
  }
  