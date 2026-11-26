import { Module } from '@nestjs/common';
import { HouseholdsModule } from '../households/households.module.js';
import { CategoriesController } from './categories.controller.js';

@Module({ imports: [HouseholdsModule], controllers: [CategoriesController] })
export class CategoriesModule {}
