export class ForgotPasswordDto {
  email: string;
}

export class ResetPasswordDto {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

export class RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}
