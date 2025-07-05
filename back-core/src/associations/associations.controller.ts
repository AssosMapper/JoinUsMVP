import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  MyAssociationsDto,
  PublicAssociationDto,
  CreateAssociationDto,
  UpdateAssociationDto,
} from '@shared/dto/associations.dto';
import { SaveLocalisationDto } from '@shared/dto/localisation.dto';
import { PublicUserDto } from '@shared/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { CurrentUserId } from '../utils/decorators/current-user-id.decorator';
import { AssociationsService } from './associations.service';
import { AssociationManagerGuard } from './guards/association-manager.guard';
import { AssociationMemberGuard } from './guards/association-member.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { createAssociationSchema } from '@shared/validations/associations.validation';
import { saveLocalisationSchema } from '@shared/validations/localisation.validation';
import {
  OptionalYupValidationPipe,
  YupValidationPipe,
} from '../utils/pipes/yup-validation.pipe';

@ApiTags('associations')
@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
  async findAll(): Promise<PublicAssociationDto[]> {
    const associations = await this.associationsService.findAll();
    return plainToInstance(PublicAssociationDto, associations, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('/my')
  @ApiBearerAuth()
  @BearAuthToken()
  async findUserAssociations(
    @CurrentUserId() userId: string,
  ): Promise<MyAssociationsDto[]> {
    const associations =
      await this.associationsService.findUserAssociations(userId);
    return plainToInstance(MyAssociationsDto, associations, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PublicAssociationDto> {
    const association = await this.associationsService.findOne(id);
    return plainToInstance(PublicAssociationDto, association, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get('by-name/:name')
  async findByName(@Param('name') name: string): Promise<PublicAssociationDto> {
    const association = await this.associationsService.findByName(name);
    return plainToInstance(PublicAssociationDto, association, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async create(
    @CurrentUserId() userId: string,
    @Body('association', new YupValidationPipe(createAssociationSchema))
    createAssociationDto: CreateAssociationDto,
    @Body('localisation', new OptionalYupValidationPipe(saveLocalisationSchema))
    saveLocalisationDto?: SaveLocalisationDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<PublicAssociationDto> {
    const association = await this.associationsService.create(
      userId,
      createAssociationDto,
      saveLocalisationDto,
      file,
    );
    return plainToInstance(PublicAssociationDto, association, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  async update(
    @Param('id') id: string,
    @Body() updateAssociationDto: UpdateAssociationDto,
  ): Promise<PublicAssociationDto> {
    const association = await this.associationsService.update(
      id,
      updateAssociationDto,
    );
    return plainToInstance(PublicAssociationDto, association, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  async remove(@Param('id') id: string): Promise<void> {
    await this.associationsService.remove(id);
  }

  @Get(':id/members')
  @ApiBearerAuth()
  @UseGuards(AssociationMemberGuard)
  @BearAuthToken()
  async getMembers(@Param('id') id: string): Promise<PublicUserDto[]> {
    const members = await this.associationsService.getMembers(id);
    return plainToInstance(PublicUserDto, members, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id/members/:userId')
  @ApiBearerAuth()
  @UseGuards(AssociationManagerGuard)
  @BearAuthToken()
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.associationsService.removeMember(id, userId);
  }
}
