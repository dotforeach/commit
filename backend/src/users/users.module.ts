import { Module } from '@nestjs/common';
import { KeysService } from './keys.service.js';
import { MeController } from './me.controller.js';
import { UsersRepository } from './users.repository.js';

@Module({
  controllers: [MeController],
  providers: [UsersRepository, KeysService],
  exports: [UsersRepository],
})
export class UsersModule {}
