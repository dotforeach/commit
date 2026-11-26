import type { Routes } from '@angular/router';
import { DATE_PROVIDERS } from '../../core/dates/date-providers';
import { SavingsPage } from './savings-page';

export const SAVINGS_ROUTES: Routes = [{ path: '', providers: DATE_PROVIDERS, component: SavingsPage }];
