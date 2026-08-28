import { Component, PLATFORM_ID, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DOCTORS } from '../../data/doctors.data';
import { DoctorsIcon } from '../doctors/doctors-icon';
import { AppointmentBooking } from '../../components/appointment-booking/appointment-booking';

/** Published hospital line, same number used in the navbar topbar. */
const HOSPITAL_PHONE_DISPLAY = '1800 412 4779';
const HOSPITAL_PHONE_TEL = '+18004124779';

@Component({
  selector: 'app-doctor-detail-page',
  standalone: true,
  imports: [RouterLink, DoctorsIcon, AppointmentBooking],
  templateUrl: './doctor-detail.html',
  styleUrl: './doctor-detail.css',
})
export class DoctorDetailPage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);

  protected readonly hospitalPhoneDisplay = HOSPITAL_PHONE_DISPLAY;
  protected readonly hospitalPhoneTel = HOSPITAL_PHONE_TEL;

  private readonly paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly doctor = computed(() => {
    const slug = this.paramMap().get('doctorSlug') ?? '';
    return DOCTORS.find((d) => d.slug === '/' + slug) ?? null;
  });

  /**
   * Every doctor's individual profile page currently uses this same
   * pre-composed hero graphic (dotted grid, arc-and-dot flourish, floating
   * cross and corner wave baked into the artwork itself) rather than each
   * doctor's own listing-page photo - real per-doctor photos vary too much
   * in aspect ratio/background to hold a consistent hero height and
   * spacing. The listing page's cards are untouched and still use each
   * doctor's own `img`. `hasFramedPhoto` stays as a flag (rather than being
   * inlined) so a future per-doctor photo can be reintroduced later without
   * re-touching the template's conditional logic.
   */
  protected readonly heroImg = computed(() => '/Images/new-doctor-image/new-doc-images/dr-male-vector.png');
  protected readonly hasFramedPhoto = computed(() => true);

  /**
   * "Brief Profile" section, below the hero. Real per-doctor bio, wrapped in
   * a one-element array (the template loops over paragraphs) - empty when
   * `doc.briefProfile` isn't supplied, which is what makes the whole
   * section disappear for doctors without one (see doctor-detail.html).
   */
  protected readonly profileBio = computed(() => {
    const doc = this.doctor();
    return doc?.briefProfile ? [doc.briefProfile] : [];
  });

  /** "Areas of Expertise" list within Brief Profile - empty hides that column. */
  protected readonly expertiseHighlights = computed(() => this.doctor()?.expertiseHighlights ?? []);

  /**
   * "Professional Affiliations" section, below Brief Profile. Real
   * per-doctor associations (with logo images from public/Images/affiliations
   * where available) - empty hides the whole section.
   */
  protected readonly professionalAffiliations = computed(() => this.doctor()?.professionalAffiliations ?? []);

  /**
   * "Honors & Awards" section. Real per-doctor awards - empty hides the
   * whole section. `theme` picks the card's accent color (see
   * doctor-detail.css's `.doctor-honors__card--*` modifiers) and `icon` is
   * a name understood by `<app-doctors-icon>`.
   */
  protected readonly honorsAwards = computed(() => this.doctor()?.honorsAwards ?? []);

  /**
   * "Publications" section. Real per-doctor publication titles, numbered
   * for display - empty hides the whole section.
   */
  protected readonly publications = computed(() =>
    (this.doctor()?.publications ?? []).map((title, i) => ({
      num: String(i + 1).padStart(2, '0'),
      title,
    })),
  );

  constructor() {
    // Re-derive the page title whenever the resolved doctor changes - covers
    // both first load and navigating from one doctor's profile straight to
    // another's. The booking form itself (<app-appointment-booking>) resets
    // its own in-progress state whenever its `doctorName` input changes, so
    // there's nothing booking-related left to reset here.
    effect(() => {
      const doc = this.doctor();
      this.titleService.setTitle(doc ? `${doc.name} - Vasavi Hospitals` : 'Doctor Not Found - Vasavi Hospitals');
    });
  }

  /** Scrolls the booking card under the sticky navbar - mirrors the doctors list page's scroll-to-search. */
  protected scrollToBooking(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = document.getElementById('doctor-booking-card');
    if (!target) return;
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }
}
