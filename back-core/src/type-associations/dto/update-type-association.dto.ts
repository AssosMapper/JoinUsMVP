import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeAssociationDto } from './create-type-association.dto';

export class UpdateTypeAssociationDto extends PartialType(CreateTypeAssociationDto) {}
