import { Component, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

/** Loaded globally via angular.json's `scripts` array - defines `window.AOS`. */
declare const AOS: {
  init: (options?: Record<string, unknown>) => void;
  refreshHard: () => void;
};

@Component({
  imports: [RouterOutlet, Navbar, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  constructor() {
    // Scroll-reveal (AOS) is wired up all over the site via `data-aos="..."`
    // attributes - especially the older ported specialty pages (data-aos on
    // every service/feature card) - and aos.css is loaded globally, but
    // nothing ever called AOS.init(). aos.css hides every [data-aos] element
    // (opacity: 0) until JS adds an "aos-animate" class on scroll, so with
    // init() never called those elements stayed permanently invisible -
    // making whole sections (e.g. "Our Range of ... Services") look empty
    // even though their content was there in the DOM all along.
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const start = (attemptsLeft: number) => {
        if (typeof AOS !== 'undefined') {
          AOS.init({ once: true, duration: 600, offset: 80 });
          // AOS's own MutationObserver picks up most route changes, but a
          // hard refresh after each navigation keeps newly-routed-in
          // [data-aos] content reliably visible across this SPA's routing.
          this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
              setTimeout(() => AOS.refreshHard(), 0);
            }
          });
        } else if (attemptsLeft > 0) {
          // aos.js is a plain global <script> that should already have run
          // by now, but retry briefly in case of a load-order fluke rather
          // than silently leaving every [data-aos] element hidden.
          setTimeout(() => start(attemptsLeft - 1), 100);
        }
      };
      start(10);
    });
  }
}
