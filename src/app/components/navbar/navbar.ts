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
 * "Our Services" - one entry per ported clinical specialty page (Family A +
 * Family B, 33 pages total). Listed in the same column-major reading order
 * as the approved design (top-to-bottom within a column, then on to the
 * next column) - navbar.css's grid layout relies on this order to
 * reproduce the same columns without hard-coding them separately. Paths
 * are the real SEO slugs registered in app.routes.ts, not generated ones.
 */
const SERVICES_MENU: MenuItem[] = [
  // Column 1
  { label: 'Anesthesiology', path: '/anesthesiology-hospital-in-bangalore' },
  { label: 'Bariatric Surgery', path: '/bariatric-surgery-in-bangalore' },
  { label: 'Cardiology', path: '/cardiology-hospital-in-bangalore' },
  { label: 'Dentistry', path: '/dental-clinic-in-bangalore' },
  { label: 'Dermatology', path: '/dermatology-skin-clinic-in-bangalore' },
  { label: 'Diabetes & Endocrinology', path: '/diabetes-and-endocrinology-center-in-bangalore' },
  { label: 'Emergency & Critical Care', path: '/emergency-and-critical-care-in-bangalore' },
  // Column 2
  { label: 'ENT', path: '/ent-hospital-in-bangalore' },
  { label: 'Internal Medicine', path: '/internal-medicine-hospital-in-bangalore' },
  { label: 'Liver & HPB Care', path: '/liver-hpb-care-center-in-bangalore' },
  { label: 'Medical Gastroenterology', path: '/gastroenterology-hospital-in-bangalore' },
  { label: 'Medical Oncology', path: '/medical-oncology-cancer-treatment-in-bangalore' },
  { label: 'General Surgery (MIS)', path: '/minimally-invasive-surgery-in-bangalore' },
  { label: 'Neonatology (Level-3 NICU)', path: '/neonatology-and-nicu-care-in-bangalore' },
  // Column 3
  { label: 'Nephrology', path: '/nephrology-hospital-in-bangalore' },
  { label: 'Neurology', path: '/neurology-hospital-in-bangalore' },
  { label: 'Neurosurgery', path: '/neurosurgery-specialist-in-bangalore' },
  { label: 'Nutrition & Dietetics', path: '/nutrition-and-dietetics-consultation-in-bangalore' },
  { label: 'Obstetrics & Gynaecology', path: '/obstetrics-and-gynaecology-hospital-in-bangalore' },
  { label: 'Oncology', path: '/oncology-hospital-in-bangalore' },
  { label: 'Ophthalmology', path: '/eye-hospital-in-bangalore' },
  // Column 4
  { label: 'Oral & Maxillofacial Surgery', path: '/oral-and-maxillofacial-surgery-in-bangalore' },
  { label: 'Orthopedics', path: '/orthopedic-hospital-in-bangalore' },
  { label: 'Pediatrics', path: '/pediatric-hospital-in-bangalore' },
  { label: 'Physiotherapy', path: '/physiotherapy-center-in-bangalore' },
  { label: 'Plastic Surgery', path: '/plastic-and-reconstructive-surgery-in-bangalore' },
  { label: 'Psychiatry', path: '/psychiatry-and-mental-health-in-bangalore' },
  { label: 'Pulmonology', path: '/lung-specialist-in-bangalore' },
  // Column 5
  { label: 'Radiology', path: '/radiology-and-imaging-services-in-bangalore' },
  { label: 'Surgical Gastroenterology', path: '/surgical-gastroenterology-in-bangalore' },
  { label: 'Surgical Oncology', path: '/surgical-oncology-cancer-hospital-in-bangalore' },
  { label: 'Urology', path: '/urology-hospital-in-bangalore' },
  { label: 'Vascular Sciences', path: '/vascular-surgery-in-bangalore' },
];

/** "Surgery Packages" - one entry per ported PPC package page (17 pages
 * total), same column-major ordering approach as above. */
const PACKAGES_MENU: MenuItem[] = [
  // Column 1
  { label: 'Hernia Surgery', path: '/hernia-surgery-in-bangalore' },
  { label: 'Total Knee Replacement', path: '/total-knee-replacement-in-bangalore' },
  { label: 'Total Hip Replacement', path: '/total-hip-replacement-in-bangalore' },
  { label: 'Gallbladder Removal', path: '/gallbladder-removal-surgery-in-bangalore' },
  { label: 'Appendectomy', path: '/appendectomy-surgery-in-bangalore' },
  { label: 'Hysterectomy', path: '/hysterectomy-surgery-in-bangalore' },
  // Column 2
  { label: 'Tonsillectomy', path: '/tonsillectomy-surgery-in-bangalore' },
  { label: 'Adenoid Removal', path: '/adenoid-removal-in-bangalore' },
  { label: 'Sinus Surgery', path: '/sinus-surgery-in-bangalore' },
  { label: 'Piles Surgery', path: '/piles-surgery-in-bangalore' },
  { label: 'Fistula Surgery', path: '/fistula-surgery-in-bangalore' },
  { label: 'ACL Reconstruction', path: '/acl-reconstruction-in-bangalore' },
  // Column 3
  { label: 'Prostate Removal (TURP)', path: '/turp-surgery-in-bangalore' },
  { label: 'Ovarian Cystectomy', path: '/ovarian-cystectomy-in-bangalore' },
  { label: 'Fibroid Removal', path: '/fibroid-removal-in-bangalore' },
  { label: 'CT Angiography', path: '/ct-angiography-in-bangalore' },
  { label: 'Coronary Angiography', path: '/coronary-angiography-in-bangalore' },
];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly platformId = inject(PLATFORM_ID);

  /** Full "Our Services" mega-menu, in column-major reading order (see SERVICES_MENU). */
  protected readonly servicesMenu: MenuItem[] = SERVICES_MENU;

  /** Full "Surgery Packages" mega-menu, in column-major reading order (see PACKAGES_MENU). */
  protected readonly packagesMenu: MenuItem[] = PACKAGES_MENU;

  /** Adds a subtle shadow once the page has scrolled past the top bar. */
  protected readonly isScrolled = signal(false);

  /** Mobile / tablet slide-down panel open state. */
  protected readonly mobileMenuOpen = signal(false);

  /** Which dropdown is expanded - shared by desktop hover-lock and mobile accordion. */
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
