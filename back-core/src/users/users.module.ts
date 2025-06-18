import { Module, forwardRef } from '@nestjs/common';
import { LocalisationModule } from '@src/localisation/localisation.module';
import { MediaModule } from '@src/media/media.module';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    LocalisationModule,
    forwardRef(() => MediaModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
