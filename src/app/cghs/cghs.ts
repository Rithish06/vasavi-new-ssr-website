import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { CallbackForm } from '../ads-pages/callback-form/callback-form';

/**
 * CGHS = Central Government Health Scheme.
 *
 * A Government of India health scheme (Ministry of Health & Family Welfare)
 * covering serving central government employees, pensioners and their
 * dependants. Beneficiaries hold a CGHS card, get treated at CGHS Wellness
 * Centres for primary care, and are referred to empanelled private hospitals
 * for specialist consultations, diagnostics and surgery. At an empanelled
 * hospital the treatment is billed at government-notified CGHS package rates,
 * and for pensioners / serving employees with a valid referral it is normally
 * cashless (credit) - the hospital bills CGHS directly.
 *
 * COMPLIANCE NOTES (deliberate, please do not "improve" these away):
 *  - Per client instruction this page says "CGHS services available at
 *    Vasavi Hospital" rather than asserting formal empanelment status,
 *    since empanelment status can change / be under renewal.
 *  - No CGHS package rates, no rupee figures, and no reimbursement or
 *    approval promises are stated anywhere on this page. Rates are fixed
 *    and published by the government, not by the hospital, and quoting
 *    them on a hospital page dates instantly and creates a liability.
 *  - No "insurance check" / "free cost estimate" CTAs (those are for the
 *    surgery PPC pages) - CGHS is a government scheme, not an insurer, so
 *    those mechanics are actively misleading here. Every CTA on this page
 *    routes to the CGHS Helpdesk instead.
 *
 * DESIGN (v3 - "logo theme", rebuilt after the v2 document layout was read
 * as too plain / too much like a printed circular).
 *
 * v1 reused the surgery-page design system and read as "the same page again".
 * v2 over-corrected into an institutional document: hairline rules, 4px radii,
 * services as a <table>, no imagery. Correct information design, but it looked
 * like a PDF rather than a page on a modern hospital site.
 *
 * v3 keeps v2's palette discipline and all of its copy, and rebuilds the
 * visual layer around the logo itself:
 *  - Palette sampled from public/Images/logo/vasavi-new-logo.png: #2E3192 indigo
 *    (dominant), #0095DA azure (accent), #58585A grey. The indigo->azure
 *    gradient is the page's signature - it is the logo's own two colours, so
 *    it reads as Vasavi rather than generic blue. Still deliberately NOT the
 *    surgery pages' #0056B3 / #0D1B4B / #FF8C00.
 *  - The banner set in public/Images/cghs/ is now wired up (it was authored for
 *    this page and sat unused through v2). Copy overlays the left ~50% safe
 *    zone on desktop and the top band on tablet/mobile - see the README in
 *    that folder before swapping the artwork.
 *  - Glass "dock" nav instead of v2's sticky contents rail, and instead of
 *    the ENT page's arrow-button carousel.
 *  - Services return to cards, but gradient-iconed and asymmetric on hover -
 *    not the ENT page's flat #FBFBFB hard-shadow boxes.
 *  - Process is a connected gradient timeline; FAQ is a grid-rows accordion;
 *    18-22px radii and diffuse shadows throughout.
 *
 * COPY IS UNCHANGED FROM v2 - every compliance decision above still holds.
 */

interface CghsService {
  icon: string;
  title: string;
  description: string;
  /**
   * Route to the existing specialty page, where one exists.
   * These are the REAL slugs from app.routes.ts (they are not the short
   * '/cardiology' style names the folder structure would suggest) - check
   * app.routes.ts before editing any of them or the card silently 404s.
   */
  link?: string;
}

interface ProcessStep {
  title: string;
  description: string;
}

interface HelpdeskItem {
  icon: string;
  text: string;
}

interface CghsDoctorSpecialty {
  icon: string;
  name: string;
  link?: string;
}

interface FaqItem {
  icon: string;
  question: string;
  answer: string;
  highlight?: boolean;
  highlightTag?: string;
  open: boolean;
}

@Component({
  selector: 'app-cghs',
  standalone: true,
  imports: [CommonModule, RouterModule, CallbackForm],
  templateUrl: './cghs.html',
  styleUrl: './cghs.css',
})
export class Cghs implements OnInit, OnDestroy {
  private readonly isBrowser: boolean;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Hero banner tiers live in public/Images/cghs/ (mobile / tablet / 1024 /
   * desktop, WebP, no baked-in text). Same helper shape as the surgery
   * pages so the two stay swappable.
   */
  private readonly heroAssetBase = 'Images/cghs';

  heroAsset(file: string): string {
    return `${this.heroAssetBase}/${file}`;
  }

  /** Flat sitewide asset, not page-specific. */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /**
   * Sticky dock nav. `id` must match the section id in cghs.html - the
   * scroll-spy below reads them straight off the DOM, so adding a section
   * means adding it here and nowhere else.
   */
  readonly sections: { id: string; name: string }[] = [
    { id: 'about', name: 'What CGHS is' },
    { id: 'services', name: 'Services' },
    { id: 'surgical', name: 'Surgical procedures' },
    { id: 'process', name: 'Using the scheme' },
    { id: 'documents', name: 'What to bring' },
    { id: 'helpdesk', name: 'Helpdesk' },
    { id: 'faq', name: 'Questions' },
  ];

  activeSection = 'about';

  /** Real, verified hospital number - same one used across the site. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about CGHS services at Vasavi Hospitals.');

  /** Shown to the backend/admin as the enquiry source. */
  selectedPageName = 'CGHS Services';

  // ── Popup state ──────────────────────────────────────────
  // Deliberately minimal vs. the surgery pages: booking popup only.
  // No exit-intent and no auto-opening second-opinion popup - this is an
  // information page for an existing government-scheme beneficiary who
  // already knows what they need, not cold PPC traffic to be intercepted.
  isBookingOpen = false;

  // ── Core specialties (from the client's CGHS services document) ──
  services: CghsService[] = [
    {
      icon: 'fa-heart-pulse',
      title: 'Cardiology & Cardiac Care',
      description:
        'Comprehensive cardiac care, including advanced diagnostic and interventional procedures, supported by experienced cardiologists and modern facilities.',
      link: '/cardiology-hospital-in-bangalore',
    },
    {
      icon: 'fa-droplet',
      title: 'Urology Services',
      description:
        'Advanced diagnosis and treatment for a wide range of urological conditions, including minimally invasive and surgical procedures.',
      link: '/urology-hospital-in-bangalore',
    },
    {
      icon: 'fa-bone',
      title: 'Orthopaedics & Joint Replacement',
      description:
        'Specialised care for musculoskeletal conditions, including total knee and hip replacement procedures.',
      link: '/orthopedic-hospital-in-bangalore',
    },
    {
      icon: 'fa-lungs',
      title: 'Pulmonology',
      description:
        'Advanced evaluation and treatment for respiratory and lung-related conditions.',
      link: '/lung-specialist-in-bangalore',
    },
    {
      icon: 'fa-stethoscope',
      title: 'Internal Medicine',
      description:
        'Comprehensive management of acute and chronic medical conditions through personalised, evidence-based care.',
      link: '/internal-medicine-hospital-in-bangalore',
    },
    {
      icon: 'fa-disease',
      title: 'Gastroenterology & GI Surgery',
      description:
        'Specialised diagnosis, treatment, and surgical management of gastrointestinal conditions.',
      link: '/gastroenterology-hospital-in-bangalore',
    },
    {
      icon: 'fa-user-doctor',
      title: 'General Surgery',
      description:
        'A wide range of surgical procedures performed by experienced surgeons with a focus on patient safety and recovery.',
    },
    {
      icon: 'fa-kit-medical',
      title: 'Nephrology & Dialysis',
      description:
        'Comprehensive kidney care and dialysis services supported by modern infrastructure and experienced healthcare professionals.',
      link: '/nephrology-hospital-in-bangalore',
    },
    {
      icon: 'fa-robot',
      title: 'Robotic & Minimally Invasive Surgery',
      description:
        'Advanced surgical techniques designed to support precise procedures, reduced invasiveness, and faster recovery, where clinically appropriate.',
      link: '/minimally-invasive-surgery-in-bangalore',
    },
  ];

  /** Specialised surgical procedures listed in the client document. */
  advancedSurgeries: string[] = [
    'Thoracic Surgery',
    'Esophageal Surgery',
    'Hysterectomy',
    'Hepatic Surgery',
    'Pancreatic Surgery',
    'Cystectomy',
    'Colorectal Surgery',
    'Endometriosis Surgery',
    'Prolapse Surgery',
    'Genitourinary Fistula Surgery',
    'Myomectomy',
    'Other Specialised Surgical Procedures',
  ];

  /**
   * How a beneficiary actually uses the scheme at a hospital.
   *
   * ASSUMPTION (flagged to the client for sign-off): this describes the
   * standard CGHS referral pathway as published by MoHFW - Wellness Centre
   * referral, then treatment at the empanelled hospital. It is written
   * generically and contains no Vasavi-specific procedural promises, so it
   * stays accurate even if internal desk processes change. If the CGHS desk
   * runs a different intake flow, this is the block to edit.
   */
  processSteps: ProcessStep[] = [
    {
      title: 'Get Your Referral',
      description:
        'Visit your CGHS Wellness Centre and obtain a referral / permission letter for the specialist consultation, investigation, or procedure you need.',
    },
    {
      title: 'Contact Our CGHS Helpdesk',
      description:
        'Call or fill in the form on this page. Our helpdesk will confirm service availability, the documents to carry, and help you fix a convenient appointment slot.',
    },
    {
      title: 'Bring Your Documents',
      description:
        'Carry your valid CGHS card, the referral / permission letter, and a government photo ID on the day of your visit. Our desk verifies everything at registration.',
    },
    {
      title: 'Consultation & Treatment',
      description:
        'Meet the specialist, complete any investigations advised, and proceed with the treatment plan. Our team coordinates admission and scheduling where surgery is required.',
    },
    {
      title: 'Discharge & Follow-Up',
      description:
        'Our team completes the CGHS documentation and hands over discharge instructions, medication advice, and your follow-up schedule before you leave.',
    },
  ];

  /** What to carry - generic, document-level guidance only. */
  documents: string[] = [
    'Valid CGHS card (beneficiary or dependant)',
    'Referral / permission letter from your CGHS Wellness Centre',
    'Government-issued photo ID',
    'Previous prescriptions, reports, and discharge summaries, if any',
    'Current medication list',
  ];

  /** Exactly the helpdesk scope stated in the client document. */
  helpdeskItems: HelpdeskItem[] = [
    { icon: 'fa-calendar-check', text: 'CGHS appointment information' },
    { icon: 'fa-list-check', text: 'Treatment and service availability' },
    { icon: 'fa-file-lines', text: 'Required documentation' },
    { icon: 'fa-circle-question', text: 'CGHS-related queries' },
    { icon: 'fa-route', text: 'Guidance regarding hospital procedures' },
  ];

  /** Specialties a beneficiary can be seen in - links to live specialty pages. */
  specialtyLinks: CghsDoctorSpecialty[] = [
    { icon: 'fa-heart-pulse', name: 'Cardiology', link: '/cardiology-hospital-in-bangalore' },
    { icon: 'fa-bone', name: 'Orthopaedics', link: '/orthopedic-hospital-in-bangalore' },
    { icon: 'fa-droplet', name: 'Urology', link: '/urology-hospital-in-bangalore' },
    { icon: 'fa-kit-medical', name: 'Nephrology', link: '/nephrology-hospital-in-bangalore' },
    { icon: 'fa-lungs', name: 'Pulmonology', link: '/lung-specialist-in-bangalore' },
    { icon: 'fa-stethoscope', name: 'Internal Medicine', link: '/internal-medicine-hospital-in-bangalore' },
    { icon: 'fa-disease', name: 'Gastroenterology', link: '/gastroenterology-hospital-in-bangalore' },
    { icon: 'fa-brain', name: 'Neurology', link: '/neurology-hospital-in-bangalore' },
    { icon: 'fa-person-pregnant', name: 'Obstetrics & Gynaecology', link: '/obstetrics-and-gynaecology-hospital-in-bangalore' },
    { icon: 'fa-ribbon', name: 'Oncology', link: '/oncology-hospital-in-bangalore' },
    { icon: 'fa-child', name: 'Paediatrics', link: '/pediatric-hospital-in-bangalore' },
    { icon: 'fa-truck-medical', name: 'Emergency & Critical Care', link: '/emergency-and-critical-care-in-bangalore' },
  ];

  /**
   * FAQs. Answers are scheme-explanatory and deliberately avoid quoting
   * rates, timelines for approval, or reimbursement outcomes - all of which
   * are decided by CGHS, not by the hospital.
   */
  faqs: FaqItem[] = [
    {
      icon: 'fa-circle-info',
      question: 'What is CGHS?',
      answer:
        'CGHS stands for the Central Government Health Scheme, run by the Ministry of Health & Family Welfare, Government of India. It provides comprehensive healthcare to serving central government employees, pensioners, and their eligible dependants. Beneficiaries hold a CGHS card and receive primary care at CGHS Wellness Centres, with referrals to empanelled hospitals for specialist consultations, diagnostics, and surgical treatment.',
      highlight: true,
      highlightTag: 'Start Here',
      open: true,
    },
    {
      icon: 'fa-id-card',
      question: 'Who is eligible to use CGHS services?',
      answer:
        'Eligibility is decided by CGHS, not by the hospital. It generally covers serving central government employees drawing from central civil estimates, central government pensioners and family pensioners, and their eligible dependants, along with certain other categories notified by the government. Your CGHS Wellness Centre is the correct authority to confirm your specific eligibility and card status.',
      open: false,
    },
    {
      icon: 'fa-file-signature',
      question: 'What documents should I bring to the hospital?',
      answer:
        'Please carry your valid CGHS card, the referral or permission letter issued by your CGHS Wellness Centre, and a government photo ID. It also helps to bring previous prescriptions, reports, discharge summaries, and your current medication list so the specialist has your full history. Our CGHS Helpdesk can confirm exactly what is needed for your particular consultation or procedure before you travel.',
      open: false,
    },
    {
      icon: 'fa-arrows-turn-right',
      question: 'Do I need a referral before visiting?',
      answer:
        'For planned specialist consultations, investigations, and procedures, CGHS beneficiaries are normally referred by their CGHS Wellness Centre. Emergencies are handled differently - in an emergency, please come directly to our Emergency Department or call us, and our team will guide you and your family through the documentation afterwards.',
      open: false,
    },
    {
      icon: 'fa-hospital',
      question: 'Which treatments and specialties are available for CGHS beneficiaries?',
      answer:
        'Vasavi Hospital offers CGHS services across cardiology, urology, orthopaedics and joint replacement, pulmonology, internal medicine, gastroenterology and GI surgery, general surgery, nephrology and dialysis, and robotic and minimally invasive surgery, along with a range of specialised surgical procedures. Availability for a specific procedure can be confirmed by our CGHS Helpdesk.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'How is treatment charged under CGHS?',
      answer:
        'Treatment for CGHS beneficiaries at empanelled hospitals is billed as per the package rates notified by the Government of India for the scheme. These rates are set and published by CGHS, not by the hospital. Our helpdesk can explain the billing and documentation process for your specific case and tell you what to expect before you proceed.',
      open: false,
    },
    {
      icon: 'fa-truck-medical',
      question: 'What should I do in an emergency?',
      answer:
        'In a medical emergency, do not wait for paperwork. Come straight to our 24x7 Emergency Department or call ' +
        '08071500500' +
        '. Our emergency team will begin treatment immediately, and our CGHS desk will help your family complete the required documentation afterwards.',
      open: false,
    },
    {
      icon: 'fa-location-dot',
      question: 'Where is Vasavi Hospital located?',
      answer:
        'Vasavi Hospital is located in Kumaraswamy Layout, Bangalore - easily reachable from the nearby Metro station and BMTC bus stand, with parking available on site. Call our CGHS Helpdesk if you need directions or help planning your visit.',
      open: false,
    },
  ];

  // ── Helpers ──────────────────────────────────────────────
  /**
   * Scrolls to a section by id.
   *
   * Offset accounts for the site header plus this page's sticky dock nav,
   * otherwise the heading lands underneath both. Guarded for SSR - the
   * prerender pass has no document.
   */
  scrollToId(id: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    if (!this.isBrowser) {
      return;
    }

    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    const offset = window.innerWidth <= 900 ? 130 : 160;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    this.activeSection = id;
  }

  scrollToHelpdesk(event?: Event): void {
    this.scrollToId('helpdesk', event);
  }

  /**
   * Scroll-spy for the dock nav.
   *
   * Deliberately a scroll listener rather than an IntersectionObserver: the
   * sections here are tall and unequal, so "which heading did I last pass"
   * is the behaviour we want, and an observer with a rootMargin band flips
   * unpredictably between the short sections (documents, emergency).
   * Angular does not bind window listeners during SSR, so no guard needed.
   */
  @HostListener('window:scroll')
  onScroll(): void {
    let current = this.sections[0].id;

    for (const section of this.sections) {
      const el = document.getElementById(section.id);
      // rect.top rather than offsetTop: offsetTop is relative to the nearest
      // positioned ancestor, and the helpdesk section is position:relative.
      if (el && el.getBoundingClientRect().top <= 220) {
        current = section.id;
      }
    }

    if (current !== this.activeSection) {
      this.activeSection = current;
    }
  }

  // ── FAQ accordion ────────────────────────────────────────
  toggleFaq(item: FaqItem): void {
    item.open = !item.open;
  }

  // ── Booking popup ────────────────────────────────────────
  openBooking(source = 'CGHS Services'): void {
    this.selectedPageName = source;
    this.isBookingOpen = true;
  }

  closeBooking(): void {
    this.isBookingOpen = false;
  }

  // ── Lifecycle ────────────────────────────────────────────
  ngOnInit(): void {
    this.titleService.setTitle('CGHS Services in Bangalore | Vasavi Hospital');
    this.metaService.updateTag({
      name: 'description',
      content:
        'CGHS services at Vasavi Hospital, Bangalore - cardiology, orthopaedics, urology, nephrology & advanced surgery for CGHS beneficiaries. Talk to our CGHS Helpdesk.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'CGHS hospital in Bangalore, CGHS services Bangalore, CGHS empanelled hospital Bangalore, CGHS beneficiary treatment, Vasavi Hospital CGHS',
    });
  }

  ngOnDestroy(): void {
    // Nothing to tear down - no timers, observers, or document listeners on
    // this page (unlike the surgery pages, which run exit-intent + video
    // observers). Kept explicit so future additions have an obvious home.
  }
}
