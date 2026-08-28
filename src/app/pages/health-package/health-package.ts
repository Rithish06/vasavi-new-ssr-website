import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorsIcon } from '../doctors/doctors-icon';
import { HealthCheckBooking, HealthPackageOption } from '../../components/health-check-booking/health-check-booking';

interface MiniFeature {
  icon: string;
  label: string;
}

interface ChecklistItem {
  icon: string;
  label: string;
}

interface PackageFeature {
  icon: string;
  title: string;
}

type PackageAccent = 'pink' | 'blue' | 'red';

interface HealthPackageCard {
  /** Matches the `slug` in health-check.ts's `packages` array - links to
   *  "/health-package/:slug", the existing param-driven detail page. */
  slug: string;
  title: string;
  description: string;
  /** Already-formatted rupee amount, e.g. "4,500" (no "₹" or "/-"). */
  price: string;
  icon: string;
  accent: PackageAccent;
  features: PackageFeature[];
}

interface TrustItem {
  icon: string;
  title: string;
  subtitle: string;
}

/** Comprehensive Health Check Packages - the "/health-package" landing page. */
@Component({
  selector: 'app-health-package-page',
  standalone: true,
  imports: [RouterLink, DoctorsIcon, HealthCheckBooking],
  templateUrl: './health-package.html',
  styleUrl: './health-package.css',
})
export class HealthPackagePage {
  private readonly platformId = inject(PLATFORM_ID);

  /** Whether the "Book a Health Check" popup form is open. */
  protected readonly showBookingModal = signal(false);

  protected readonly miniFeatures: MiniFeature[] = [
    { icon: 'heart', label: 'Heart Health' },
    { icon: 'droplet', label: 'Diabetes Screening' },
    { icon: 'scan-body', label: 'Full Body Checkup' },
    { icon: 'leaf', label: 'Preventive Wellness' },
  ];

  protected readonly checklist: ChecklistItem[] = [
    { icon: 'check', label: 'Heart' },
    { icon: 'check', label: 'Diabetes' },
    { icon: 'check', label: 'Thyroid' },
    { icon: 'check', label: 'Liver' },
    { icon: 'check', label: 'Kidney' },
    { icon: 'check', label: 'Wellness' },
  ];

  /** The three headline annual/comprehensive packages - shown large in a
   *  photo-less, "grand" card treatment (glow accent, badge icon, pill
   *  feature chips) - see health-package.css. */
  protected readonly featuredPackages: HealthPackageCard[] = [
    {
      slug: 'vasavi-master-health-check-women',
      title: 'Vasavi Master Health Check – Women',
      description: 'Holistic care for a healthier, happier you.',
      price: '4,500',
      icon: 'person',
      accent: 'pink',
      features: [
        { icon: 'venus', title: 'Women-Focused Screening' },
        { icon: 'leaf', title: 'Holistic Wellness' },
        { icon: 'shield', title: 'Preventive Care' },
      ],
    },
    {
      slug: 'comprehensive-annual-diabetes-care-package',
      title: 'Comprehensive Annual Diabetes Care Package',
      description: 'Complete care for better control and a healthier life.',
      price: '9,999',
      icon: 'droplet',
      accent: 'blue',
      features: [
        { icon: 'droplet', title: 'Complete Diabetes Screening' },
        { icon: 'shield', title: 'Type 1 & Type 2 Screening' },
        { icon: 'clipboard', title: 'Lifestyle & Risk Assessment' },
      ],
    },
    {
      slug: 'comprehensive-annual-heart-care-package',
      title: 'Comprehensive Annual Heart Care Package',
      description: 'In-depth heart screening for long-term heart health.',
      price: '6,999',
      icon: 'heart',
      accent: 'red',
      features: [
        { icon: 'heart', title: 'Comprehensive Screening' },
        { icon: 'heart-pulse', title: 'Preventive & Diagnostic' },
        { icon: 'shield', title: 'Cardiac Risk Assessment' },
      ],
    },
  ];

  /** The remaining five packages - shown in a compact, photo-less row (all
   *  in the same blue accent, unlike the three category-colored featured
   *  cards above). */
  protected readonly standardPackages: HealthPackageCard[] = [
    {
      slug: 'basic-health-check-package',
      title: 'Basic Health Check Package',
      description: 'Essential tests for early detection and peace of mind.',
      price: '1,700',
      icon: 'clipboard',
      accent: 'blue',
      features: [
        { icon: 'clipboard', title: 'Essential Tests' },
        { icon: 'search', title: 'Early Detection' },
      ],
    },
    {
      slug: 'well-women-health-check-up',
      title: 'Vasavi Well Women Health Check up',
      description: 'Complete care for every stage of a woman’s health.',
      price: '1,999',
      icon: 'person',
      accent: 'blue',
      features: [
        { icon: 'venus', title: 'Women-Specific Tests' },
        { icon: 'shield', title: 'Preventive Care' },
      ],
    },
    {
      slug: 'cardiac-wellness-package',
      title: 'Cardiac Wellness Package',
      description: 'Advanced heart checks to keep your heart strong.',
      price: '5,999',
      icon: 'heart-pulse',
      accent: 'blue',
      features: [
        { icon: 'heart', title: 'Advanced Cardiac Checks' },
        { icon: 'shield', title: 'Heart Risk Detection' },
      ],
    },
    {
      slug: 'diabetes-health-check',
      title: 'Vasavi Diabetic Health Check up',
      description: 'Complete screening for better diabetes management.',
      price: '4,000',
      icon: 'droplet',
      accent: 'blue',
      features: [
        { icon: 'droplet', title: '39 Tests' },
        { icon: 'shield', title: 'Type 1 & Type 2 Screening' },
      ],
    },
    {
      slug: 'vasavi-master-health-check-men',
      title: 'Vasavi Master Health Check – Men',
      description: 'Advanced screening for men’s complete wellness.',
      price: '4,000',
      icon: 'person',
      accent: 'blue',
      features: [
        { icon: 'heart', title: 'Heart & Lung Care' },
        { icon: 'running', title: 'Lifestyle Risk Control' },
      ],
    },
  ];

  protected readonly trustItems: TrustItem[] = [
    { icon: 'shield', title: 'NABH Accredited', subtitle: 'Trusted healthcare' },
    { icon: 'stethoscope', title: 'Expert Doctors', subtitle: 'Across Specialties' },
    { icon: 'flask', title: 'Advanced Labs', subtitle: 'Accurate Reports' },
    { icon: 'clock', title: 'Easy Booking', subtitle: 'Quick & Hassle-free' },
  ];

  /** Every package on this page, flattened into the {slug, title} shape the
   *  booking popup's dropdown needs - keeps the dropdown in sync with the
   *  featured/standard cards above instead of keeping a separate list. */
  protected readonly allPackages: HealthPackageOption[] = [...this.featuredPackages, ...this.standardPackages].map(
    (pkg) => ({ slug: pkg.slug, title: pkg.title }),
  );

  /** Opens the "Book a Health Check" popup - triggered by the hero CTA. */
  protected openBookingModal(event: Event): void {
    event.preventDefault();
    this.showBookingModal.set(true);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  protected closeBookingModal(): void {
    this.showBookingModal.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:keydown', ['$event'])
  protected onWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showBookingModal()) {
      this.closeBookingModal();
    }
  }

  /** Scrolls to "Our Health Check Packages" under the sticky navbar - the hero's "Explore Packages" CTA. */
  protected scrollToPackages(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = document.getElementById('health-packages-section');
    if (!target) return;
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }
}
