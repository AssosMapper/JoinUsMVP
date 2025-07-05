import { PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'yup';

export class YupValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema<any>) {}

  transform(value: any) {
    // Si la valeur est undefined, null ou un objet vide, retourner undefined
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0)
    ) {
      return undefined;
    }

    // Parser les chaînes JSON automatiquement pour les données multipart
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        // Si ce n'est pas du JSON valide, garder la valeur originale
        // Cela permet de gérer les chaînes simples qui ne sont pas du JSON
      }
    }

    return this.schema.validateSync(value);
  }
}

export class OptionalYupValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema<any>) {}

  transform(value: any) {
    // Pour les validations optionnelles, on retourne undefined si pas de valeur
    if (value === undefined || value === null) {
      return undefined;
    }

    // Parser les chaînes JSON automatiquement pour les données multipart
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch (error) {
        // Si ce n'est pas du JSON valide, garder la valeur originale
        // Cela permet de gérer les chaînes simples qui ne sont pas du JSON
      }
    }

    return this.schema.validateSync(value);
  }
}
