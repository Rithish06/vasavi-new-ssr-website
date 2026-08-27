import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Declare fbq globally
declare const fbq: Function;

@Injectable({ providedIn: 'root' })
export class FacebookPixel {

  private pixelId = '1037382469941087';
  private trackingEnabled = true;

  constructor(private router: Router) {
    if (this.trackingEnabled) {
      this.initPixel();
      this.trackRouteChanges();
    }
  }

  // Initialize Meta Pixel
  private initPixel(): void {
    if (typeof fbq === 'function') {
      fbq('init', this.pixelId);
      fbq('track', 'PageView'); // initial load
    }
  }

  // Track SPA Route Page Views
  private trackRouteChanges(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        if (typeof fbq === 'function') {
          fbq('track', 'PageView');
        }
      });
  }

  // ⭐ Track Standard Events
  trackStandardEvent(eventName: string, params?: object): void {
    if (typeof fbq === 'function') {
      fbq('track', eventName, params || {});
      console.log('Meta Pixel Standard Event:', eventName);
    }
  }

  // ⭐ Track Custom Events
  trackCustomEvent(eventName: string, params?: object): void {
    if (typeof fbq === 'function') {
      fbq('trackCustom', eventName, params || {});
      console.log('Meta Pixel Custom Event:', eventName);
    }
  }
}
