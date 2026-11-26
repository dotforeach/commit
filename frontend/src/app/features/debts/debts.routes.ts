import type { Routes } from '@angular/router';
import { DATE_PROVIDERS } from '../../core/dates/date-providers';
import { DebtsPage } from './debts-page';

export const DEBTS_ROUTES: Routes = [{ path: '', providers: DATE_PROVIDERS, component: DebtsPage }];
