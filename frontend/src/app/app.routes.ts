import type { Routes } from '@angular/router';
import { authGuard, guestGuard, landingGuard, unlockedGuard } from './core/auth/guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Commit · Tus finanzas de 0 a 100',
    canActivate: [landingGuard],
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'aprende',
    title: 'Aprende · Commit',
    loadComponent: () => import('./features/learn/learn-page').then((m) => m.LearnPage),
  },
  {
    path: 'herramientas',
    title: 'Herramientas · Commit',
    loadComponent: () => import('./features/tools/tools-page').then((m) => m.ToolsPage),
  },
  {
    path: 'herramientas/interes-compuesto',
    title: 'Calculadora de interés compuesto · Commit',
    loadComponent: () => import('./features/tools/compound-page').then((m) => m.CompoundPage),
  },
  {
    path: 'herramientas/hipoteca',
    title: 'Calculadora de hipoteca · Commit',
    loadComponent: () => import('./features/tools/mortgage-page').then((m) => m.MortgagePage),
  },
  {
    path: 'herramientas/tarjeta-de-credito',
    title: 'Calculadora de tarjeta de crédito · Commit',
    loadComponent: () => import('./features/tools/credit-card-page').then((m) => m.CreditCardPage),
  },
  {
    path: 'herramientas/tarjeta-de-debito',
    title: 'Tarjeta de débito · Commit',
    loadComponent: () => import('./features/tools/debit-card-page').then((m) => m.DebitCardPage),
  },
  {
    // Sin guard: en desarrollo es abierta; en producción el backend exige el token de operador.
    path: 'estado',
    title: 'Estado de la infraestructura · Commit',
    loadComponent: () => import('./features/status/status-page').then((m) => m.StatusPage),
  },
  {
    path: 'aprende/:slug',
    loadComponent: () => import('./features/learn/article-page').then((m) => m.ArticlePage),
  },
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
    // Se precarga al iniciar (ver SelectivePreloading): bloquear tiene que funcionar sin conexión.
    data: { preload: true },
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
  {
    path: 'ahorro',
    canActivate: [authGuard, unlockedGuard],
    loadChildren: () => import('./features/savings/savings.routes').then((m) => m.SAVINGS_ROUTES),
  },
  {
    path: 'cotizaciones',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/rates/rates-page').then((m) => m.RatesPage),
  },
  {
    path: 'plan',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/plan/plan-page').then((m) => m.PlanPage),
  },
  {
    path: 'por-revisar',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/receipts/review-page').then((m) => m.ReviewPage),
  },
  {
    path: 'suscripcion',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/receipts/subscription-page').then((m) => m.SubscriptionPage),
  },
  {
    path: 'progreso',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/progress/progress-page').then((m) => m.ProgressPage),
  },
  {
    path: 'bienvenida',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/onboarding/onboarding-page').then((m) => m.OnboardingPage),
  },
  {
    path: 'ajustes',
    pathMatch: 'full',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/settings/settings-page').then((m) => m.SettingsPage),
  },
  {
    path: 'hogar',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/household/household-page').then((m) => m.HouseholdPage),
  },
  {
    path: 'unirme',
    canActivate: [authGuard, unlockedGuard],
    loadComponent: () => import('./features/household/join-page').then((m) => m.JoinPage),
  },
  { path: '**', redirectTo: '' },
];
