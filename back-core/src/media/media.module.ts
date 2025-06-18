import { forwardRef, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from '../users/users.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  controllers: [MediaController],
  imports: [
    forwardRef(() => UsersModule),
    ServeStaticModule.forRoot({
      rootPath: process.cwd() + '/uploads',
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
