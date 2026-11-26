import { Module } from '@nestjs/common';
import { HouseholdsModule } from '../households/households.module.js';
import { InstallmentsController } from './installments.controller.js';
import { InstallmentsService } from './installments.service.js';

@Module({ imports: [HouseholdsModule], controllers: [InstallmentsController], providers: [InstallmentsService] })
export class InstallmentsModule {}
