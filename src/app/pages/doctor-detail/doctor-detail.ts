import { Component, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DOCTORS } from '../../data/doctors.data';
import { DoctorsIcon } from '../doctors/doctors-icon';

type BookingStep = 'select' | 'contact' | 'success';

interface DateOption {
  iso: string;
  weekday: string;
  day: string;
  month: string;
}

interface ContactErrors {
  name?: string;
  phone?: string;
}

/** Published hospital line, same number used in the navbar topbar. */
const HOSPITAL_PHONE_DISPLAY = '1800 412 4779';
const HOSPITAL_PHONE_TEL = '+18004124779';

/**
 * Next 12 open calendar days (Mon–Sat — Sunday is skipped, matching the
 * generic OPD hours shown on the page). Real per-doctor availability isn't
 * in our data yet, so this is every upcoming working day, not a live
 * schedule — see the note on `submitBooking()`.
 */
function buildUpcomingDates(count = 12): DateOption[] {
  const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
  const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short' });
  const options: DateOption[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (options.length < count) {
    if (cursor.getDay() !== 0) {
      options.push({
        iso: cursor.toISOString().slice(0, 10),
        weekday: weekdayFmt.format(cursor),
        day: String(cursor.getDate()).padStart(2, '0'),
        month: monthFmt.format(cursor),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return options;
}

/** Half-hour slots across the generic 9:00 AM – 5:00 PM OPD window. */
function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let mins = 9 * 60; mins <= 16 * 60 + 30; mins += 30) {
    const h24 = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    slots.push(`${h12}:${String(m).padStart(2, '0')} ${period}`);
  }
  return slots;
}

@Component({
  selector: 'app-doctor-detail-page',
  standalone: true,
  imports: [RouterLink, DoctorsIcon],
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
   * doctor's own listing-page photo — real per-doctor photos vary too much
   * in aspect ratio/background to hold a consistent hero height and
   * spacing. The listing page's cards are untouched and still use each
   * doctor's own `img`. `hasFramedPhoto` stays as a flag (rather than being
   * inlined) so a future per-doctor photo can be reintroduced later without
   * re-touching the template's conditional logic.
   */
  protected readonly heroImg = computed(() => '/Images/new-doctor-image/new-doc-images/dr-male-vector.png');
  protected readonly hasFramedPhoto = computed(() => true);

  /**
   * "Brief Profile" section, below the hero. Placeholder copy/highlights for
   * now — swap `profileBio` and `expertiseHighlights` for real per-doctor
   * content once it's supplied (e.g. add `bio`/`expertise` fields to
   * `DOCTORS` and read them here instead of these hardcoded fallbacks).
   */
  protected readonly profileBio = computed(() => {
    const doc = this.doctor();
    if (!doc) return [];
    return [
      `${doc.name} is a dedicated ${doc.department} specialist known for a calm, patient-first approach to care. Backed by years of hands-on clinical experience, ${doc.name} blends evidence-based medicine with genuine listening — helping every patient understand their diagnosis and feel confident about the treatment plan ahead.`,
      `Beyond regular clinical practice, ${doc.name} stays closely engaged with the wider medical community — attending conferences and training programs to keep pace with the latest advances in ${doc.department} care, and mentoring junior colleagues within the department.`,
    ];
  });

  protected readonly expertiseHighlights = computed(() => [
    'Comprehensive diagnosis & treatment planning',
    'Minimally invasive procedures',
    'Preventive & personalised care',
    'Post-treatment follow-up & support',
    'Collaborative, multi-disciplinary approach',
    'Patient education & counselling',
  ]);

  /**
   * "Professional Affiliations" section, below Brief Profile. Placeholder
   * names for now (no real logo artwork to hand yet, so the card just shows
   * a generic badge icon) — kept specialty-agnostic via `doc.department` so
   * it reads sensibly for any doctor. Swap for real per-doctor affiliations
   * (and add actual logo images) once that's supplied, e.g. by adding an
   * `affiliations: { name: string; logo: string }[]` field to `DOCTORS` and
   * reading it here instead of this hardcoded fallback.
   */
  protected readonly professionalAffiliations = computed(() => {
    const doc = this.doctor();
    const department = doc?.department ?? 'Medical';
    return [
      'Indian Medical Association',
      'National Medical Commission',
      `${department} Society of India`,
      `International Association of ${department} Specialists`,
    ];
  });

  protected readonly dateOptions = signal<DateOption[]>(buildUpcomingDates());
  protected readonly timeOptions = buildTimeSlots();

  protected readonly step = signal<BookingStep>('select');
  protected readonly selectedDate = signal<DateOption | null>(null);
  protected readonly selectedTime = signal<string | null>(null);
  protected readonly validationError = signal('');

  protected readonly patientName = signal('');
  protected readonly patientPhone = signal('');
  protected readonly contactErrors = signal<ContactErrors>({});

  constructor() {
    // Re-derive the page title, and reset any in-progress booking, whenever
    // the resolved doctor changes — covers both first load and navigating
    // from one doctor's profile straight to another's.
    effect(() => {
      const doc = this.doctor();
      this.titleService.setTitle(doc ? `${doc.name} — Vasavi Hospitals` : 'Doctor Not Found — Vasavi Hospitals');
      this.step.set('select');
      this.selectedDate.set(null);
      this.selectedTime.set(null);
      this.patientName.set('');
      this.patientPhone.set('');
      this.contactErrors.set({});
      this.validationError.set('');
    });
  }

  protected selectDate(option: DateOption): void {
    this.selectedDate.set(option);
    this.validationError.set('');
  }

  protected selectTime(time: string): void {
    this.selectedTime.set(time);
    this.validationError.set('');
  }

  /** Horizontally scrolls a date/time chip strip — used by the ‹ › nav buttons. */
  protected scrollChips(container: HTMLElement, direction: 1 | -1): void {
    if (!isPlatformBrowser(this.platformId)) return;
    container.scrollBy({ left: direction * 220, behavior: 'smooth' });
  }

  /** Date and time are both mandatory before moving to the contact step. */
  protected proceedToContact(): void {
    if (!this.selectedDate() || !this.selectedTime()) {
      this.validationError.set('Please select a date and a time slot to continue.');
      return;
    }
    this.validationError.set('');
    this.step.set('contact');
  }

  protected backToDateTime(): void {
    this.step.set('select');
  }

  protected setPatientName(value: string): void {
    this.patientName.set(value);
    if (this.contactErrors().name) {
      this.contactErrors.update((errors) => ({ ...errors, name: undefined }));
    }
  }

  protected setPatientPhone(value: string): void {
    this.patientPhone.set(value);
    if (this.contactErrors().phone) {
      this.contactErrors.update((errors) => ({ ...errors, phone: undefined }));
    }
  }

  protected submitBooking(): void {
    const name = this.patientName().trim();
    const phone = this.patientPhone().trim();
    const digits = phone.replace(/\D/g, '');

    const errors: ContactErrors = {};
    if (!name) errors.name = 'Please enter your name.';
    if (!phone) errors.phone = 'Please enter your phone number.';
    else if (digits.length < 10) errors.phone = 'Enter a valid 10-digit phone number.';

    this.contactErrors.set(errors);
    if (Object.keys(errors).length > 0) return;

    // NOTE: there's no booking backend wired up yet — this only simulates a
    // submission locally. Once a booking API/CRM endpoint exists, POST
    // { doctorId, date: selectedDate().iso, time: selectedTime(), name, phone }
    // here before advancing to the success step.
    this.step.set('success');
  }

  protected bookAnother(): void {
    this.step.set('select');
    this.selectedDate.set(null);
    this.selectedTime.set(null);
    this.patientName.set('');
    this.patientPhone.set('');
    this.contactErrors.set({});
    this.validationError.set('');
  }

  /** Scrolls the booking card under the sticky navbar — mirrors the doctors list page's scroll-to-search. */
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
