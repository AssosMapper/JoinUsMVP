import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto, ResetPasswordDto } from '@shared/dto/auth.dto';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@shared/validations/auth.validation';
import { YupValidationPipe } from '../utils/pipes/yup-validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentification')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description:
      'Permet à un utilisateur de se connecter avec son email et son mot de passe',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Inscription utilisateur',
    description: 'Permet à un utilisateur de créer un compte',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Demande de réinitialisation de mot de passe',
    description:
      'Envoie un email avec un lien pour réinitialiser le mot de passe',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'admin@test.com',
          description: 'Adresse email du compte à réinitialiser',
        },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Email envoyé si l'utilisateur existe",
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            "Nous avons envoyé votre demande de mot de passe par e-mail si l'utilisateur existe",
        },
      },
    },
  })
  async forgotPassword(
    @Body(new YupValidationPipe(forgotPasswordSchema))
    forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Réinitialisation du mot de passe',
    description: 'Réinitialise le mot de passe avec le token reçu par email',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'admin@test.com',
          description: 'Adresse email du compte',
        },
        token: {
          type: 'string',
          example: '51d312282e3a034d08f6b70101b439dc7b6962e5',
          description: 'Token de réinitialisation reçu par email',
        },
        password: {
          type: 'string',
          example: 'NouveauMotDePasse123!',
          description: 'Nouveau mot de passe',
        },
        confirmPassword: {
          type: 'string',
          example: 'NouveauMotDePasse123!',
          description: 'Confirmation du nouveau mot de passe',
        },
      },
      required: ['email', 'token', 'password', 'confirmPassword'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe réinitialisé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Votre mot de passe a bien été changé',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou mots de passe différents',
  })
  @ApiResponse({
    status: 404,
    description: 'Demande de réinitialisation introuvable ou expirée',
  })
  async resetPassword(
    @Body(new YupValidationPipe(resetPasswordSchema))
    resetPasswordDto: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
