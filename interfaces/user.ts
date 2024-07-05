export interface User {
    first_name: string;
    last_name: string;
    dateCreated: Date;
    email: string;
    password: string;
    confirmPassword: string;
    roleId: number;
    phone?: string;
    address?: string;
    zip?: string;
    country?: string;
    image?: string;
  }
  