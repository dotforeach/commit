import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localeEsAr from '@angular/common/locales/es-AR';
import {
  ApplicationConfig,
  LOCALE_ID,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { SelectivePreloading } from './core/selective-preloading';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { TranslocoHttpLoader } from './core/i18n/transloco-loader';
import { provideServiceWorker } from '@angular/service-worker';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(SelectivePreloading)),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    provideTransloco({
      config: {
        availableLangs: ['es'],
        defaultLang: 'es',
        fallbackLang: 'es',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
