import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BearAuthToken } from '../utils/decorators/BearerAuth.decorator';
import { MediaService } from './media.service';

@Controller({
  path: 'media',
  version: '1',
})
@BearAuthToken()
@ApiTags('Media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  /*
  @Post('upload')
  @NeedPermissions('media:create')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadMediaDto: UploadMediaDto,
  ): Promise<PublicMediaDto> {
    const media = await this.mediaService.save(file, uploadMediaDto);
    return plainToInstance(PublicMediaDto, media, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
  }*/
}
