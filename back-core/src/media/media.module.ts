import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from '../users/users.module';
=======
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from '../users/users.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370

@Module({
  controllers: [MediaController],
  imports: [
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
<<<<<<< HEAD
=======
      serveRoot: '/uploads',
>>>>>>> 76a9b7bd6cb9f8449d9b2a871c37df0c393bf370
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  providers: [MediaService],
})
export class MediaModule {}
