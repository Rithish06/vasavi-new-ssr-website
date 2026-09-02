import { Component, inject, input, output, signal } from '@angular/core';
import { DoctorsIcon } from '../../pages/doctors/doctors-icon';
import { LEAD_SUBMIT_ERROR, LeadService } from '../../lead-service';

interface ContactErrors {
  name?: string;
  phone?: string;
  package?: string;
}

/** One selectable entry in the package dropdown. */
export interface HealthPackageOption {
  slug: string;
  title: string;
}

/**
 * "Book a Health Check" popup form - collects the patient's name, phone
 * number and the package they're interested in, for the health-package
 * landing page's "Book a Health Check" CTA. The host page only shows this
 * component while its modal is open (via `@if`), so a fresh instance -
 * with no leftover state - is created every time it's reopened.
 */
@Component({
  selector: 'app-health-check-booking',
  standalone: true,
  imports: [DoctorsIcon],
  templateUrl: './health-check-booking.html',
  styleUrl: './health-check-booking.css',
})
export class HealthCheckBooking {
  private readonly leads = inject(LeadService);

  /** Every package the dropdown should offer - supplied by the host page
   *  (its own featured + standard package lists) so this component doesn't
   *  keep a separate copy of the package catalogue. */
  readonly packages = input<HealthPackageOption[]>([]);

  /** Shows a close (X) button in the header - used when hosted in a modal. */
  readonly showClose = input<boolean>(false);

  readonly close = output<void>();

  protected readonly step = signal<'form' | 'success'>('form');

  protected readonly patientName = signal('');
  protected readonly patientPhone = signal('');
  protected readonly selectedPackageSlug = signal('');
  protected readonly contactErrors = signal<ContactErrors>({});
  protected readonly submitting = signal(false);
  protected readonly submitError = signal('');

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

  protected setPackage(value: string): void {
    this.selectedPackageSlug.set(value);
    if (this.contactErrors().package) {
      this.contactErrors.update((errors) => ({ ...errors, package: undefined }));
    }
  }

  protected selectedPackageTitle(): string {
    return this.packages().find((p) => p.slug === this.selectedPackageSlug())?.title ?? '';
  }

  protected submitBooking(): void {
    if (this.submitting()) return;

    const name = this.patientName().trim();
    const phone = this.patientPhone().trim();
    const digits = phone.replace(/\D/g, '');
    const pkg = this.selectedPackageSlug();

    const errors: ContactErrors = {};
    if (!name) errors.name = 'Please enter your name.';
    if (!phone) errors.phone = 'Please enter your phone number.';
    else if (digits.length < 10) errors.phone = 'Enter a valid 10-digit phone number.';
    if (!pkg) errors.package = 'Please select a health check package.';

    this.contactErrors.set(errors);
    if (Object.keys(errors).length > 0) return;

    this.submitting.set(true);
    this.submitError.set('');
    this.leads
      .sendHealthCheckRequest({
        name,
        phone,
        // The display title, not the slug - this is read by a person in an
        // email, and the slug means nothing to the front office.
        packageName: this.selectedPackageTitle(),
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
    this.selectedPackageSlug.set('');
    this.contactErrors.set({});
    this.submitError.set('');
  }

  protected onClose(): void {
    this.close.emit();
  }
}
