import { SetMetadata } from '@nestjs/common';
import * as process from 'process';

export function OnEnv(env: string): MethodDecorator {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
<<<<<<< HEAD
=======
    // Marquer la méthode avec une métadonnée spécifique pour indiquer qu'elle est en mode développement
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
    SetMetadata('isDev', true)(target, key, descriptor);

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
<<<<<<< HEAD
      if (process.env.NODE_ENV !== 'dev') {
=======
      if (process.env.NODE_ENV !== 'development') {
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
        console.log(
          `Skipping execution of ${key} because it's not in development mode.`,
        );
        return;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
