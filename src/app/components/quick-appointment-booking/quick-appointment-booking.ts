import { Component, computed, inject, input, output, signal } from '@angular/core';
import { DoctorsIcon } from '../../pages/doctors/doctors-icon';
import { LEAD_SUBMIT_ERROR, LeadService } from '../../lead-service';

export type ServiceNeeded = 'doctor' | 'surgery' | 'health-check' | 'others';

interface ServiceOption {
  value: ServiceNeeded;
  label: string;
  icon: string;
}

interface BookingErrors {
  name?: string;
  phone?: string;
  service?: string;
  detail?: string;
}

/** Every choice the "Service Needed" selector offers, in display order. */
const SERVICE_OPTIONS: ServiceOption[] = [
  { value: 'doctor', label: 'Doctor Appointment', icon: 'stethoscope' },
  { value: 'surgery', label: 'Surgery Enquiry', icon: 'grid-badge' },
  { value: 'health-check', label: 'Health Check', icon: 'heart-pulse' },
  { value: 'others', label: 'Others', icon: 'message' },
];

/**
 * Quick "Book an Appointment" popup - the site-wide CTA used from the home
 * page (hero button, care-team strip, and anywhere else a fast enquiry is
 * wanted, without pinning the visitor to one doctor or one health package
 * the way <app-appointment-booking>/<app-health-check-booking> do).
 *
 * Only Name, Phone and a Service Needed choice are always required. Picking
 * "Doctor Appointment" or "Others" reveals one free-text field so the
 * visitor can tell us more in their own words (department, treatment,
 * doctor's name, or whatever the enquiry is) - "Surgery Enquiry" and
 * "Health Check" need nothing further; the chosen service label alone is
 * enough for the care team to call back on.
 */
@Component({
  selector: 'app-quick-appointment-booking',
  standalone: true,
  imports: [DoctorsIcon],
  templateUrl: './quick-appointment-booking.html',
  styleUrl: './quick-appointment-booking.css',
})
export class QuickAppointmentBooking {
  private readonly leads = inject(LeadService);

  protected readonly serviceOptions = SERVICE_OPTIONS;

  /** Shows a close (X) button in the header - used when hosted in a modal. */
  readonly showClose = input<boolean>(false);

  /**
   * Which page this popup was opened from - passed along with the enquiry so
   * the care team can see where the visitor was when they asked. This popup
   * is site-wide, so it defaults to the home page (where it's used most)
   * and any other host page names itself.
   */
  readonly sourcePage = input<string>('Home Page');

  readonly close = output<void>();

  protected readonly step = signal<'form' | 'success'>('form');

  protected readonly patientName = signal('');
  protected readonly patientPhone = signal('');
  protected readonly service = signal<ServiceNeeded | null>(null);
  protected readonly detail = signal('');
  protected readonly errors = signal<BookingErrors>({});
  protected readonly submitting = signal(false);
  protected readonly submitError = signal('');

  /** "Doctor Appointment" and "Others" ask a free-text follow-up; "Surgery
   *  Enquiry" and "Health Check" need nothing beyond the service itself. */
  protected readonly needsDetail = computed(() => {
    const value = this.service();
    return value === 'doctor' || value === 'others';
  });

  protected readonly detailLabel = computed(() =>
    this.service() === 'doctor' ? 'Department, Treatment or Doctor’s Name' : 'Tell Us What You Need',
  );

  protected readonly detailPlaceholder = computed(() =>
    this.service() === 'doctor'
      ? 'e.g. Cardiology, Bypass Surgery, or Dr. Ramesh Kumar'
      : 'Briefly describe your enquiry',
  );

  /** Guidance shown under the free-text field so the visitor knows what
   *  "enough" looks like - a department, a treatment (in the medical term
   *  they know it by), or a doctor's name are all fine on their own. */
  protected readonly detailGuidance = computed(() =>
    this.service() === 'doctor'
      ? "Type whichever you know - the department (e.g. Cardiology), the treatment you need (e.g. Angioplasty, Knee Replacement), or a doctor's name."
      : "A line or two is enough - our care team will call to understand the rest.",
  );

  protected selectedServiceLabel(): string {
    return this.serviceOptions.find((option) => option.value === this.service())?.label ?? '';
  }

  protected setPatientName(value: string): void {
    this.patientName.set(value);
    this.clearError('name');
  }

  protected setPatientPhone(value: string): void {
    this.patientPhone.set(value);
    this.clearError('phone');
  }

  protected selectService(value: ServiceNeeded): void {
    this.service.set(value);
    this.clearError('service');
    // A field typed in for one service (e.g. a department for "Doctor
    // Appointment") shouldn't silently ride along under a different
    // service the visitor switches to - especially since "Surgery
    // Enquiry"/"Health Check" don't show the field at all.
    this.detail.set('');
    this.clearError('detail');
  }

  protected setDetail(value: string): void {
    this.detail.set(value);
    this.clearError('detail');
  }

  private clearError(key: keyof BookingErrors): void {
    if (this.errors()[key]) {
      this.errors.update((errors) => ({ ...errors, [key]: undefined }));
    }
  }

  protected submitBooking(): void {
    if (this.submitting()) return;

    const name = this.patientName().trim();
    const phone = this.patientPhone().trim();
    const digits = phone.replace(/\D/g, '');
    const service = this.service();
    const detail = this.detail().trim();

    const errors: BookingErrors = {};
    if (!name) errors.name = 'Please enter your name.';
    if (!phone) errors.phone = 'Please enter your phone number.';
    else if (digits.length < 10) errors.phone = 'Enter a valid 10-digit phone number.';
    if (!service) errors.service = 'Please select what you need.';
    if (service && this.needsDetail() && !detail) {
      errors.detail =
        service === 'doctor'
          ? 'Please tell us the department, treatment or doctor.'
          : 'Please tell us briefly what you need.';
    }

    this.errors.set(errors);
    if (Object.keys(errors).length > 0) return;

    this.submitting.set(true);
    this.submitError.set('');
    this.leads
      .sendQuickEnquiry({
        name,
        phone,
        // The label the visitor actually clicked, not the internal slug.
        service: this.selectedServiceLabel(),
        // "Surgery Enquiry" and "Health Check" never show the field, so
        // there's nothing to send for them.
        detail: this.needsDetail() ? detail : '',
        page: this.sourcePage(),
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.step.set('success');
        },
        error: () => {
          this.submitting.set(false);
          this.submitError.set(LEAD_SUBMIT_ERROR);
        },
      });
  }

  protected bookAnother(): void {
    this.step.set('form');
    this.patientName.set('');
    this.patientPhone.set('');
    this.service.set(null);
    this.detail.set('');
    this.errors.set({});
    this.submitError.set('');
  }

  protected onClose(): void {
    this.close.emit();
  }
}
