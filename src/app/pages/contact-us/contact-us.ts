import { Component, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorsIcon } from '../doctors/doctors-icon';
import { LEAD_SUBMIT_ERROR, LeadService } from '../../lead-service';

type CardAccent = 'blue' | 'green' | 'purple';

interface InfoCard {
  icon: string;
  accent: CardAccent;
  title: string;
  description: string;
  /** Optional bold callout line under the description (a phone number or email). */
  highlight?: string;
  /** Internal route - rendered with routerLink so it doesn't full-reload the SPA. */
  path?: string;
  /** External/protocol link (tel:, mailto:, maps) - rendered with a plain href. */
  link?: string;
}

interface TrustItem {
  icon: string;
  title: string;
  subtitle: string;
}

interface ContactFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
  captcha?: string;
}

/** Published hospital line, same number used across the navbar/footer. */
const HOSPITAL_PHONE_DISPLAY = '080 71 500 500';
const HOSPITAL_PHONE_TEL = '+918071500500';
const HOSPITAL_EMAIL = 'appointments@vasavihospitals.com';

/** Characters the CAPTCHA is drawn from - no ambiguous 0/O/1/l/I. */
const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function generateCaptcha(length = 5): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return out;
}

/** "Get in Touch" - the Contact Us page. */
@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [RouterLink, DoctorsIcon],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly leads = inject(LeadService);

  protected readonly hospitalPhoneDisplay = HOSPITAL_PHONE_DISPLAY;
  protected readonly hospitalPhoneTel = HOSPITAL_PHONE_TEL;
  protected readonly hospitalEmail = HOSPITAL_EMAIL;

  protected readonly infoCards: InfoCard[] = [
    {
      icon: 'calendar',
      accent: 'blue',
      title: 'Book an Appointment',
      description: 'Find a doctor and schedule your visit',
      path: '/doctors',
    },
    {
      icon: 'phone',
      accent: 'green',
      title: 'Call Vasavi Hospitals',
      description: 'Speak directly with our team',
      highlight: HOSPITAL_PHONE_DISPLAY,
      link: 'tel:' + HOSPITAL_PHONE_TEL,
    },
    {
      icon: 'mail',
      accent: 'purple',
      title: 'Email Us',
      description: "We're here to answer your queries",
      highlight: HOSPITAL_EMAIL,
      link: 'mailto:' + HOSPITAL_EMAIL,
    },
    {
      icon: 'pin',
      accent: 'purple',
      title: 'Get Directions',
      description: 'Kumaraswamy Layout, Bengaluru',
      link: 'https://www.google.com/maps/dir/?api=1&destination=Vasavi+Hospitals+Kumaraswamy+Layout+Bengaluru',
    },
  ];

  protected readonly trustItems: TrustItem[] = [
    { icon: 'shield', title: 'Trusted Care', subtitle: '35+ Years of Excellence' },
    { icon: 'users', title: 'Expert Team', subtitle: 'Experienced & Compassionate' },
    { icon: 'clock', title: 'Timely Support', subtitle: "We're here when you need us" },
    { icon: 'heart-hands', title: 'Patient First', subtitle: 'Your well-being is our priority' },
  ];

  protected readonly hospitalAddressLines = ['#716, 36th Cross, 7th Block,', 'Kumaraswamy Layout,', 'Bengaluru, Karnataka 560078'];
  protected readonly workingHoursLines = ['Mon - Sat: 7:00 AM - 9:00 PM', 'Sunday: 7:00 AM - 1:00 PM', 'Emergency: 24 x 7'];

  protected readonly rating = 4.6;
  protected readonly reviewCount = '1,487';

  protected readonly directionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Vasavi+Hospitals+Kumaraswamy+Layout+Bengaluru';
  protected readonly largerMapUrl =
    'https://www.google.com/maps/search/?api=1&query=Vasavi+Hospitals+Kumaraswamy+Layout+Bengaluru';

  protected readonly fullName = signal('');
  protected readonly phone = signal('');
  protected readonly email = signal('');
  protected readonly service = signal('');
  protected readonly message = signal('');
  protected readonly captchaInput = signal('');
  protected readonly errors = signal<ContactFormErrors>({});
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly submitError = signal('');

  /** The CAPTCHA answer, regenerated on demand. Left blank until the
   *  browser is ready (see the constructor) - a value picked during SSR
   *  would just be a different random string than whatever the client
   *  picks next, which is exactly the kind of server/client mismatch
   *  Angular's hydration is built to avoid. */
  protected readonly captchaText = signal('');

  constructor() {
    afterNextRender(() => this.refreshCaptcha());
  }

  protected refreshCaptcha(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.captchaText.set(generateCaptcha());
    this.captchaInput.set('');
  }

  protected setFullName(value: string): void {
    this.fullName.set(value);
    this.clearError('name');
  }

  protected setPhone(value: string): void {
    this.phone.set(value);
    this.clearError('phone');
  }

  protected setEmail(value: string): void {
    this.email.set(value);
    this.clearError('email');
  }

  protected setService(value: string): void {
    this.service.set(value);
    this.clearError('service');
  }

  protected setMessage(value: string): void {
    this.message.set(value);
    this.clearError('message');
  }

  protected setCaptchaInput(value: string): void {
    this.captchaInput.set(value);
    this.clearError('captcha');
  }

  private clearError(key: keyof ContactFormErrors): void {
    if (this.errors()[key]) {
      this.errors.update((errors) => ({ ...errors, [key]: undefined }));
    }
  }

  protected submit(): void {
    if (this.submitting()) return;

    const name = this.fullName().trim();
    const phone = this.phone().trim();
    const email = this.email().trim();
    const service = this.service();
    const message = this.message().trim();
    const captcha = this.captchaInput().trim();

    const errors: ContactFormErrors = {};
    if (!name) errors.name = 'Please enter your name.';
    if (!phone) errors.phone = 'Please enter your contact number.';
    else if (phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid 10-digit phone number.';
    if (!email) errors.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
    if (!service) errors.service = 'Please enter a service.';
    if (!message) errors.message = 'Please enter your message.';
    if (!captcha) errors.captcha = 'Please enter the CAPTCHA.';
    else if (captcha.toLowerCase() !== this.captchaText().toLowerCase()) errors.captcha = 'CAPTCHA does not match.';

    this.errors.set(errors);
    if (Object.keys(errors).length > 0) {
      // A failed CAPTCHA attempt gets a fresh code, same as most real forms.
      if (errors.captcha) this.refreshCaptcha();
      return;
    }

    this.submitting.set(true);
    this.submitError.set('');
    this.leads.sendContactEnquiry({ name, phone, email, service, message }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set(LEAD_SUBMIT_ERROR);
        // The old code is spent either way - a retry needs a fresh one.
        this.refreshCaptcha();
      },
    });
  }

  protected sendAnother(): void {
    this.submitted.set(false);
    this.fullName.set('');
    this.phone.set('');
    this.email.set('');
    this.service.set('');
    this.message.set('');
    this.errors.set({});
    this.submitError.set('');
    this.refreshCaptcha();
  }
}
