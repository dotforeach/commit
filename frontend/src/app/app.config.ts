import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localeEsPa from '@angular/common/locales/es-PA';
import {
  ApplicationConfig,
  LOCALE_ID,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withNavigationErrorHandler, withPreloading } from '@angular/router';
import { SelectivePreloading } from './core/selective-preloading';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { wakeRetryInterceptor } from './core/net/wake-retry.interceptor';
import { isChunkLoadError, reloadOnce } from './core/update/app-update.service';
import { TranslocoHttpLoader } from './core/i18n/transloco-loader';
import { provideServiceWorker } from '@angular/service-worker';

registerLocaleData(localeEsPa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withPreloading(SelectivePreloading),
      // Una pantalla que no se pudo descargar (versión vieja en caché, red cortada): recargar a esa URL
      withNavigationErrorHandler((e) => {
        if (isChunkLoadError(e.error)) reloadOnce(document, e.url);
      }),
    ),
    provideHttpClient(withFetch(), withInterceptors([wakeRetryInterceptor, authInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-PA' },
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
