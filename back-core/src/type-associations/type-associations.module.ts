import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeAssociations } from './entities/type-associations.entity';
import { TypeAssociationsService } from './type-associations.service';
import { TypeAssociationsController } from './type-associations.controller';

@Module({
  providers: [TypeAssociationsService],
  controllers: [TypeAssociationsController],
})
export class TypeAssociationsModule {}
