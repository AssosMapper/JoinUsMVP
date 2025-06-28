import { forwardRef, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from '../users/users.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { UPLOADS_PATH } from './enums/media.enum';

@Module({
  controllers: [MediaController],
  imports: [
    forwardRef(() => UsersModule),
    ServeStaticModule.forRoot({
      rootPath: MediaService.getUploadFullPath(UPLOADS_PATH),
      serveRoot: UPLOADS_PATH,
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
