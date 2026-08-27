import { Component, input } from '@angular/core';

/**
 * Small inline-SVG icon set for the Doctors page - search, filters, sort,
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
        @case ('certificate') {
          <rect x="4" y="3" width="16" height="14" rx="2" />
          <path d="M7.5 7.5h9M7.5 10.5h6" stroke-linecap="round" />
          <path d="M9 17.5v3.5l3-1.6 3 1.6v-3.5" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('play') {
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M10 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" stroke="none" />
        }
        @case ('trophy') {
          <path d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z" stroke-linejoin="round" />
          <path d="M7 5H4a1 1 0 0 0-1 1c0 2.2 1.5 4 3.5 4.3M17 5h3a1 1 0 0 1 1 1c0 2.2-1.5 4-3.5 4.3" stroke-linecap="round" />
          <path d="M12 13v3M9 20h6M10 17h4l.5 3h-5l.5-3Z" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('document') {
          <path d="M7 3h7l4 4v14H7Z" stroke-linejoin="round" />
          <path d="M14 3v4h4" stroke-linejoin="round" />
          <path d="M9.5 12h6M9.5 15.5h6M9.5 8.5h2.5" stroke-linecap="round" />
        }
        @case ('arrow-up-right') {
          <path d="M7 17 17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('plus-outline') {
          <path d="M9 3.5h6v5.5h5.5v6H15v5.5H9V15H3.5V9H9V3.5Z" stroke-linejoin="round" />
        }
        @case ('whatsapp') {
          <!-- Just the phone/chat glyph, solid - this sits on the floating
               button's own colored circular background, so an outer bubble
               outline here would just double up on that. -->
          <path
            d="M9.1 9.2c.18-.4.37-.41.54-.42.14 0 .3 0 .43 0 .14 0 .33-.05.51.4.19.47.65 1.62.7 1.74.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.5.13.24.6 1 1.3 1.62.9.8 1.65 1.05 1.9 1.17.24.12.39.1.53-.06.15-.16.63-.73.8-.98.16-.24.33-.2.55-.12.23.08 1.44.68 1.68.8.25.12.4.18.47.29.06.1.06.6-.15 1.18-.2.58-1.18 1.13-1.63 1.2-.44.08-.83.13-2.55-.53-2.16-.85-3.56-2.98-3.67-3.12-.11-.14-.87-1.16-.87-2.21 0-1.05.55-1.56.74-1.77Z"
            fill="currentColor"
            stroke="none"
          />
          <path
            d="M12 4a8 8 0 0 0-6.93 12.02L4 20l4.1-1.07A8 8 0 1 0 12 4Z"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        }
        @case ('chevron-left') {
          <path d="m15 6-6 6 6 6" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('chevron-right') {
          <path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('droplet') {
          <path
            d="M12 3.5s6 6.8 6 11a6 6 0 1 1-12 0c0-4.2 6-11 6-11Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        }
        @case ('scan-body') {
          <path d="M4 4h4M20 4h-4M4 20h4M20 20h-4M4 4v4M20 4v4M4 20v-4M20 20v-4" stroke-linecap="round" />
          <circle cx="12" cy="9.5" r="2.2" />
          <path d="M9 18c0-2.2 1.3-3.7 3-3.7s3 1.5 3 3.7" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('leaf') {
          <path
            d="M6 20c-1.2-5.6 1-11 9.5-13.5C18.5 5.7 19 8 19 10c0 6-5 9.5-10 9.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M6.3 19.5c2-3 4.5-5.4 8-7.8" stroke-linecap="round" />
        }
        @case ('venus') {
          <circle cx="12" cy="9" r="5.5" />
          <path d="M12 14.5V21M8.5 18h7" stroke-linecap="round" />
        }
        @case ('running') {
          <circle cx="15" cy="4.6" r="1.6" fill="currentColor" stroke="none" />
          <path d="M8 21l2.5-5-1.8-2.4.7-3.8 3 1.3 1.8 2.9 3 1" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9.6 12.8l2.7-1.7M12.6 9l2-2.1" stroke-linecap="round" />
        }
        @case ('flask') {
          <path
            d="M9.5 3.5h5M10 4v5.5L5.8 18a1.5 1.5 0 0 0 1.3 2.2h9.8a1.5 1.5 0 0 0 1.3-2.2L14 9.5V4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M7.8 15h8.4" stroke-linecap="round" />
        }
        @case ('stethoscope') {
          <path d="M6 4v5a4 4 0 0 0 8 0V4" stroke-linecap="round" />
          <path d="M6 4H4.5M14 4h1.5" stroke-linecap="round" />
          <path d="M10 13v2.5a5 5 0 0 0 10 0v-1.7" stroke-linecap="round" />
          <circle cx="20" cy="13.8" r="1.6" />
        }
        @case ('heart-pulse') {
          <path
            d="M12 20.2s-7.4-4.4-9.6-9.2C1 7.6 3 4.4 6.4 4.4c2 0 3.6 1.1 5.6 3.4 2-2.3 3.6-3.4 5.6-3.4 3.4 0 5.4 3.2 4 6.6-2.2 4.8-9.6 9.2-9.6 9.2Z"
          />
          <path d="M3.6 12h3l1.6-2.6L10.6 14l1.4-4 1.6 2.6h6.4" stroke-linecap="round" stroke-linejoin="round" />
        }
        @case ('person') {
          <circle cx="12" cy="7.5" r="3.3" />
          <path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" stroke-linecap="round" />
        }
        @case ('clipboard') {
          <rect x="6" y="4.5" width="12" height="16" rx="2" />
          <path d="M9 4.5V3.8a1.3 1.3 0 0 1 1.3-1.3h3.4A1.3 1.3 0 0 1 15 3.8v.7" stroke-linecap="round" />
          <path d="m9 12 1.8 1.8L15 10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9 16.5h6" stroke-linecap="round" />
        }
      }
    </svg>
  `,
})
export class DoctorsIcon {
  readonly name = input.required<string>();
  readonly filled = input<boolean>(false);
}
