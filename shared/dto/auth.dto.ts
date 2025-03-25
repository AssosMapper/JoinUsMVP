export class ForgotPasswordDto {
  email: string;
}

export class ResetPasswordDto {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}
