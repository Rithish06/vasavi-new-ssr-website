import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

/**
 * Delivers every website enquiry through the admin-panel backend's
 * `POST /api/email/send-pages-email` handler (`conditionalEmail`), which
 * mails the front office and pushes the same text to the care team's
 * WhatsApp line.
 *
 * That handler picks its email template purely from the `status` tag, and
 * each template renders a fixed set of `appointmentDetails` keys - anything
 * not named in the matching server branch is simply dropped, and an
 * unrecognised tag is rejected with a 404. So the tags and payload shapes
 * below have to stay in step with `conditionalEmail`; keeping them in one
 * service (rather than inline in each form) is what makes that checkable.
 */

const LEAD_ENDPOINT = `${environment.apiUrl}/email/send-pages-email`;

/** Front-office inbox + the WhatsApp line the care team watches. */
// const LEAD_RECIPIENTS = ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com'];
// const LEAD_WHATSAPP = ['918884466000'];
const LEAD_RECIPIENTS = ['inventionmindsgiri@gmail.com'];
const LEAD_WHATSAPP = ['919342287945'];

/** The `status` values `conditionalEmail` has a template for. */
type LeadStatus =
  | 'Contact-Page'
  | 'Doctor-Appointment'
  | 'Health Checkup Appointment Booking'
  | 'Quick-Appointment';

export interface ContactEnquiry {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

export interface DoctorAppointmentRequest {
  name: string;
  phone: string;
  doctor: string;
  /** Human-readable ("Mon, 15 Sep 2026") - this goes straight into an email. */
  date: string;
  /** Free text ("morning", "after 3 PM"). Optional on the form. */
  preferredTime?: string;
}

export interface HealthCheckRequest {
  name: string;
  phone: string;
  /** The package's display title, not its slug. */
  packageName: string;
}

export interface QuickEnquiry {
  name: string;
  phone: string;
  /** The visitor-facing service label, not the internal slug. */
  service: string;
  /** Only collected for "Doctor Appointment" and "Others". */
  detail?: string;
  /** Which page the popup was opened from. */
  page?: string;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly http = inject(HttpClient);

  /** Contact Us page - "Get in Touch". */
  sendContactEnquiry(lead: ContactEnquiry): Observable<unknown> {
    return this.send('Contact-Page', lead);
  }

  /** Doctor profile page + the doctors-list card popup. */
  sendDoctorAppointment(lead: DoctorAppointmentRequest): Observable<unknown> {
    return this.send('Doctor-Appointment', {
      ...lead,
      // '' rather than undefined: the server renders `|| 'Not specified'`,
      // which an absent key would satisfy too, but an explicit empty string
      // keeps the payload shape identical on every submission.
      preferredTime: lead.preferredTime?.trim() ?? '',
    });
  }

  /** Health package page - "Book a Health Check". */
  sendHealthCheckRequest(lead: HealthCheckRequest): Observable<unknown> {
    return this.send('Health Checkup Appointment Booking', {
      ...lead,
      page: 'Health Packages Page',
    });
  }

  /** Site-wide quick "Book an Appointment" popup. */
  sendQuickEnquiry(lead: QuickEnquiry): Observable<unknown> {
    return this.send('Quick-Appointment', {
      ...lead,
      detail: lead.detail?.trim() ?? '',
      page: lead.page ?? 'Home Page',
    });
  }

  private send(status: LeadStatus, appointmentDetails: object): Observable<unknown> {
    return this.http.post(LEAD_ENDPOINT, {
      to: LEAD_RECIPIENTS,
      whatsappNumber: LEAD_WHATSAPP,
      status,
      appointmentDetails,
    });
  }
}

/**
 * Shown when a submission fails - the visitor still has a way through, so a
 * dropped request doesn't read as a dead end. Shared by all four forms.
 */
export const LEAD_SUBMIT_ERROR =
  "Sorry, we couldn't send your request just now. Please try again, or call us on 080 71 500 500.";
