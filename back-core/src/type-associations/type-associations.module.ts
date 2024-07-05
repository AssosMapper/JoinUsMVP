import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeAssociations } from './type-associations.entity';
import { TypeAssociationsService } from './type-associations.service';
import { TypeAssociationsController } from './type-associations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeAssociations])],
  providers: [TypeAssociationsService],
  controllers: [TypeAssociationsController],
  exports: [TypeOrmModule] 
})
export class TypeAssociationsModule {}
