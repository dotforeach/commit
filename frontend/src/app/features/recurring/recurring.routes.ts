import type { Routes } from '@angular/router';
import { DATE_PROVIDERS } from '../../core/dates/date-providers';
import { RecurringPage } from './recurring-page';

export const RECURRING_ROUTES: Routes = [{ path: '', providers: DATE_PROVIDERS, component: RecurringPage }];
