import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

import { SecondOpinionPopup } from '../../second-opinion-popup/second-opinion-popup';
import { CallbackForm } from '../../ads-pages/callback-form/callback-form';
import { InsuranceCheckForm } from '../../insurance-check-form/insurance-check-form';

interface SinusIndicationCard {
  cssClass: string;
  icon: string;
  badgeText: string;
  title: string;
  description: string;
  location: string;
  recoveryTime: string;
  hospitalStay: string;
}

interface FaqItem {
  icon: string;
  question: string;
  answer: string;
  awareness?: boolean;
  awarenessTag?: string;
  open: boolean;
}

interface EntDoctor {
  name: string;
  img: string;
  alt: string;
  specialty: string;
  experience: string;
  slug: string;
}

interface SymptomCheckItem {
  label: string;
  checked: boolean;
}

interface InsurancePartner {
  name: string;
  logo: string;
}

interface PatientReview {
  name: string;
  text: string;
}

/**
 * "Advanced Sinus Surgery in Bangalore" PPC landing page.
 *
 * Redesigned in place (same class name/selector/file names as before, so
 * app.routes.ts keeps working unchanged) on the same architecture, popup
 * components, and CSS design system as the other surgery PPC pages
 * (Hernia/Tonsillectomy/Adenoid Removal).
 *
 * One deliberate addition on this page: an interactive symptom self-checker
 * (see `symptomChecklist` below) - a quick, honest engagement tool that
 * nudges visitors toward booking without pretending to diagnose them. It's
 * purely client-side (no backend), framed as "worth a consult" rather than
 * a diagnosis, consistent with real chronic-sinusitis screening criteria
 * (2+ major symptoms persisting for weeks).
 *
 * Doctor data is the same real ENT doctors already used on the other ENT
 * pages - not invented. Hero images reuse the real production assets
 * already in public/Images/packages/ (sinus-surgery-banner(-desktop).jpg),
 * converted to .webp for speed. sinus-video.mp4 already existed but was
 * commented out on the old page - wired in properly here with the same
 * lazy-load-on-scroll pattern used elsewhere.
 */
@Component({
  selector: 'app-sinus-surgery',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './sinus-surgery.html',
  styleUrl: './sinus-surgery.css',
})
export class SinusSurgery implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('sinusVideo') sinusVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  private readonly assetBase = 'Images/packages/sinus-surgery';
  /** New responsive hero banner set (mobile/tablet/1024/desktop) now lives
   *  in the same Images/packages/sinus-surgery/ subfolder as everything else. */
  private readonly heroAssetBase = 'Images/packages/sinus-surgery';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific), so it
   *  gets its own path rather than living under heroAssetBase/assetBase. */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - used on every call CTA on this page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Sinus Surgery (Balloon Sinuplasty / FESS) at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Sinus Surgery';

  // ── Popup state ──────────────────────────────────────────
  isBookingOpen = false;
  isSecondOpinionOpen = false;
  isInsuranceOpen = false;
  isExitIntentOpen = false;
  private exitIntentShown = false;
  private handleMouseLeave = (e: MouseEvent): void => {
    // Fires only when the cursor exits the top of the viewport (heading for
    // the tab bar/URL bar) - the classic "about to leave" signal. Desktop
    // only: touch devices don't dispatch mouseleave the same way, and they
    // already get the always-visible sticky bottom bar instead.
    if (e.clientY <= 0 && !this.exitIntentShown && !this.anyPopupOpen()) {
      this.exitIntentShown = true;
      this.isExitIntentOpen = true;
    }
  };

  private soRepeatTimer: ReturnType<typeof setTimeout> | undefined;
  private videoObserver?: IntersectionObserver;

  // ── Insurance partners (Cost & Insurance section) ─────────
  // Real logos, same set already used sitewide in insurance-section.html -
  // not a new claim, just surfaced here where the insurance CTA actually is.
  insurancePartners: InsurancePartner[] = [
    { name: 'Aditya Birla', logo: 'Images/insurance-logo/adithya-birla.webp' },
    { name: 'Bajaj Allianz', logo: 'Images/insurance-logo/Bajaj.webp' },
    { name: 'Chola MS', logo: 'Images/insurance-logo/chola.png' },
    { name: 'Edelweiss', logo: 'Images/insurance-logo/edelweisslife.webp' },
    { name: 'Future Generali', logo: 'Images/insurance-logo/future-generali.png' },
    { name: 'Go Digit', logo: 'Images/insurance-logo/go-digit.svg' },
    { name: 'Liberty', logo: 'Images/insurance-logo/liberty.jpg' },
    { name: 'Star Health', logo: 'Images/insurance-logo/star.svg' },
    { name: 'Reliance', logo: 'Images/insurance-logo/reliance.webp' },
    { name: 'Tata AIG', logo: 'Images/insurance-logo/tata-aig.png' },
  ];

  /** Doubled list for the seamless auto-scrolling marquee (track scrolls
   *  exactly -50%, then jumps back to 0 - since the second half is an
   *  identical copy, the jump is invisible). */
  get insurancePartnersLoop(): InsurancePartner[] {
    return [...this.insurancePartners, ...this.insurancePartners];
  }

  // ── Patient reviews (bottom of page) ──────────────────────
  // Real testimonials, same text already published on the homepage
  // (home.ts) - none happen to mention sinus/ENT specifically since no
  // review like that exists yet, so these are framed as general Vasavi
  // Hospitals trust, not sinus-surgery-specific claims. Not fabricated.
  patientReviews: PatientReview[] = [
    {
      name: 'Arun Kanti Chakraborty',
      text: 'Excellent experience from doctors, nurses, front office staff, admission and insurance desk and ward staff. Experienced doctors who are very confident and efficient in their work and answer all queries satisfactorily and in detail. Overall much better experience than the other big names in the area like Fortis and Apollo hospitals.',
    },
    {
      name: 'Sindhu NPG',
      text: 'Good hospital in and around the location. Service is reachable and doctors also guide us in a proper way, where a common man can understand the medical issue and the staff are very supportive.',
    },
    {
      name: 'Gurudatta Prasad',
      text: 'Nice hospital, we have visited 14 days continuously for an injection for my mother. In the emergency unit all the nurses were helpful and took care of my mother.',
    },
    {
      name: 'Vikrant Vij',
      text: 'Great service by the hospital staff. They have taken care of my mother for about 25 days and helped her recover throughout. Very satisfied overall.',
    },
    {
      name: 'Murali K G',
      text: 'Very Good hospital with human touch. We are really satisfied with the way Dr. Balaraj (Cardiologist) handled our treatment. Thank you so much!',
    },
    {
      name: 'Raghunandan D',
      text: 'The hospital was clean and well-maintained, and the staff were friendly and helpful. Overall, I had a positive experience at Vasavi Hospitals and would recommend it to others.',
    },
  ];

  /** Real, existing profile - same link already used in the site footer/nav. */
  readonly instagramProfileUrl = 'https://www.instagram.com/vasavi_hospitals/';

  // ── 2-step "micro-commitment" lead form (Section 2 only) ──
  // Asking a one-tap question before the phone-number field lifts
  // completion via the foot-in-the-door effect, and tags the lead with the
  // visitor's actual concern for free. Cost & Insurance form and the
  // booking popup stay single-step by design - this treatment is for the
  // very first form a visitor sees.
  leadConcerns: string[] = [
    'Chronic Blocked Nose',
    'Recurring Sinus Infections',
    'Nasal Polyps',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Sinus Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Sinus Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Time-aware CTA badge ───────────────────────────────────
  // ASSUMPTION (flagged to the client): OPD desk hours 8 AM - 8 PM, every
  // day. This only ever ADDS a positive "lines open now" badge during that
  // window - it never claims the hospital is "closed" outside it, since the
  // number may still be answered by reception/emergency. Update the hours
  // below if Vasavi's real OPD timing differs.
  get isDuringOpdHours(): boolean {
    const hour = new Date().getHours();
    return hour >= 8 && hour < 20;
  }

  // ── Interactive symptom self-checker ──────────────────────
  // Purely client-side engagement tool - not a diagnosis. Framed to nudge
  // toward a real consultation, matching real chronic-sinusitis screening
  // criteria (persistent congestion/pressure/discharge + 2 or more major
  // symptoms for several weeks).
  symptomChecklist: SymptomCheckItem[] = [
    { label: 'Blocked or stuffy nose lasting several weeks', checked: false },
    { label: 'Facial pain or pressure around the eyes/forehead', checked: false },
    { label: 'Frequent headaches', checked: false },
    { label: 'Reduced or lost sense of smell', checked: false },
    { label: 'Thick nasal discharge or postnasal drip', checked: false },
    { label: 'Sinus infections 4 or more times a year', checked: false },
    { label: 'Fatigue that doesn’t improve with rest', checked: false },
    { label: 'Trouble sleeping because of a blocked nose', checked: false },
  ];

  get checkedSymptomCount(): number {
    return this.symptomChecklist.filter((s) => s.checked).length;
  }

  resetSymptomChecker(): void {
    this.symptomChecklist.forEach((s) => (s.checked = false));
  }

  // ── Page data ────────────────────────────────────────────
  // Real ENT specialists, reused from the other ENT pages (not invented) -
  // same doctors, webp versions already generated.
  doctors: EntDoctor[] = [
        {
      name: 'Dr. Yashaswi Srikakula',
      img: 'Images/new-doctor-image/dr-yashasvi-sq.webp',
      alt: 'Dr. Yashaswi Srikakula - ENT Consultant, Vasavi Hospitals',
      specialty: 'Consultant - ENT',
      experience: '15+ Years Experience',
      slug: '/dr-yashaswi-srikakula',
    },
    {
      name: 'Dr. Sphoorthy G Itigi',
      img: 'Images/Doctor-Images/ENT/dr-spoorthi.webp',
      alt: 'Dr. Sphoorthy G Itigi - ENT Consultant, Vasavi Hospitals',
      specialty: 'Consultant - ENT',
      experience: '8+ Years Experience',
      slug: '/dr-sphoorthy-g-itigi',
    },
  ];

  indications: SinusIndicationCard[] = [
    {
      cssClass: 'inguinal',
      icon: 'fa-head-side-cough',
      badgeText: 'Most Common Reason',
      title: 'Chronic Sinusitis',
      description: 'Nasal blockage, facial pressure, and thick discharge lasting 12+ weeks, not resolved by medication alone.',
      location: 'Affects: Adults & Teens',
      recoveryTime: 'Recovery: 7–10 days (FESS)',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-wind',
      badgeText: 'Recurring Issue',
      title: 'Recurrent Sinus Infections',
      description: 'Four or more sinus infections a year, each requiring antibiotics - a sign the underlying blockage needs addressing.',
      location: 'Affects: Adults & Teens',
      recoveryTime: 'Recovery: 1–2 days (Balloon)',
      hospitalStay: 'Stay: Day-care',
    },
    {
      cssClass: 'femoral',
      icon: 'fa-lungs',
      badgeText: 'Growth-Related',
      title: 'Nasal Polyps',
      description: 'Soft, painless growths inside the nasal passages that block airflow and reduce sense of smell over time.',
      location: 'Affects: Adults',
      recoveryTime: 'Recovery: 7–10 days (FESS)',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-head-side-mask',
      badgeText: 'Structural Cause',
      title: 'Deviated Septum with Blockage',
      description: 'A crooked nasal septum narrowing one or both nasal passages, often worsening sinus drainage problems.',
      location: 'Affects: Adults',
      recoveryTime: 'Recovery: 1–2 weeks',
      hospitalStay: 'Stay: 1 day',
    },
    {
      cssClass: 'incisional',
      icon: 'fa-triangle-exclamation',
      badgeText: 'Needs Prompt Care',
      title: 'Sinusitis Not Responding to Medication',
      description: 'Symptoms that persist despite a full course of antibiotics, nasal sprays, or steroids - a sign to escalate to a specialist.',
      location: 'Affects: Adults & Teens',
      recoveryTime: 'Recovery: 1–2 weeks',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'hiatal',
      icon: 'fa-bed',
      badgeText: 'Quality of Life',
      title: 'Sleep & Fatigue Disruption',
      description: 'Studies show most chronic sinusitis patients struggle with sleep - persistent tiredness and brain fog that don’t improve with rest are common, treatable signs.',
      location: 'Affects: Adults',
      recoveryTime: 'Recovery: Varies by technique',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-triangle-exclamation',
      question: 'Can I just keep managing my sinus symptoms with medication?',
      answer:
        'For occasional sinus issues, yes - medication is often enough. But if you are getting 4+ infections a year, or symptoms persist beyond 12 weeks despite antibiotics and nasal sprays, medication alone is unlikely to fix the underlying blockage. Chronic, untreated sinusitis can also lead to worsening polyps or spread of infection. A specialist evaluation can tell you clearly whether surgery is actually needed - many patients are surprised at how much relief a single procedure can bring after years of managing symptoms.',
      awareness: true,
      awarenessTag: 'Common Question',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for sinus surgery in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore has a dedicated ENT team led by 25+ year experienced specialists, offering both Balloon Sinuplasty and Functional Endoscopic Sinus Surgery (FESS) depending on what your case needs.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'What is the cost of sinus surgery in Bangalore?',
      answer:
        'Cost depends on the technique (Balloon Sinuplasty vs. FESS), the extent of the blockage, and whether nasal polyps or a deviated septum need correcting at the same time. We provide a free, personalised cost estimate before surgery so there are no surprises - fill in the form above or call us for a transparent quote.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is sinus surgery covered under insurance?',
      answer:
        'Yes. Sinus surgery is covered under most health insurance plans when medically indicated (chronic sinusitis unresponsive to medication, nasal polyps, or recurrent infections). Our insurance team handles the entire approval process for you - documentation, pre-authorisation, and claim submission.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'What is the difference between Balloon Sinuplasty and FESS?',
      answer:
        'Balloon Sinuplasty gently widens blocked sinus passages using a small catheter and balloon - minimally invasive, minimal tissue trauma, and typically just a 1–2 day recovery. It suits less severe, uncomplicated cases. FESS (Functional Endoscopic Sinus Surgery) removes diseased tissue or polyps for more thorough relief in complex or recurrent cases, with a longer 7–10 day recovery. Your surgeon will recommend the right option after evaluating your scans.',
      open: false,
    },
    {
      icon: 'fa-bed',
      question: 'Can chronic sinus problems really affect my sleep and energy levels?',
      answer:
        'Yes - this is one of the most under-recognised effects of chronic sinusitis. The majority of chronic sinusitis patients report disrupted sleep, and ongoing inflammation combined with poor sleep commonly causes persistent fatigue and brain fog that doesn’t improve with rest. Treating the underlying blockage often improves energy and sleep quality alongside the nasal symptoms.',
      open: false,
    },
    {
      icon: 'fa-circle-question',
      question: 'How do I know if I need sinus surgery?',
      answer:
        'Common signs include a blocked nose lasting weeks, facial pain or pressure, frequent headaches, reduced sense of smell, thick discharge, and infections that keep coming back despite treatment. Use the quick symptom check above, then book a consultation for a proper evaluation with imaging if needed.',
      open: false,
    },
    {
      icon: 'fa-repeat',
      question: 'Can sinus problems come back after surgery?',
      answer:
        'Recurrence is uncommon with a thorough procedure and proper post-op care (saline rinses, follow-up visits), though allergies or nasal polyps can occasionally cause symptoms to return over time. Your surgeon will discuss a long-term management plan specific to your case.',
      open: false,
    },
  ];

  // ── Asset path helpers (used in the template) ─────────────
  asset(file: string): string {
    return `${this.assetBase}/${file}`;
  }

  /** Hero images live at Images/packages/ directly (existing production assets), not a dedicated subfolder. */
  heroAsset(file: string): string {
    return `${this.heroAssetBase}/${file}`;
  }

  /** Smooth-scrolls to an in-page section (trust-bar Google/Instagram links),
   *  using the section's @ViewChild ref rather than document.getElementById.
   *  Handled in code rather than relying on the bare `href="#id"` jump,
   *  since that can be unreliable inside an Angular Router app. `href`
   *  is kept on the tag as a plain fallback/for accessibility.
   *
   *  NOTE: not called directly from the template with the ElementRef -
   *  the `#patientReviewsSection` / `#instagramSection` template reference
   *  variables in the HTML shadow the class properties of the same name
   *  (resolving to the raw HTMLElement, not ElementRef), so the two
   *  no-arg wrappers below are what the template actually binds to. */
  scrollToSection(target: ElementRef<HTMLElement> | undefined, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    target?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  scrollToPatientReviews(event?: Event): void {
    this.scrollToSection(this.patientReviewsSection, event);
  }

  scrollToInstagram(event?: Event): void {
    this.scrollToSection(this.instagramSection, event);
  }

  // ── Lifecycle ──────────────────────────────────────────────
  ngOnInit(): void {
    this.titleService.setTitle('Advanced Sinus Surgery in Bangalore | Vasavi Hospitals ENT');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Relieve chronic sinusitis with Balloon Sinuplasty or FESS at Vasavi Hospitals, Bangalore. Minimally invasive, faster healing & insurance-covered packages.',
    });

    // Auto-trigger the second opinion popup 15s after the page loads - long
    // enough that cold PPC ad-click traffic has actually seen the headline
    // first, rather than being interrupted before the page has registered.
    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    // The "What is Sinus Surgery" video sits below the fold, so it's marked
    // preload="none" in the template - nothing downloads until the visitor
    // actually scrolls near it. An IntersectionObserver starts playback
    // (and therefore the download) only once the video enters the viewport.
    const video = this.sinusVideoRef?.nativeElement;
    if (video && 'IntersectionObserver' in window) {
      this.videoObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              video.muted = true;
              video.play().catch(() => {
                // Autoplay was blocked (rare for muted video) - poster image still shows.
              });
            } else {
              video.pause();
            }
          }
        },
        { threshold: 0.25 },
      );
      this.videoObserver.observe(video);
    } else if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }

    // Exit-intent: desktop only (matches the sticky bottom bar being
    // mobile-only - the two are complementary, not overlapping).
    if (window.innerWidth > 768) {
      document.addEventListener('mouseleave', this.handleMouseLeave);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.soRepeatTimer);
    this.videoObserver?.disconnect();
    document.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  // ── FAQ accordion ────────────────────────────────────────
  toggleFaq(item: FaqItem): void {
    item.open = !item.open;
  }

  // ── Popup orchestration ──────────────────────────────────
  private anyPopupOpen(): boolean {
    return this.isBookingOpen || this.isSecondOpinionOpen || this.isInsuranceOpen || this.isExitIntentOpen;
  }

  closeExitIntent(): void {
    this.isExitIntentOpen = false;
  }

  openBooking(): void {
    this.selectedPageName = 'Sinus Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: EntDoctor): void {
    this.selectedPageName = `Sinus Surgery, Doctor: ${doctor.name}`;
    this.isBookingOpen = true;
  }

  /** Booking triggered from the symptom checker result panel - tags the enquiry so the team knows the source. */
  openBookingFromSymptomChecker(): void {
    this.selectedPageName = `Sinus Surgery, Symptom Check: ${this.checkedSymptomCount} symptoms selected`;
    this.isBookingOpen = true;
  }

  closeBooking(): void {
    this.isBookingOpen = false;
  }

  // Insurance check opens its own dedicated form (provider, policy/member ID,
  // employer group, TPA) instead of the generic name+mobile CallbackForm.
  openInsuranceCheck(): void {
    this.isInsuranceOpen = true;
  }

  closeInsuranceCheck(): void {
    this.isInsuranceOpen = false;
  }

  /** InsuranceCheckForm now sends the lead itself (real OTP + email) and
   *  emits this once that succeeds - just make sure the popup is closed. */
  onInsuranceSubmit(): void {
    this.isInsuranceOpen = false;
  }

  openSecondOpinion(): void {
    if (this.anyPopupOpen()) {
      this.scheduleSecondOpinionRepeat();
      return;
    }
    this.isSecondOpinionOpen = true;
  }

  closeSecondOpinion(): void {
    this.isSecondOpinionOpen = false;
    this.scheduleSecondOpinionRepeat();
  }

  onSecondOpinionBook(): void {
    this.isSecondOpinionOpen = false;
    clearTimeout(this.soRepeatTimer);
    this.openBooking();
  }

  private scheduleSecondOpinionRepeat(): void {
    clearTimeout(this.soRepeatTimer);
    this.soRepeatTimer = setTimeout(() => {
      if (!this.anyPopupOpen()) this.openSecondOpinion();
      else this.scheduleSecondOpinionRepeat();
    }, 40000);
  }
}
