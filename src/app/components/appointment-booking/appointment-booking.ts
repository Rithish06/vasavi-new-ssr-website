import { Component, PLATFORM_ID, effect, inject, input, output, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DoctorsIcon } from '../../pages/doctors/doctors-icon';

type BookingStep = 'select' | 'contact' | 'success';

export interface DateOption {
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
 * Next 12 open calendar days (Mon–Sat - Sunday is skipped, matching the
 * generic OPD hours shown on the page). Real per-doctor availability isn't
 * in our data yet, so this is every upcoming working day, not a live
 * schedule - see the note on `submitBooking()`.
 */
export function buildUpcomingDates(count = 12): DateOption[] {
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

/**
 * The exact "Book Appointment" form used on a doctor's own profile page
 * (doctor-detail), pulled out into its own reusable component so it can
 * also be popped up from a doctor card on the doctors list page. Every
 * instance is self-contained (its own booking state), so the doctors list
 * page can host one shared instance across all cards and just swap which
 * doctor it's booking for.
 */
@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [DoctorsIcon],
  templateUrl: './appointment-booking.html',
  styleUrl: './appointment-booking.css',
})
export class AppointmentBooking {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly hospitalPhoneDisplay = HOSPITAL_PHONE_DISPLAY;
  protected readonly hospitalPhoneTel = HOSPITAL_PHONE_TEL;

  /**
   * Which doctor this booking form is for. Shown under the "Book
   * Appointment" heading, and will be included in the submitted payload
   * once a real booking backend exists (see the note on `submitBooking()`).
   * Changing it (e.g. re-using one shared instance for a different doctor
   * card) resets the whole in-progress flow below, via the `effect()` in
   * the constructor - so switching doctors never leaves a stale date/time/
   * contact selection behind.
   */
  readonly doctorName = input<string>('');

  /**
   * Shows a close (X) button in the header - used when this component is
   * hosted inside a popup/modal (the doctors list page) rather than shown
   * inline on a doctor's own profile page, where there's nothing to close.
   */
  readonly showClose = input<boolean>(false);

  /**
   * A date already picked before this modal opened (e.g. the home page's
   * booking bar collects a date up front) - pre-selects that date on the
   * 'select' step instead of starting from scratch, while still asking for
   * a time slot, which is never collected anywhere else.
   */
  readonly initialDate = input<DateOption | null>(null);

  readonly close = output<void>();

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
    // Reset any in-progress booking whenever the doctor this form is for
    // changes - covers both a fresh doctor-detail page load and re-using
    // this one component instance for a different doctor's card popup.
    effect(() => {
      this.doctorName();
      this.step.set('select');
      this.selectedDate.set(this.initialDate());
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

  /** Horizontally scrolls a date/time chip strip - used by the ‹ › nav buttons. */
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

    // NOTE: there's no booking backend wired up yet - this only simulates a
    // submission locally. Once a booking API/CRM endpoint exists, POST
    // { doctorName: doctorName(), date: selectedDate().iso, time: selectedTime(), name, phone }
    // here before advancing to the success step.
    this.step.set('success');
  }

  protected bookAnother(): void {
    this.step.set('select');
    this.selectedDate.set(this.initialDate());
    this.selectedTime.set(null);
    this.patientName.set('');
    this.patientPhone.set('');
    this.contactErrors.set({});
    this.validationError.set('');
  }

  protected onClose(): void {
    this.close.emit();
  }
}
