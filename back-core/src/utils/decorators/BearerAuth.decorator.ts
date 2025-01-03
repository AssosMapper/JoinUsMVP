import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

export function BearAuthToken() {
  return applyDecorators(UseGuards(AuthGuard('jwt')), ApiBearerAuth());
<<<<<<< HEAD
}
=======
}
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
