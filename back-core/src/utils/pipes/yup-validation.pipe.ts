import { PipeTransform } from "@nestjs/common";
import { ObjectSchema } from "yup";

class YupValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema<any>) {}
  
    transform(value: any) {
      return this.schema.validateSync(value);
    }
  }