import { Component, HostListener, inject, OnDestroy, OnInit, PLATFORM_ID, computed, signal, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';
import { QuickAppointmentBooking } from '../../components/quick-appointment-booking/quick-appointment-booking';
import { AppointmentBooking, buildUpcomingDates, DateOption } from '../../components/appointment-booking/appointment-booking';
import { DEPARTMENTS, Doctor, DOCTORS, MORE_DEPARTMENTS } from '../../data/doctors.data';

/** Every department this page's "Select Department" quick-filter offers -
 *  the same roster the Doctors page's filter checkboxes use, so a name
 *  picked here is guaranteed to match a real filter over there. */
const ALL_DEPARTMENTS = [...DEPARTMENTS, ...MORE_DEPARTMENTS];

/** Most doctor suggestions to show at once under "Find a Doctor" - enough
 *  to be useful without turning into a second full doctor listing. */
const MAX_DOCTOR_SUGGESTIONS = 8;

interface Department {
  name: string;
  description: string;
  featuredIcon: string;
  cardIcon: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, QuickAppointmentBooking, AppointmentBooking, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnDestroy, OnInit {

  /** Whether the "Book an Appointment" popup is open - opened from every
   *  "Book an Appointment" CTA on this page (hero button, care-team strip). */
  protected readonly showBookingModal = signal(false);

  @Input() doctorDetails: any
  @Input() headers: any

  @Output() bookAppointment = new EventEmitter<any>();


  constructor(private router: Router) { }

  departments: Department[] = [
    {
      name: 'Cardiology',
      description:
        'Advanced diagnosis and treatment for heart conditions with world-class technology and expert care.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
        <path d="M0 0h32v32H0z" fill="none" />
        <path fill="#fafbff" d="M4.374 5.988a7.63 7.63 0 0 1 10.66.13l.966.967l.86-.86A7.694 7.694 0 0 1 29.456 14.5h-2.214a5.694 5.694 0 0 0-8.968-6.86l-1.567 1.567a1 1 0 0 1-1.414 0l-1.674-1.674A5.631 5.631 0 0 0 4.86 14.5H2.61a7.63 7.63 0 0 1 1.763-8.511M22.707 19.5h2.76l-8.744 9.19a1 1 0 0 1-1.454-.006L6.661 19.5h2.481q.126 0 .249-.012l6.614 7.056zm-9.814-7.947a1 1 0 0 0-1.751-.067L8.432 16H2.668a1 1 0 1 0 0 2H9a1 1 0 0 0 .857-.485l2.063-3.438l3.186 6.37a1 1 0 0 0 1.703.141l3.371-4.636l2.18 1.816A1 1 0 0 0 23 18h6a1 1 0 1 0 0-2h-5.638l-2.722-2.268a1 1 0 0 0-1.449.18l-3.032 4.17z" />
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 32 32">
        <path d="M0 0h32v32H0z" fill="none" />
        <path fill="#001882" d="M4.374 5.988a7.63 7.63 0 0 1 10.66.13l.966.967l.86-.86A7.694 7.694 0 0 1 29.456 14.5h-2.214a5.694 5.694 0 0 0-8.968-6.86l-1.567 1.567a1 1 0 0 1-1.414 0l-1.674-1.674A5.631 5.631 0 0 0 4.86 14.5H2.61a7.63 7.63 0 0 1 1.763-8.511M22.707 19.5h2.76l-8.744 9.19a1 1 0 0 1-1.454-.006L6.661 19.5h2.481q.126 0 .249-.012l6.614 7.056zm-9.814-7.947a1 1 0 0 0-1.751-.067L8.432 16H2.668a1 1 0 1 0 0 2H9a1 1 0 0 0 .857-.485l2.063-3.438l3.186 6.37a1 1 0 0 0 1.703.141l3.371-4.636l2.18 1.816A1 1 0 0 0 23 18h6a1 1 0 1 0 0-2h-5.638l-2.722-2.268a1 1 0 0 0-1.449.18l-3.032 4.17z" />
      </svg>`,
      image: '/Images/Home-new/departments/cardiology.png',
      route: '/cardiology-hospital-in-bangalore'
    },
    {
      name: 'Neurology',
      description:
        'Diagnosis and treatment of brain, spine and nerve disorders.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
        <path d="M0 0h256v256H0z" fill="none" />
        <path fill="#fafbff" d="M246 124a54.13 54.13 0 0 0-32-49.33V72a46 46 0 0 0-86-22.67A46 46 0 0 0 42 72v2.67a54 54 0 0 0 0 98.63v2.7a46 46 0 0 0 86 22.67A46 46 0 0 0 214 176v-2.7a54.07 54.07 0 0 0 32-49.3M88 210a34 34 0 0 1-34-32.94a53.7 53.7 0 0 0 10 .94h8a6 6 0 0 0 0-12h-8a42 42 0 0 1-14-81.61a6 6 0 0 0 4-5.66V72a34 34 0 0 1 68 0v73.05A45.9 45.9 0 0 0 88 130a6 6 0 0 0 0 12a34 34 0 0 1 0 68m104-44h-8a6 6 0 0 0 0 12h8a53.7 53.7 0 0 0 10-.94A34 34 0 1 1 168 142a6 6 0 0 0 0-12a45.9 45.9 0 0 0-34 15.05V72a34 34 0 0 1 68 0v6.73a6 6 0 0 0 4 5.66A42 42 0 0 1 192 166m14-54a6 6 0 0 1-6 6h-4a34 34 0 0 1-34-34v-4a6 6 0 0 1 12 0v4a22 22 0 0 0 22 22h4a6 6 0 0 1 6 6m-146 6h-4a6 6 0 0 1 0-12h4a22 22 0 0 0 22-22v-4a6 6 0 0 1 12 0v4a34 34 0 0 1-34 34" />
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
        <path d="M0 0h256v256H0z" fill="none" />
        <path fill="#001882" d="M246 124a54.13 54.13 0 0 0-32-49.33V72a46 46 0 0 0-86-22.67A46 46 0 0 0 42 72v2.67a54 54 0 0 0 0 98.63v2.7a46 46 0 0 0 86 22.67A46 46 0 0 0 214 176v-2.7a54.07 54.07 0 0 0 32-49.3M88 210a34 34 0 0 1-34-32.94a53.7 53.7 0 0 0 10 .94h8a6 6 0 0 0 0-12h-8a42 42 0 0 1-14-81.61a6 6 0 0 0 4-5.66V72a34 34 0 0 1 68 0v73.05A45.9 45.9 0 0 0 88 130a6 6 0 0 0 0 12a34 34 0 0 1 0 68m104-44h-8a6 6 0 0 0 0 12h8a53.7 53.7 0 0 0 10-.94A34 34 0 1 1 168 142a6 6 0 0 0 0-12a45.9 45.9 0 0 0-34 15.05V72a34 34 0 0 1 68 0v6.73a6 6 0 0 0 4 5.66A42 42 0 0 1 192 166m14-54a6 6 0 0 1-6 6h-4a34 34 0 0 1-34-34v-4a6 6 0 0 1 12 0v4a22 22 0 0 0 22 22h4a6 6 0 0 1 6 6m-146 6h-4a6 6 0 0 1 0-12h4a22 22 0 0 0 22-22v-4a6 6 0 0 1 12 0v4a34 34 0 0 1-34 34" />
      </svg>`,
      image: '/Images/Home-new/departments/neuro.png',
      route: '/neurology-hospital-in-bangalore'
    },
    {
      name: 'Pulmonology',
      description:
        'Advanced care for lung and respiratory conditions.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
        <path d="M0 0h16v16H0z" fill="none" />
        <path fill="#fafbff" d="M8.5 1.5a.5.5 0 1 0-1 0v5.243L7 7.1V4.72C7 3.77 6.23 3 5.28 3c-.524 0-1.023.27-1.443.592c-.431.332-.847.773-1.216 1.229c-.736.908-1.347 1.946-1.58 2.48c-.176.405-.393 1.16-.556 2.011c-.165.857-.283 1.857-.241 2.759c.04.867.233 1.79.838 2.33c.67.6 1.622.556 2.741-.004l1.795-.897A2.5 2.5 0 0 0 7 11.264V10.5a.5.5 0 0 0-1 0v.764a1.5 1.5 0 0 1-.83 1.342l-1.794.897c-.978.489-1.415.343-1.628.152c-.28-.25-.467-.801-.505-1.63c-.037-.795.068-1.71.224-2.525c.157-.82.357-1.491.491-1.8c.19-.438.75-1.4 1.44-2.25c.342-.422.703-.799 1.049-1.065c.358-.276.639-.385.833-.385a.72.72 0 0 1 .72.72v3.094l-1.79 1.28a.5.5 0 0 0 .58.813L8 7.614l3.21 2.293a.5.5 0 1 0 .58-.814L10 7.814V4.72a.72.72 0 0 1 .72-.72c.194 0 .475.11.833.385c.346.266.706.643 1.05 1.066c.688.85 1.248 1.811 1.439 2.249c.134.309.334.98.491 1.8c.156.814.26 1.73.224 2.525c-.038.829-.224 1.38-.505 1.63c-.213.19-.65.337-1.628-.152l-1.795-.897A1.5 1.5 0 0 1 10 11.264V10.5a.5.5 0 0 0-1 0v.764a2.5 2.5 0 0 0 1.382 2.236l1.795.897c1.12.56 2.07.603 2.741.004c.605-.54.798-1.463.838-2.33c.042-.902-.076-1.902-.24-2.759c-.164-.852-.38-1.606-.558-2.012c-.232-.533-.843-1.571-1.579-2.479c-.37-.456-.785-.897-1.216-1.229C11.743 3.27 11.244 3 10.72 3C9.77 3 9 3.77 9 4.72V7.1l-.5-.357z" />
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
        <path d="M0 0h16v16H0z" fill="none" />
        <path fill="#001882" d="M8.5 1.5a.5.5 0 1 0-1 0v5.243L7 7.1V4.72C7 3.77 6.23 3 5.28 3c-.524 0-1.023.27-1.443.592c-.431.332-.847.773-1.216 1.229c-.736.908-1.347 1.946-1.58 2.48c-.176.405-.393 1.16-.556 2.011c-.165.857-.283 1.857-.241 2.759c.04.867.233 1.79.838 2.33c.67.6 1.622.556 2.741-.004l1.795-.897A2.5 2.5 0 0 0 7 11.264V10.5a.5.5 0 0 0-1 0v.764a1.5 1.5 0 0 1-.83 1.342l-1.794.897c-.978.489-1.415.343-1.628.152c-.28-.25-.467-.801-.505-1.63c-.037-.795.068-1.71.224-2.525c.157-.82.357-1.491.491-1.8c.19-.438.75-1.4 1.44-2.25c.342-.422.703-.799 1.049-1.065c.358-.276.639-.385.833-.385a.72.72 0 0 1 .72.72v3.094l-1.79 1.28a.5.5 0 0 0 .58.813L8 7.614l3.21 2.293a.5.5 0 1 0 .58-.814L10 7.814V4.72a.72.72 0 0 1 .72-.72c.194 0 .475.11.833.385c.346.266.706.643 1.05 1.066c.688.85 1.248 1.811 1.439 2.249c.134.309.334.98.491 1.8c.156.814.26 1.73.224 2.525c-.038.829-.224 1.38-.505 1.63c-.213.19-.65.337-1.628-.152l-1.795-.897A1.5 1.5 0 0 1 10 11.264V10.5a.5.5 0 0 0-1 0v.764a2.5 2.5 0 0 0 1.382 2.236l1.795.897c1.12.56 2.07.603 2.741.004c.605-.54.798-1.463.838-2.33c.042-.902-.076-1.902-.24-2.759c-.164-.852-.38-1.606-.558-2.012c-.232-.533-.843-1.571-1.579-2.479c-.37-.456-.785-.897-1.216-1.229C11.743 3.27 11.244 3 10.72 3C9.77 3 9 3.77 9 4.72V7.1l-.5-.357z" />
      </svg>`,
      image: '/Images/Home-new/departments/pulmo.png',
      route: '/lung-specialist-in-bangalore'
    },
    {
      name: 'Gastroenterology',
      description:
        'Care for digestive, liver and pancreatic disorders.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
        <path d="M0 0h48v48H0z" fill="none" />
        <path fill="#fafbff" fill-rule="evenodd" d="M22.433 7.806c.02.562.125.893.293 1.092c.245.29.49.393.78.419c.339.03.77-.047 1.341-.225a21 21 0 0 0 .971-.336c.276-.1.569-.207.861-.303c.645-.213 1.383-.412 2.13-.412c4.803 0 7.652 3.75 9.528 7.097c2.304 4.11 2.207 9.241-.247 13.264c-1.614 2.646-3.677 4.938-6.805 6.154c-4.537 1.765-9.544 1.082-13.67-.955c-.918-.454-1.997.244-1.997 1.132V41h-2v-6.267c0-2.551 2.8-3.954 4.883-2.926c3.742 1.848 8.157 2.403 12.059.885c2.567-.998 4.334-2.892 5.823-5.332c2.077-3.406 2.16-7.765.21-11.244c-1.853-3.305-4.191-6.075-7.783-6.075c-.42 0-.91.115-1.504.311c-.263.087-.528.183-.808.284l-.094.035c-.309.111-.635.228-.961.33c-.638.199-1.374.373-2.113.308c-.789-.07-1.531-.407-2.134-1.123c-.605-.718-.736-1.606-.761-2.31c-.013-.361.002-.72.017-1.034l.007-.14c.013-.267.024-.49.024-.697l2-.01c0 .267-.014.554-.027.816l-.006.128c-.015.31-.026.596-.017.867m-8.575-1.3V6h2v.373c-.002 2.728-.004 5.028 1.267 7.17c.884 1.49 2.192 2.534 3.68 3.722l.663.531c1.802 1.458 2.19 3.437 1.574 5.17c-.59 1.666-2.08 3.045-3.912 3.57c-.985.281-1.92.49-2.766.679l-.58.13c-1.012.23-1.871.45-2.634.766c-1.44.595-2.616 1.562-3.559 3.873A8 8 0 0 0 9 34.994V41H7v-6.006c0-1.29.251-2.569.74-3.765c1.135-2.783 2.69-4.157 4.645-4.966c.933-.386 1.937-.636 2.954-.868l.611-.137a45 45 0 0 0 2.63-.645c1.247-.357 2.215-1.294 2.578-2.316c.338-.954.178-2.035-.948-2.946q-.308-.248-.63-.503c-1.467-1.166-3.09-2.454-4.175-4.284c-1.561-2.631-1.554-5.454-1.547-8.059" clip-rule="evenodd" />
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
        <path d="M0 0h48v48H0z" fill="none" />
        <path fill="#001882" fill-rule="evenodd" d="M22.433 7.806c.02.562.125.893.293 1.092c.245.29.49.393.78.419c.339.03.77-.047 1.341-.225a21 21 0 0 0 .971-.336c.276-.1.569-.207.861-.303c.645-.213 1.383-.412 2.13-.412c4.803 0 7.652 3.75 9.528 7.097c2.304 4.11 2.207 9.241-.247 13.264c-1.614 2.646-3.677 4.938-6.805 6.154c-4.537 1.765-9.544 1.082-13.67-.955c-.918-.454-1.997.244-1.997 1.132V41h-2v-6.267c0-2.551 2.8-3.954 4.883-2.926c3.742 1.848 8.157 2.403 12.059.885c2.567-.998 4.334-2.892 5.823-5.332c2.077-3.406 2.16-7.765.21-11.244c-1.853-3.305-4.191-6.075-7.783-6.075c-.42 0-.91.115-1.504.311c-.263.087-.528.183-.808.284l-.094.035c-.309.111-.635.228-.961.33c-.638.199-1.374.373-2.113.308c-.789-.07-1.531-.407-2.134-1.123c-.605-.718-.736-1.606-.761-2.31c-.013-.361.002-.72.017-1.034l.007-.14c.013-.267.024-.49.024-.697l2-.01c0 .267-.014.554-.027.816l-.006.128c-.015.31-.026.596-.017.867m-8.575-1.3V6h2v.373c-.002 2.728-.004 5.028 1.267 7.17c.884 1.49 2.192 2.534 3.68 3.722l.663.531c1.802 1.458 2.19 3.437 1.574 5.17c-.59 1.666-2.08 3.045-3.912 3.57c-.985.281-1.92.49-2.766.679l-.58.13c-1.012.23-1.871.45-2.634.766c-1.44.595-2.616 1.562-3.559 3.873A8 8 0 0 0 9 34.994V41H7v-6.006c0-1.29.251-2.569.74-3.765c1.135-2.783 2.69-4.157 4.645-4.966c.933-.386 1.937-.636 2.954-.868l.611-.137a45 45 0 0 0 2.63-.645c1.247-.357 2.215-1.294 2.578-2.316c.338-.954.178-2.035-.948-2.946q-.308-.248-.63-.503c-1.467-1.166-3.09-2.454-4.175-4.284c-1.561-2.631-1.554-5.454-1.547-8.059" clip-rule="evenodd" />
      </svg>`,
      image: '/Images/Home-new/departments/gastro.png',
      route: '/surgical-gastroenterology-in-bangalore'
    },
    {
      name: 'General & Laparoscopic Surgery',
      description:
        'Minimally invasive and advanced surgical care.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1.17em" height="1em" viewBox="0 0 28 24">
        <path d="M0 0h28v24H0z" fill="none" />
        <path fill="#fafbff" d="M25.274 23.077h.967v.922h-.967zm1.942 0h.967v.922h-.967zm-7.762 0h.967v.922h-.967zm3.878 0h.967v.922h-.967zm-1.934 0h.967v.922h-.967zm-14.208 0c-.908.351-2.002.67-3.129.9l-.138.024h14.729v-.923zM18.344 10.14l7.898-7.898l-2.24-2.24L0 24a20.79 20.79 0 0 0 18.299-13.715zm5.92-9.239l.659.659L17.505 9l-.661-.659z" />
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1.17em" height="1em" viewBox="0 0 28 24">
        <path d="M0 0h28v24H0z" fill="none" />
        <path fill="#001882" d="M25.274 23.077h.967v.922h-.967zm1.942 0h.967v.922h-.967zm-7.762 0h.967v.922h-.967zm3.878 0h.967v.922h-.967zm-1.934 0h.967v.922h-.967zm-14.208 0c-.908.351-2.002.67-3.129.9l-.138.024h14.729v-.923zM18.344 10.14l7.898-7.898l-2.24-2.24L0 24a20.79 20.79 0 0 0 18.299-13.715zm5.92-9.239l.659.659L17.505 9l-.661-.659z" />
      </svg>`,
      image: '/Images/Home-new/departments/general-srug.png',
      route: ''
    },
    {
      name: 'Paediatrics & Neonatology',
      description:
        'Expert care for infants, children and newborns.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <g fill="none" stroke="#fafbff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5m1-4h.01" />
          <path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6a9 9 0 0 1-17.6 0a2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1m-3 5h.01" />
        </g>
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <g fill="none" stroke="#001882" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5m1-4h.01" />
          <path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6a9 9 0 0 1-17.6 0a2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1m-3 5h.01" />
        </g>
      </svg>`,
      image: '/Images/Home-new/departments/paedia.png',
      route: '/neonatology-and-nicu-care-in-bangalore'
    },
    {
      name: 'Obstetrics & Gynaecology',
      description:
        'Complete womens health and maternity care.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
        <path d="M0 0h48v48H0z" fill="none" />
        <g fill="none" stroke="#fafbff" stroke-width="4">
          <path stroke-linecap="round" d="M32.485 24.485A11.96 11.96 0 0 0 36 16c0-6.627-5.373-12-12-12S12 9.373 12 16c0 3.314 1.343 6.314 3.515 8.485" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m6 44l1-5l11-8l6 6l6-6l11 8l1 5" />
          <path d="M12.993 21.007Q13.013 14.842 15 12c1.988-2.841 3.387-2.632 4.405-2.19s1.618 3.334 3.319 4.168c1.7.833 6.054.936 7.545 1.939c1.49 1.002 4.9 2.867 4.05 6.051" />
        </g>
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
        <path d="M0 0h48v48H0z" fill="none" />
        <g fill="none" stroke="#001882" stroke-width="4">
          <path stroke-linecap="round" d="M32.485 24.485A11.96 11.96 0 0 0 36 16c0-6.627-5.373-12-12-12S12 9.373 12 16c0 3.314 1.343 6.314 3.515 8.485" />
          <path stroke-linecap="round" stroke-linejoin="round" d="m6 44l1-5l11-8l6 6l6-6l11 8l1 5" />
          <path d="M12.993 21.007Q13.013 14.842 15 12c1.988-2.841 3.387-2.632 4.405-2.19s1.618 3.334 3.319 4.168c1.7.833 6.054.936 7.545 1.939c1.49 1.002 4.9 2.867 4.05 6.051" />
        </g>
      </svg>`,
      image: '/Images/Home-new/departments/obg & gyn.png',
      route: '/obstetrics-and-gynaecology-hospital-in-bangalore'
    },
    {
      name: 'Orthopaedics',
      description:
        'Expert care for bones, joints, spine and muscles.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="none" stroke="#fafbff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.1374 2.73779C13.3942 3.48102 13.0092 4.77646 13.2895 5.7897C13.438 6.32603 13.4622 6.97541 13.0687 7.3689L7.3689 13.0687C6.97541 13.4622 6.32603 13.438 5.7897 13.2895C4.77646 13.0092 3.48101 13.3942 2.73779 14.1374C1.75407 15.1212 1.75407 16.7161 2.73779 17.6998C3.72152 18.6835 5.31646 18.6835 6.30018 17.6998C5.31646 18.6835 5.31645 20.2785 6.30018 21.2622C7.28391 22.2459 8.87884 22.2459 9.86257 21.2622C10.6058 20.519 10.9908 19.2235 10.7105 18.2103C10.562 17.674 10.5378 17.0246 10.9313 16.6311L16.6311 10.9313C17.0246 10.5378 17.674 10.562 18.2103 10.7105C19.2235 10.9908 20.519 10.6058 21.2622 9.86257C22.2459 8.87884 22.2459 7.28391 21.2622 6.30018C20.2785 5.31646 18.6835 5.31646 17.6998 6.30018C18.6835 5.31646 18.6835 3.72152 17.6998 2.73779C16.7161 1.75407 15.1212 1.75407 14.1374 2.73779Z" />
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path fill="none" stroke="#001882" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.1374 2.73779C13.3942 3.48102 13.0092 4.77646 13.2895 5.7897C13.438 6.32603 13.4622 6.97541 13.0687 7.3689L7.3689 13.0687C6.97541 13.4622 6.32603 13.438 5.7897 13.2895C4.77646 13.0092 3.48101 13.3942 2.73779 14.1374C1.75407 15.1212 1.75407 16.7161 2.73779 17.6998C3.72152 18.6835 5.31646 18.6835 6.30018 17.6998C5.31646 18.6835 5.31645 20.2785 6.30018 21.2622C7.28391 22.2459 8.87884 22.2459 9.86257 21.2622C10.6058 20.519 10.9908 19.2235 10.7105 18.2103C10.562 17.674 10.5378 17.0246 10.9313 16.6311L16.6311 10.9313C17.0246 10.5378 17.674 10.562 18.2103 10.7105C19.2235 10.9908 20.519 10.6058 21.2622 9.86257C22.2459 8.87884 22.2459 7.28391 21.2622 6.30018C20.2785 5.31646 18.6835 5.31646 17.6998 6.30018C18.6835 5.31646 18.6835 3.72152 17.6998 2.73779C16.7161 1.75407 15.1212 1.75407 14.1374 2.73779Z" />
      </svg>`,
      image: '/Images/Home-new/departments/ortho.png',
      route: '/orthopedic-hospital-in-bangalore'
    },
    {
      name: 'General Medicine',
      description:
        'Comprehensive care for acute and chronic illnesses.',
      featuredIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
        <path d="M0 0h256v256H0z" fill="none" />
        <g fill="#fafbff">
          <path d="M240 160a32 32 0 1 1-32-32a32 32 0 0 1 32 32" opacity=".2" />
          <path d="M220 160a12 12 0 1 1-12-12a12 12 0 0 1 12 12m-4.55 39.29A48.08 48.08 0 0 1 168 240h-24a48.05 48.05 0 0 1-48-48v-40.51A64 64 0 0 1 40 88V40a8 8 0 0 1 8-8h24a8 8 0 0 1 0 16H56v40a48 48 0 0 0 48.64 48c26.11-.34 47.36-22.25 47.36-48.83V48h-16a8 8 0 0 1 0-16h24a8 8 0 0 1 8 8v47.17c0 32.84-24.53 60.29-56 64.31V192a32 32 0 0 0 32 32h24a32.06 32.06 0 0 0 31.22-25a40 40 0 1 1 16.23.27ZM232 160a24 24 0 1 0-24 24a24 24 0 0 0 24-24" />
        </g>
      </svg>`,
      cardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256">
        <path d="M0 0h256v256H0z" fill="none" />
        <g fill="#001882">
          <path d="M240 160a32 32 0 1 1-32-32a32 32 0 0 1 32 32" opacity=".2" />
          <path d="M220 160a12 12 0 1 1-12-12a12 12 0 0 1 12 12m-4.55 39.29A48.08 48.08 0 0 1 168 240h-24a48.05 48.05 0 0 1-48-48v-40.51A64 64 0 0 1 40 88V40a8 8 0 0 1 8-8h24a8 8 0 0 1 0 16H56v40a48 48 0 0 0 48.64 48c26.11-.34 47.36-22.25 47.36-48.83V48h-16a8 8 0 0 1 0-16h24a8 8 0 0 1 8 8v47.17c0 32.84-24.53 60.29-56 64.31V192a32 32 0 0 0 32 32h24a32.06 32.06 0 0 0 31.22-25a40 40 0 1 1 16.23.27ZM232 160a24 24 0 1 0-24 24a24 24 0 0 0 24-24" />
        </g>
      </svg>`,
      image: '/Images/Home-new/departments/general-medi.png',
      route: '/internal-medicine-hospital-in-bangalore'
    }
  ];

  // Start from Cardiology
  activeIndex = signal(0);

  // True for the brief moment the featured card is fading out/in during a slide
  fading = signal(false);

  private readonly SLIDE_INTERVAL_MS = 3000;
  private readonly FADE_DURATION_MS = 400;

  private intervalId?: ReturnType<typeof setInterval>;
  private fadeTimeoutId?: ReturnType<typeof setTimeout>;

  private platformId = inject(PLATFORM_ID);
  private sanitizer = inject(DomSanitizer);
  doctor:any;

  // ===================================================================
  // Booking bar - "Select Department" -> "Find a Doctor" (scoped to that
  // department) -> "Select Date" -> "Submit". Submit opens the same
  // booking form used across the site (doctor-detail / doctors list),
  // pre-filled with whatever doctor and date were picked here.
  // ===================================================================

  protected readonly allDepartments = ALL_DEPARTMENTS;

  protected readonly departmentDropdownOpen = signal(false);
  protected readonly doctorDropdownOpen = signal(false);
  protected readonly dateDropdownOpen = signal(false);

  protected readonly selectedDepartment = signal<string | null>(null);
  protected readonly selectedDoctor = signal<Doctor | null>(null);
  protected readonly doctorSearchQuery = signal('');
  protected readonly selectedDate = signal<DateOption | null>(null);

  /** Same upcoming-weekday list the booking form itself offers, so a date
   *  picked here lines up exactly with what "Select Date" means later. */
  protected readonly dateOptions = buildUpcomingDates();

  /** Shown if "Submit" is pressed before a doctor has been picked -
   *  cleared as soon as one is chosen. */
  protected readonly bookingBarError = signal('');

  /** Doctors to list under "Find a Doctor". Once a department is chosen
   *  this shows that department's own roster (search narrows it further);
   *  with no department picked yet it falls back to a global name/
   *  speciality search across every doctor. */
  protected readonly doctorSuggestions = computed(() => {
    const department = this.selectedDepartment();
    const query = this.doctorSearchQuery().trim().toLowerCase();
    const pool = department ? DOCTORS.filter((doc) => doc.department === department) : DOCTORS;

    if (!query) {
      return department ? pool.slice(0, MAX_DOCTOR_SUGGESTIONS) : [];
    }
    return pool.filter((doc) => {
      const haystack = `${doc.name} ${doc.department} ${doc.title}`.toLowerCase();
      return haystack.includes(query);
    }).slice(0, MAX_DOCTOR_SUGGESTIONS);
  });

  protected toggleDepartmentDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.doctorDropdownOpen.set(false);
    this.dateDropdownOpen.set(false);
    this.departmentDropdownOpen.update((open) => !open);
  }

  protected toggleDoctorDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.departmentDropdownOpen.set(false);
    this.dateDropdownOpen.set(false);
    this.doctorDropdownOpen.update((open) => !open);
  }

  protected toggleDateDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.departmentDropdownOpen.set(false);
    this.doctorDropdownOpen.set(false);
    this.dateDropdownOpen.update((open) => !open);
  }

  protected selectDepartment(dept: string): void {
    this.selectedDepartment.set(dept);
    this.departmentDropdownOpen.set(false);

    // A doctor picked under a previously selected department no longer
    // applies once the department changes.
    const doctor = this.selectedDoctor();
    if (doctor && doctor.department !== dept) {
      this.selectedDoctor.set(null);
      this.doctorSearchQuery.set('');
    }
  }

  protected clearDepartment(event: Event): void {
    event.stopPropagation();
    this.selectedDepartment.set(null);
  }

  protected setDoctorSearchQuery(value: string): void {
    this.doctorSearchQuery.set(value);
    // Typing a fresh search invalidates whichever doctor was picked before.
    if (this.selectedDoctor()) this.selectedDoctor.set(null);
  }

  protected selectDoctorSuggestion(doc: Doctor): void {
    this.selectedDoctor.set(doc);
    this.doctorSearchQuery.set(doc.name);
    this.doctorDropdownOpen.set(false);
    this.bookingBarError.set('');
  }

  protected clearDoctor(event: Event): void {
    event.stopPropagation();
    this.selectedDoctor.set(null);
    this.doctorSearchQuery.set('');
  }

  protected selectDate(option: DateOption): void {
    this.selectedDate.set(option);
    this.dateDropdownOpen.set(false);
  }

  protected clearDate(event: Event): void {
    event.stopPropagation();
    this.selectedDate.set(null);
  }

  protected closeBookingDropdowns(): void {
    this.departmentDropdownOpen.set(false);
    this.doctorDropdownOpen.set(false);
    this.dateDropdownOpen.set(false);
  }

  /** Closes every dropdown on any click outside the booking bar - the
   *  toggle buttons themselves call stopPropagation(), so this only ever
   *  fires for genuine "clicked elsewhere" clicks. */
  @HostListener('document:click')
  protected onDocumentClick(): void {
    if (this.departmentDropdownOpen() || this.doctorDropdownOpen() || this.dateDropdownOpen()) {
      this.closeBookingDropdowns();
    }
  }

  /** Whether the "Book Appointment" popup (pre-filled from the booking bar
   *  above) is open. */
  protected readonly showAppointmentModal = signal(false);

  /** A doctor must be picked before "Submit" opens the booking form - the
   *  form needs a doctor to book with, same as everywhere else on the
   *  site it's used. */
  protected submitBookingRequest(event: Event): void {
    event.preventDefault();
    this.closeBookingDropdowns();

    if (!this.selectedDoctor()) {
      this.bookingBarError.set('Please choose a doctor to continue - pick a department first to see their doctors.');
      return;
    }

    this.bookingBarError.set('');
    this.showAppointmentModal.set(true);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  protected closeAppointmentModal(): void {
    this.showAppointmentModal.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  // Cache of sanitized icon markup — Angular's default [innerHTML]
  // sanitizer strips raw <svg> tags, so each icon string needs to be
  // explicitly marked as trusted HTML before it will render.
  private iconCache = new Map<string, SafeHtml>();

  sanitizeIcon(icon: string): SafeHtml {
    let safeIcon = this.iconCache.get(icon);

    if (!safeIcon) {
      safeIcon = this.sanitizer.bypassSecurityTrustHtml(icon);
      this.iconCache.set(icon, safeIcon);
    }

    return safeIcon;
  }


  // Current featured department
  activeDepartment = computed(() => {
    return this.departments[this.activeIndex()];
  });


  // Remaining departments in rotating order
  visibleDepartments = computed(() => {

    const index = this.activeIndex();

    const afterActive =
      this.departments.slice(index + 1);

    const beforeActive =
      this.departments.slice(0, index);

    return [
      ...afterActive,
      ...beforeActive
    ];
  });


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  get featuredBackground(): string {
    return `url("${this.activeDepartment().image}")`;
  }

  startAutoSlide(): void {

    // this.stopAutoSlide();

    // this.intervalId = setInterval(() => {

      // Fade the featured card out, swap to the next department
      // while it's invisible, then fade back in — a smooth
      // clockwise rotation through the department list every 3s.
    //   this.fading.set(true);

    //   this.fadeTimeoutId = setTimeout(() => {

    //     this.activeIndex.update(index =>
    //       (index + 1) % this.departments.length
    //     );

    //     this.fading.set(false);

    //   }, this.FADE_DURATION_MS);

    // }, this.SLIDE_INTERVAL_MS);
  }



  onBookClick(doctor:any) {
    this.showAppointmentModal.set(true);
    this.doctor = doctor;
    console.log(this.showAppointmentModal, this.doctor)
  }


  stopAutoSlide(): void {

    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    if (this.fadeTimeoutId !== undefined) {
      clearTimeout(this.fadeTimeoutId);
      this.fadeTimeoutId = undefined;
    }
  }


  ngOnDestroy(): void {
    this.stopAutoSlide();
  }


  /** Opens the "Book an Appointment" popup - triggered by any "Book an
   *  Appointment" CTA on this page. */
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
    if (event.key !== 'Escape') return;
    if (this.showBookingModal()) this.closeBookingModal();
    if (this.showAppointmentModal()) this.closeAppointmentModal();
    if (this.departmentDropdownOpen() || this.doctorDropdownOpen() || this.dateDropdownOpen()) {
      this.closeBookingDropdowns();
    }
  }

  doctors = [
    {
      name:'Dr. Ramesh T S',
      department: 'General Surgery',
      experience: '30+ Years Experience',
      image: '/Images/Home-new/dr-ramesh-t-s.png'
    },
    {
      name: 'Dr. Mohan Ram. P',
      department: 'General Surgery and Proctology',
      experience: '15+ Years Experience',
      image: '/Images/Home-new/dr-mohan-ram-p.png'
    },
    {
      name: 'Dr. Nisha Buchade',
      department: 'Obstetrics and Gynaecology',
      experience: '15+ Years Experience',
      image: '/Images/Home-new/dr-nisha-buchade.png'
    },
    {
      name: 'Dr. Ramesh Hanumegowda',
      department: 'Urology',
      experience: '15+ Years Experience',
      image: '/Images/Home-new/dr-ramesh-hanumegowda.png'
    }
  ];
}