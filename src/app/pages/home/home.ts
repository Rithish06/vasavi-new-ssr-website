import { Component } from '@angular/core';

/**
 * Placeholder for the '' route. The homepage content itself hasn't been
 * built yet (pages are being built one at a time), but the route still
 * needs a real match — without one, Angular's SSR route discovery has no
 * concrete route for '/' to render or prerender, and the server responds
 * with a plain 404 ("Cannot GET /") instead of falling back to the
 * otherwise-empty <router-outlet>.
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  template: '',
})
export class HomePage {}
