import type { Routes } from '@angular/router';
import { authGuard, guestGuard, unlockedGuard } from './core/auth/guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'registro',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'ingresar',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'desbloquear',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/unlock/unlock').then((m) => m.Unlock),
  },
  {
    path: 'recuperar',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/recover/recover').then((m) => m.Recover),
  },
  {
    path: 'ajustes/clave',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () =>
      import('./features/auth/change-passphrase/change-passphrase').then((m) => m.ChangePassphrase),
  },
  {
    path: 'inicio',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'cuentas',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/accounts/accounts-page').then((m) => m.AccountsPage),
  },
  {
    path: 'movimientos',
    canActivate: [authGuard, unlockedGuard],
    loadChildren: () => import('./features/transactions/transactions.routes').then((m) => m.TRANSACTIONS_ROUTES),
  },
  {
    path: 'recurrentes',
    canActivate: [authGuard, unlockedGuard],
    loadChildren: () => import('./features/recurring/recurring.routes').then((m) => m.RECURRING_ROUTES),
  },
  {
    path: 'presupuesto',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/budget/budget-page').then((m) => m.BudgetPage),
  },
  {
    path: 'deudas',
    canActivate: [authGuard, unlockedGuard],
    loadChildren: () => import('./features/debts/debts.routes').then((m) => m.DEBTS_ROUTES),
  },
  { path: '**', redirectTo: 'inicio' },
];
