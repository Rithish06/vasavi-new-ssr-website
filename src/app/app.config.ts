import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

/**
 * `provideZoneChangeDetection` + the `zone.js` polyfill (see angular.json)
 * are here for the ported legacy pages (src/app/<specialty>/, .../surgery-packages/*,
 * etc.) - they were written against Angular's old zone.js-based automatic
 * change detection (plain class fields mutated from setTimeout/jQuery/HTTP
 * callbacks, no signals). This project would otherwise be zoneless. Re-adding
 * zone.js is additive/back-compat: the newer signal-based pages
 * (home/doctors/doctor-detail) don't depend on zone.js either way and keep
 * working unchanged.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    })),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      NgHcaptchaModule.forRoot({
        // Same public hCaptcha site key the old project used for every
        // ported page's captcha widget (contact-fom, callback-form, etc).
        siteKey: '2d86ca1a-fb4c-4bc0-aae6-9d9e0cb2db86',
      }),
    ),
  ],
};
