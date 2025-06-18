import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicMediaDto } from '@shared/dto/media.dto';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ApiPaginationQuery } from '../utils/decorators/ApiPaginationQuery.decorator';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { NeedPermissions } from '../utils/decorators/need-permission.decorator';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media } from './entities/media.entity';
import { MediaService } from './media.service';

@Controller({
  path: 'media',
  version: '1',
})
@BearAuthToken()
@ApiTags('Media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiResponse({ status: 200, type: Paginated<Media> })
  @ApiPaginationQuery({ canSelect: true })
  @NeedPermissions('media:list')
  findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Media>> {
    return this.mediaService.findAll(query);
  }

  @Get(':id')
  @NeedPermissions('media:read')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Patch(':id')
  @NeedPermissions('media:update')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: UpdateMediaDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateMediaDto?: UpdateMediaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.mediaService.update(id, updateMediaDto, file);
  }

  @Delete(':id')
  @NeedPermissions('media:delete')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }

  @Post('upload')
  @NeedPermissions('media:create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: CreateMediaDto,
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMediaDto: CreateMediaDto,
  ): Promise<PublicMediaDto> {
    createMediaDto.file = file;
    const media = await this.mediaService.create(createMediaDto);
    return {
      id: media.id,
      filename: media.filename,
      filepath: media.filepath,
      mimetype: media.mimetype,
      size: media.size,
      createdAt: media.createdAt,
    };
  }
}
