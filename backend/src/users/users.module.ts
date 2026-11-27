import { Module } from '@nestjs/common';
import { AppMailModule } from '../mail/app-mail.module.js';
import { KeysService } from './keys.service.js';
import { MeController } from './me.controller.js';
import { UsersRepository } from './users.repository.js';

@Module({
  imports: [AppMailModule],
  controllers: [MeController],
  providers: [UsersRepository, KeysService],
  exports: [UsersRepository],
})
export class UsersModule {}
