import { Component, input } from '@angular/core';

/**
 * Small inline-SVG icon set for the Doctors page — search, filters, sort,
 * card meta (clock/pin/star), favorite heart, view-toggle, etc. Same
 * pattern as the footer's icon component: one @switch instead of
 * repeating markup at every call site.
 */
@Component({
  selector: 'app-doctors-icon',
  standalone: true,
  template: `
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      [attr.fill]="filled() ? 'currentColor' : 'none'"
      stroke="currentColor"
      stroke-width="1.8"
      aria-hidden="true"
    >
      @switch (name()) {
        @case ('search') {
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" stroke-linecap="round" />
        }
        @case ('filter') {
          <path d="M4 5h16M7 12h10M10.5 19h3" stroke-linecap="round" />
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('chevron-up') {
          <path d="m6 15 6-6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('close') {
          <path d="m6 6 12 12M18 6 6 18" stroke-linecap="round" />
        }
        @case ('users') {
          <circle cx="8.5" cy="8" r="3" />
          <path d="M2.5 19c0-3.3 2.5-5.5 6-5.5s6 2.2 6 5.5" stroke-linecap="round" />
          <path d="M15.5 8.3a2.7 2.7 0 1 1 0-5.4M21.5 19c0-2.7-1.7-4.7-4-5.3" stroke-linecap="round" />
        }
        @case ('grid-badge') {
          <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
          <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
          <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
          <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
        }
        @case ('smiley') {
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" stroke-linecap="round" />
          <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('pin') {
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="12" cy="10" r="2.4" />
        }
        @case ('star') {
          <path
            d="m12 3.5 2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L12 3.5Z"
            stroke-linejoin="round"
          />
        }
        @case ('heart') {
          <path
            d="M12 20.2s-7.4-4.4-9.6-9.2C1 7.6 3 4.4 6.4 4.4c2 0 3.6 1.1 5.6 3.4 2-2.3 3.6-3.4 5.6-3.4 3.4 0 5.4 3.2 4 6.6-2.2 4.8-9.6 9.2-9.6 9.2Z"
          />
        }
        @case ('calendar') {
          <rect x="3" y="5" width="18" height="16" rx="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('list') {
          <path d="M8 6h13M8 12h13M8 18h13" stroke-linecap="round" />
          <circle cx="3.5" cy="6" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="3.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="3.5" cy="18" r="1.1" fill="currentColor" stroke="none" />
        }
        @case ('headset') {
          <path d="M4 13.5v-1a8 8 0 0 1 16 0v1" stroke-linecap="round" />
          <rect x="3" y="13" width="4" height="6" rx="1.4" />
          <rect x="17" y="13" width="4" height="6" rx="1.4" />
          <path d="M19 19.5a4 4 0 0 1-4 3.5h-2" stroke-linecap="round" />
        }
        @case ('shield') {
          <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9.5C8.5 20.5 5 17 5 12V6l7-3Z" stroke-linejoin="round" />
          <path d="m9 12 2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('heart-hands') {
          <path
            d="M12 8.2c-.8-1.4-2-2.2-3.5-2.2C6.5 6 5 7.7 5 9.7c0 3 3.4 5.6 7 8 3.6-2.4 7-5 7-8 0-2-1.5-3.7-3.5-3.7-1.5 0-2.7.8-3.5 2.2Z"
          />
        }
        @case ('arrow') {
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('check') {
          <path d="m5 12.5 4.5 4.5L19 7" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('sliders') {
          <path d="M4 6h9M17 6h3M4 12h3M9 12h11M4 18h13M19 18h1" stroke-linecap="round" />
          <circle cx="12.5" cy="6" r="2" />
          <circle cx="6.5" cy="12" r="2" />
          <circle cx="16.5" cy="18" r="2" />
        }
        @case ('phone') {
          <path
            d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.3 11.3 0 0 0 3.54.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        }
        @case ('graduation-cap') {
          <path d="m12 4 9 4.5-9 4.5-9-4.5Z" stroke-linejoin="round" />
          <path d="M6.5 10.8v4.2c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M21 8.5v5.5" stroke-linecap="round" />
        }
        @case ('badge') {
          <circle cx="12" cy="9.5" r="6" />
          <path d="M9 14.8 7.6 21l4.4-2.4 4.4 2.4-1.4-6.2" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('chevron-left') {
          <path d="m15 6-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('chevron-right') {
          <path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        }
      }
    </svg>
  `,
})
export class DoctorsIcon {
  readonly name = input.required<string>();
  readonly filled = input<boolean>(false);
}
