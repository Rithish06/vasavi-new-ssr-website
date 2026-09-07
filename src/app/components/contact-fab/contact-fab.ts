import { Component } from '@angular/core';

/** Site-wide Call/WhatsApp contact affordance, mounted once in app.html so
 *  it appears on every route. Renders as one of two layouts, switched
 *  purely by CSS media query (see contact-fab.css) rather than JS
 *  breakpoint detection:
 *   - Mobile & tablet (<= 1023px): a full-width bar fixed to the bottom
 *     of the viewport, split into "Call Now" and "WhatsApp" halves.
 *   - Laptop and up (> 1023px): two small floating circular buttons
 *     stacked in the bottom-right corner.
 *  Both link out to the same number already used elsewhere on the site
 *  (hero quick-actions, footer, navbar topbar). */
@Component({
  selector: 'app-contact-fab',
  standalone: true,
  templateUrl: './contact-fab.html',
  styleUrl: './contact-fab.css',
})
export class ContactFab {
  protected readonly phoneHref = 'tel:08071500500';
  protected readonly whatsappHref = 'https://wa.me/+918884466000';
}
