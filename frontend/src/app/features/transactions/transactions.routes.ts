import type { Routes } from '@angular/router';
import { DATE_PROVIDERS } from '../../core/dates/date-providers';
import { TransactionsPage } from './transactions-page';

export const TRANSACTIONS_ROUTES: Routes = [{ path: '', providers: DATE_PROVIDERS, component: TransactionsPage }];
