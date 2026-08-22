import {
  Component,
  HostListener,
  PLATFORM_ID,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Which flyout (if any) is currently open. Only one at a time. */
type DropdownKey = 'services' | 'packages' | null;

interface MenuItem {
  label: string;
  path: string;
}

/**
 * "Our Services" — listed in the same column-major reading order as the
 * approved design (top-to-bottom within a column, then on to the next
 * column). Grid layout in navbar.css relies on this order to reproduce
 * the same columns without hard-coding them separately.
 */
const SERVICE_LABELS = [
  // Column 1
  'Anesthesiology',
  'Bariatric Surgery',
  'Cardiology',
  'Dentistry',
  'Dermatology',
  'Diabetes & Endocrinology',
  'Emergency & Critical Care',
  // Column 2
  'ENT',
  'Internal Medicine',
  'Liver & HPB Care',
  'Medical Gastroenterology',
  'Medical Oncology',
  'General Surgery (MIS)',
  'Neonatology (Level-3 NICU)',
  // Column 3
  'Nephrology',
  'Neurology',
  'Neurosurgery',
  'Nutrition & Dietetics',
  'Obstetrics & Gynaecology',
  'Oncology',
  'Ophthalmology',
  // Column 4
  'Oral & Maxillofacial Surgery',
  'Orthopedics',
  'Pediatrics',
  'Physiotherapy',
  'Plastic Surgery',
  'Psychiatry',
  'Pulmonology',
  // Column 5
  'Radiology',
  'Surgical Gastroenterology',
  'Surgical Oncology',
  'Urology',
  'Vascular Sciences',
];

/** "Surgery Packages" — same column-major ordering approach as above. */
const PACKAGE_LABELS = [
  // Column 1
  'Hernia Surgery',
  'Total Knee Replacement',
  'Total Hip Replacement',
  'Gallbladder Removal',
  'Appendectomy',
  'Hysterectomy',
  // Column 2
  'Tonsillectomy',
  'Adenoid Removal',
  'Sinus Surgery',
  'Piles Surgery',
  'Fistula Surgery',
  'ACL Reconstruction',
  // Column 3
  'Prostate Removal (TURP)',
  'Ovarian Cystectomy',
  'Fibroid Removal',
  'CT Angiography',
  'Coronary Angiography',
];

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toMenuItems(labels: string[], basePath: string): MenuItem[] {
  return labels.map((label) => ({ label, path: `${basePath}/${slugify(label)}` }));
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly platformId = inject(PLATFORM_ID);

  /** Full "Our Services" mega-menu, in column-major reading order (see SERVICE_LABELS). */
  protected readonly servicesMenu: MenuItem[] = toMenuItems(SERVICE_LABELS, '/services');

  /** Full "Surgery Packages" mega-menu, in column-major reading order (see PACKAGE_LABELS). */
  protected readonly packagesMenu: MenuItem[] = toMenuItems(PACKAGE_LABELS, '/surgery-packages');

  /** Adds a subtle shadow once the page has scrolled past the top bar. */
  protected readonly isScrolled = signal(false);

  /** Mobile / tablet slide-down panel open state. */
  protected readonly mobileMenuOpen = signal(false);

  /** Which dropdown is expanded — shared by desktop hover-lock and mobile accordion. */
  protected readonly openDropdown = signal<DropdownKey>(null);

  constructor() {
    // Read the initial scroll position once we're actually in the browser,
    // so the server-rendered markup never touches `window`.
    afterNextRender(() => this.updateScrolled());
  }

  @HostListener('window:scroll')
  protected updateScrolled(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 8);
    }
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
    this.openDropdown.set(null);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
    this.openDropdown.set(null);
  }

  protected toggleDropdown(key: DropdownKey): void {
    this.openDropdown.update((current) => (current === key ? null : key));
  }

  protected closeDropdowns(): void {
    this.openDropdown.set(null);
  }
}
