import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TypeEventsDto } from '@shared/dto/type-events.dto';
import { plainToInstance } from 'class-transformer';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CreateTypeEventDto } from './dto/create-type-event.dto';
import { UpdateTypeEventDto } from './dto/update-type-event.dto';
import { TypeEventsService } from './type-events.service';
import { CheckRole, CheckRoleGuard } from '@src/utils/guards/check-role.guard';
import { RoleEnum } from '@shared/types';

@Controller('type-events')
export class TypeEventsController {
  constructor(private readonly typeEventsService: TypeEventsService) {}

  @Get()
  async findAll(): Promise<TypeEventsDto[]> {
    const typeEvents = await this.typeEventsService.findAll();
    return plainToInstance(TypeEventsDto, typeEvents, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TypeEventsDto> {
    const typeEvent = await this.typeEventsService.findOne(id);
    return plainToInstance(TypeEventsDto, typeEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Post()
  @CheckRole(RoleEnum.ASSOCIATION_MANAGER, RoleEnum.EVENTS_MANAGER)
  @UseGuards(CheckRoleGuard)
  @BearAuthToken()
  @ApiBearerAuth()
  async create(
    @Body() createTypeEventDto: CreateTypeEventDto,
  ): Promise<TypeEventsDto> {
    const typeEvent = await this.typeEventsService.create(createTypeEventDto);
    return plainToInstance(TypeEventsDto, typeEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Put(':id')
  @CheckRole(RoleEnum.ASSOCIATION_MANAGER, RoleEnum.EVENTS_MANAGER)
  @UseGuards(CheckRoleGuard)
  @BearAuthToken()
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateTypeEventDto: UpdateTypeEventDto,
  ): Promise<TypeEventsDto> {
    const typeEvent = await this.typeEventsService.update(
      id,
      updateTypeEventDto,
    );
    return plainToInstance(TypeEventsDto, typeEvent, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
