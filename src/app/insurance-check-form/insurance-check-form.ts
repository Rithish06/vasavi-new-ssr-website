import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { LocationService } from '../location-service';

/**
 * Shared "Insurance Check" popup, meant to be dropped into any surgery
 * package page the same way the booking popup / CallbackForm is.
 *
 * `surgeryName` is passed in by the host page (e.g. [surgeryName]="'Hernia
 * Surgery'") so the patient sees which procedure the enquiry is about, and
 * so it can be folded into the lead's page/service label - it is NOT
 * user-editable.
 *
 * ARCHITECTURE NOTE (per product decision): this used to be a two-form
 * flow - a details-only popup that, on submit, closed itself and opened
 * the separate booking popup/CallbackForm to actually capture name/phone
 * and send the lead. That was rejected: this is ONE self-contained form
 * that collects everything (name, phone, insurance details) AND performs
 * real OTP send/verify AND sends the final email itself - mirroring
 * CallbackForm's proven, working pipeline (same `/sms/send-otp-vasavi` and
 * `/email/send-pages-email` endpoints) rather than a second, disconnected
 * fake-OTP flow that silently dropped the lead. No hCaptcha gate here (per
 * product decision) - CallbackForm has one, this form deliberately doesn't.
 *
 * The lead is sent with status "Insurance-Check-Form", which the backend
 * `conditionalEmail` controller handles with its own branch: the
 * insurance-specific fields (provider, policy number, employer group, TPA)
 * are sent as discrete fields and rendered as their own lines in the
 * email/WhatsApp notification. The OTP SMS still uses the flattened
 * `buildPageLabel()` string, since that endpoint takes a single `service`.
 */
@Component({
  selector: 'app-insurance-check-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './insurance-check-form.html',
  styleUrl: './insurance-check-form.css',
})
export class InsuranceCheckForm implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() surgeryName = '';

  @Output() onClose = new EventEmitter<void>();
  /** Fires once the lead has actually been sent successfully. */
  @Output() onSubmit = new EventEmitter<void>();

  private readonly apiUrl = environment.apiUrl;

  /** Common Indian insurers, offered as suggestions (not a restricted list). */
  readonly insurerSuggestions = [
    'Star Health Insurance',
    'HDFC Ergo Health Insurance',
    'ICICI Lombard',
    'Bajaj Allianz',
    'Care Health Insurance',
    'Niva Bupa Health Insurance',
    'New India Assurance',
    'National Insurance',
    'United India Insurance',
    'Aditya Birla Health Insurance',
    'Tata AIG',
    'Reliance General Insurance',
    'Ayushman Bharat (PM-JAY)',
    'ESIC',
    'CGHS',
  ];

  otpEnabled = false;

  detailsForm: FormGroup;
  otp = '';

  showOtpSection = false;
  isSending = false;
  isVerifying = false;
  successMessage: string | null = null;

  resendTimer = 0;
  private resendInterval: ReturnType<typeof setInterval> | undefined;

  private userAddress = 'Unknown Location';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private locationService: LocationService,
  ) {
    this.detailsForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/), Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      insuranceProvider: ['', [Validators.required, Validators.minLength(2)]],
      policyNumber: ['', [Validators.required, Validators.minLength(4)]],
      employerGroupName: [''],
      tpaName: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.resendInterval);
  }

  get f() {
    return this.detailsForm.controls;
  }

  get nameError(): string {
    const c = this.detailsForm.get('name');
    if (c?.hasError('required')) return 'Name is required';
    if (c?.hasError('pattern')) return 'Name can only contain letters and spaces';
    if (c?.hasError('minlength')) return 'Name must be at least 3 characters';
    return '';
  }

  get phoneError(): string {
    const c = this.detailsForm.get('phoneNumber');
    if (c?.hasError('required')) return 'Mobile number is required';
    if (c?.hasError('pattern')) return 'Enter a valid 10-digit Indian mobile number';
    return '';
  }

  get insuranceProviderError(): string {
    const c = this.detailsForm.get('insuranceProvider');
    if (c?.hasError('required')) return 'Insurance provider is required';
    return '';
  }

  get policyNumberError(): string {
    const c = this.detailsForm.get('policyNumber');
    if (c?.hasError('required')) return 'Policy / member ID is required';
    if (c?.hasError('minlength')) return 'Enter a valid policy / member ID';
    return '';
  }

  get formattedResendTime(): string {
    const minutes = Math.floor(this.resendTimer / 60);
    const seconds = this.resendTimer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  /** Combines the surgery name with the insurance-specific fields into one
   *  label - e.g. "Hernia Surgery - Star Health Insurance, POL12345, Acme
   *  Corp Group Plan, Medi Assist TPA" - sent as the `page`/`service` value
   *  so the existing email/SMS pipeline carries full context without any
   *  new backend field. Optional fields (employer group, TPA) are only
   *  included if the patient actually filled them in. */
  private buildPageLabel(): string {
    const v = this.detailsForm.value;
    const details = [v.insuranceProvider, v.policyNumber, v.employerGroupName, v.tpaName]
      .filter((part) => !!part && String(part).trim().length > 0)
      .join(', ');
    return `${this.surgeryName} - ${details}`;
  }

  closePopup(): void {
    this.onClose.emit();
  }

  // ── Step 1: send real OTP via SMS ───────────────────────────
  submitDetailsForm(): void {
    if (this.detailsForm.invalid) {
      this.detailsForm.markAllAsTouched();
      return;
    }

    if (!this.otpEnabled) {
      // TEMPORARY: OTP disabled - submit the lead directly, skip SMS/verify.
      this.sendLeadEmail();
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('insurance_check_otp', otp);
    localStorage.setItem('insurance_check_otp_expiry', (Date.now() + 2 * 60 * 1000).toString());

    this.isSending = true;
    this.http
      .post(`${this.apiUrl}/sms/send-otp-vasavi`, {
        patientName: this.detailsForm.value.name,
        patientPhoneNumber: '91' + this.detailsForm.value.phoneNumber,
        service: this.buildPageLabel(),
        otp,
      })
      .subscribe({
        next: () => {
          this.isSending = false;
          this.showOtpSection = true;
          this.startResendTimer();
          alert('✅ OTP sent to your mobile number.');
        },
        error: (err) => {
          console.error('❌ OTP send failed:', err);
          this.isSending = false;
          alert('❌ Failed to send OTP. Please try again.');
        },
      });
  }

  backToDetailsForm(): void {
    this.showOtpSection = false;
  }

  resendOtp(): void {
    if (this.resendTimer > 0) return;
    this.submitDetailsForm();
  }

  private startResendTimer(): void {
    this.resendTimer = 120;
    clearInterval(this.resendInterval);
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) clearInterval(this.resendInterval);
    }, 1000);
  }

  // ── Step 2: verify OTP locally, then send the real lead email ──
  submitOtp(): void {
    const savedOtp = localStorage.getItem('insurance_check_otp');
    const expiry = Number(localStorage.getItem('insurance_check_otp_expiry'));

    if (!this.otp || this.otp.length !== 6) {
      alert('⚠️ Please enter the 6-digit OTP.');
      return;
    }
    if (!savedOtp || !expiry) {
      alert('⚠️ OTP expired or not found. Please resend.');
      return;
    }
    if (Date.now() > expiry) {
      alert('⚠️ OTP expired. Please resend.');
      return;
    }
    if (this.otp !== savedOtp) {
      alert('❌ Invalid OTP. Please try again.');
      return;
    }

    localStorage.removeItem('insurance_check_otp');
    localStorage.removeItem('insurance_check_otp_expiry');
    this.sendLeadEmail();
  }

  private sendLeadEmail(): void {
    this.isVerifying = true;

    this.locationService.getUserLocation().then(
      (loc) => {
        this.userAddress = loc.address;
        this.finishSend();
      },
      () => {
        this.userAddress = 'Location unavailable';
        this.finishSend();
      },
    );
  }

  private finishSend(): void {
    const v = this.detailsForm.value;

    const appointmentDetails = {
      name: v.name,
      phone: v.phoneNumber,
      address: this.userAddress,
      page: this.surgeryName,
      insuranceProvider: v.insuranceProvider,
      policyNumber: v.policyNumber,
      employerGroupName: v.employerGroupName,
      tpaName: v.tpaName,
    };

    const emailRequest = {
      whatsappNumber: ['919164840378'],
      // whatsappNumber: ['919342287945'],
      to: ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com', 'Ceo@vasavihospitals.com'],
      // to:['inventionmindskar@gmail.com'],
      status: 'Insurance-Check-Form',
      appointmentDetails,
    };

    this.http.post(`${this.apiUrl}/email/send-pages-email`, emailRequest).subscribe({
      next: () => {
        this.isVerifying = false;
        this.successMessage = '✅ Thank you! Our team will confirm your coverage and call you back shortly.';
        this.onSubmit.emit();
        setTimeout(() => {
          this.onClose.emit();
          this.router.navigate(['/thank-you']);
        }, 1200);
      },
      error: (err) => {
        console.error('❌ Email send failed:', err);
        this.isVerifying = false;
        alert('❌ Failed to send. Please try again later.');
      },
    });
  }

  private resetForm(): void {
    this.detailsForm.reset();
    this.otp = '';
    this.showOtpSection = false;
    this.isSending = false;
    this.isVerifying = false;
    this.successMessage = null;
    this.resendTimer = 0;
    clearInterval(this.resendInterval);
  }
}
