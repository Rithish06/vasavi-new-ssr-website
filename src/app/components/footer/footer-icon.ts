import { Component, input } from '@angular/core';

/**
 * Tiny inline-SVG icon renderer shared by the footer's service list,
 * contact list, and action cards. Kept as its own component (rather than
 * repeating a giant @switch in footer.html three times) since the same
 * icon set is reused across several @for loops there.
 */
@Component({
  selector: 'app-footer-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
      @switch (name()) {
        @case ('emergency') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" stroke-linecap="round" />
        }
        @case ('robotic') {
          <rect x="7" y="7" width="10" height="10" rx="2" />
          <circle cx="10" cy="11" r="0.9" fill="currentColor" stroke="none" />
          <circle cx="14" cy="11" r="0.9" fill="currentColor" stroke="none" />
          <path d="M9.5 14.5h5" stroke-linecap="round" />
          <path d="M12 3v4M4 12H2M22 12h-2" stroke-linecap="round" />
        }
        @case ('orthopaedics') {
          <circle cx="6.5" cy="6.5" r="2.4" />
          <circle cx="17.5" cy="17.5" r="2.4" />
          <path d="M8.3 8.3l7.4 7.4" stroke-width="2.6" stroke-linecap="round" />
        }
        @case ('cardiology') {
          <path
            d="M12 20s-7-4.4-9-9.4C1.6 6.8 4 4 7 4c2 0 3.6 1.2 5 3 1.4-1.8 3-3 5-3 3 0 5.4 2.8 4 6.6C19 15.6 12 20 12 20Z"
          />
          <path d="M5 12h3l1.5-3 2 5 1.5-3h3" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('nephrology') {
          <path
            d="M9 3.6c-3 0-5 3-5 7.2 0 4 2.1 8.6 6 8.6 2.3 0 2.9-1.9 1.9-3.4-1.3-2 .6-3.2 2.3-2.5 1.9.8 3.8-.4 3.8-2.9 0-3.8-3.4-6.5-5.7-6.5-1 0-1.5.5-1.9 1.1-.4-.9-.8-1.6-1.4-1.6Z"
          />
        }
        @case ('gastro') {
          <path
            d="M8.2 4.2c-2.4 0-3.9 2-3.9 4.3 0 1.5.8 2.5 1.9 3.1-1.3.8-1.9 2.1-1.9 3.6 0 2.9 2.5 4.3 5.3 4.3 3.9 0 7.2-2.5 7.2-6.7 0-2.9-1.5-4.8-3.8-5.4.6-1.3-.4-2.8-1.9-2.8-1.1 0-1.9.7-2.9.5Z"
          />
        }
        @case ('women') {
          <circle cx="9" cy="7" r="3" />
          <path d="M4 20c0-3.3 2.2-5.5 5-5.5s5 2.2 5 5.5" stroke-linecap="round" />
          <circle cx="17.5" cy="10.5" r="2" />
          <path d="M14.7 20c0-2.4 1.3-4 2.8-4s2.8 1.6 2.8 4" stroke-linecap="round" />
        }
        @case ('diagnostics') {
          <rect x="5" y="3.5" width="14" height="17" rx="2" />
          <path d="M9 3.5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.5" />
          <path d="m8.5 12.5 2 2 4-4.5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('pin') {
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="12" cy="10" r="2.4" />
        }
        @case ('mail') {
          <path d="M4 6h16v12H4V6Z" stroke-linecap="round" stroke-linejoin="round" />
          <path d="m4 7 8 6 8-6" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('phone') {
          <path
            d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.3 11.3 0 0 0 3.54.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z"
          />
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('ambulance') {
          <rect x="2.2" y="9" width="13" height="7" rx="1.2" />
          <path d="M15.2 11h3.2l2.4 2.6V16h-5.6v-5Z" stroke-linejoin="round" />
          <circle cx="7" cy="17.6" r="1.6" />
          <circle cx="17.2" cy="17.6" r="1.6" />
          <path d="M6.4 12.3h4.2M8.5 10.2v4.2" stroke-linecap="round" />
        }
        @case ('calendar') {
          <rect x="3" y="5" width="18" height="16" rx="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('stethoscope') {
          <path d="M6.2 3.5v5.8a3.8 3.8 0 0 0 7.6 0V3.5" stroke-linecap="round" />
          <path d="M10 13.3v1.9a4.9 4.9 0 0 0 9.8 0v-2.4" stroke-linecap="round" />
          <circle cx="19.8" cy="9.3" r="1.7" />
        }
        @case ('shield') {
          <path d="M12 3l7 3v6c0 5-3.5 8.5-7 9.5C8.5 20.5 5 17 5 12V6l7-3Z" stroke-linejoin="round" />
          <path d="m9 12 2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('clipboard') {
          <rect x="5" y="3.5" width="14" height="17" rx="2" />
          <path d="M9 3.5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.5" />
          <path d="M8.5 10h7M8.5 13.5h7M8.5 17h4.5" stroke-linecap="round" />
        }
        @case ('arrow') {
          <path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        }
      }
    </svg>
  `,
})
export class FooterIcon {
  readonly name = input.required<string>();
}
