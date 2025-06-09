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
    return this.schema.validateSync(value);
  }
}
