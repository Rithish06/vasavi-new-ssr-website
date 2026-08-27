import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

import { SecondOpinionPopup } from '../../second-opinion-popup/second-opinion-popup';
import { CallbackForm } from '../../ads-pages/callback-form/callback-form';
import { InsuranceCheckForm } from '../../insurance-check-form/insurance-check-form';

interface TonsillectomyIndicationCard {
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
 * "Advanced Tonsillectomy Surgery in Bangalore" PPC landing page.
 *
 * Rebuilt on the same architecture just shipped on the Sinus Surgery page -
 * same design system, popup components, and conversion mechanics, so every
 * surgery PPC page shares one visual language and one lead-capture pipeline.
 * See sinus-surgery.ts for the fuller rationale behind each mechanic; kept
 * brief here to avoid duplicating the same essay per page.
 *
 * Doctor data, insurance partner logos, patient reviews and the NABH logo
 * are the same real, already-published assets used on the Sinus Surgery
 * page - not invented, and not tonsillectomy-specific (same hospital, same
 * ENT team, same Google/Instagram account), so reusing them here is
 * accurate rather than duplicated content.
 *
 * Hero banner set (mobile/tablet/1024/desktop, 4-tier responsive, WebP) is
 * live in public/Images/packages/tonsillectomy-surgery/ - see the `heroAsset()`
 * calls in the template for exact filenames. An extra mobile-360 tier was
 * also converted and is available in that folder but not currently wired
 * into a breakpoint.
 * A tonsil-video.mp4 already exists sitewide at public/Images/packages/ and is
 * wired in below (not tonsillectomy-surgery/-scoped, so referenced via a
 * literal path rather than heroAsset()).
 */
@Component({
  selector: 'app-tonsillectomy',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './tonsillectomy.html',
  styleUrl: './tonsillectomy.css',
})
export class Tonsillectomy implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('tonsilVideo') tonsilVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  /** Hero banner set lives here (see class-level comment above). */
  private readonly heroAssetBase = 'Images/packages/tonsillectomy-surgery';
  private readonly assetBase = 'Images/packages/tonsillectomy-surgery';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - used on every call CTA on this page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Tonsillectomy Surgery (Coblation) at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Tonsillectomy Surgery';

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

  /** Doubled list for the seamless auto-scrolling marquee. */
  get insurancePartnersLoop(): InsurancePartner[] {
    return [...this.insurancePartners, ...this.insurancePartners];
  }

  /** Real, existing profile - same link already used in the site footer/nav. */
  readonly instagramProfileUrl = 'https://www.instagram.com/vasavi_hospitals/';

  // ── 2-step "micro-commitment" lead form (Section 2 only) ──
  leadConcerns: string[] = [
    'Recurring Sore Throat',
    'Snoring / Sleep Apnea',
    'Tonsil Stones / Bad Breath',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Tonsillectomy Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Tonsillectomy Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Time-aware CTA badge ───────────────────────────────────
  // ASSUMPTION (flagged to the client): OPD desk hours 8 AM - 8 PM, every
  // day, same as the Sinus Surgery page. Currently unused in the template
  // (commented out there too) - left wired here in case it's turned back on.
  get isDuringOpdHours(): boolean {
    const hour = new Date().getHours();
    return hour >= 8 && hour < 20;
  }

  // ── Interactive symptom self-checker ──────────────────────
  // Purely client-side engagement tool - not a diagnosis. Framed to nudge
  // toward a real consultation, matching common tonsillectomy screening
  // criteria (recurrent infections, airway/sleep signs, or 2+ symptoms
  // persisting over time).
  symptomChecklist: SymptomCheckItem[] = [
    { label: 'Sore throat 5 or more times in the past year', checked: false },
    { label: 'Loud snoring or pauses in breathing during sleep', checked: false },
    { label: 'Difficulty swallowing food or liquids comfortably', checked: false },
    { label: 'Recurring tonsil stones or persistent bad breath', checked: false },
    { label: 'Mouth breathing during the day or night', checked: false },
    { label: 'Tonsils look large or touching at the back of the throat', checked: false },
    { label: 'Missed school or work due to throat infections', checked: false },
    { label: 'Recurring high fever along with sore throat', checked: false },
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

  indications: TonsillectomyIndicationCard[] = [
    {
      cssClass: 'inguinal',
      icon: 'fa-triangle-exclamation',
      badgeText: 'Most Common Reason',
      title: 'Recurrent Tonsillitis',
      description: 'Repeated throat infections (7+ episodes in a year, or 5+ per year for 2 years) that keep affecting school, work, or daily life.',
      location: 'Affects: Children & Adults',
      recoveryTime: 'Recovery: 7–10 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-bed',
      badgeText: 'Common in Children',
      title: 'Sleep Apnea & Loud Snoring',
      description: 'Enlarged tonsils blocking the airway during sleep - the most common cause of obstructive sleep apnea in children. Over 80% of children improve after surgery.',
      location: 'Affects: Mostly Children',
      recoveryTime: 'Recovery: 7–10 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'femoral',
      icon: 'fa-head-side-cough',
      badgeText: 'Airway Concern',
      title: 'Severely Enlarged Tonsils',
      description: 'Tonsils large enough to make swallowing or breathing difficult, even without frequent infection.',
      location: 'Affects: Children & Adults',
      recoveryTime: 'Recovery: 7–10 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-kit-medical',
      badgeText: 'Needs Prompt Care',
      title: 'Peritonsillar Abscess',
      description: 'A pus-filled infection near the tonsil causing severe throat pain, fever, and difficulty opening the mouth - can recur if tonsils aren’t removed.',
      location: 'Affects: Mostly Adults',
      recoveryTime: 'Recovery: 1–2 weeks',
      hospitalStay: 'Stay: 1–2 days',
    },
    {
      cssClass: 'incisional',
      icon: 'fa-wind',
      badgeText: 'Often Overlooked',
      title: 'Chronic Bad Breath (Tonsil Stones)',
      description: 'Recurrent tonsil stones or persistent bad breath caused by debris trapped in the tonsil crypts, not resolved by dental care alone.',
      location: 'Affects: Mostly Adults',
      recoveryTime: 'Recovery: 7–10 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'hiatal',
      icon: 'fa-child',
      badgeText: 'Pediatric Focus',
      title: 'Difficulty Swallowing (Kids)',
      description: 'Enlarged tonsils making it hard for a child to eat solid food comfortably, sometimes affecting growth and weight gain.',
      location: 'Affects: Children',
      recoveryTime: 'Recovery: 7–10 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-triangle-exclamation',
      question: 'Is tonsillectomy safe for young children?',
      answer:
        'Yes. Tonsillectomy is one of the most commonly performed surgeries in children and is considered very safe, especially with modern techniques like coblation. At Vasavi Hospitals, our ENT team uses child-friendly anaesthesia protocols and closely monitors every child before, during, and after surgery. Most children go home the same day or after one night of observation.',
      awareness: true,
      awarenessTag: 'Common Parent Concern',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for tonsillectomy in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore has a dedicated ENT team led by 25+ year experienced specialists, using modern coblation technology for a gentler, faster-recovery procedure. We treat both children and adults, with pediatric-friendly care throughout.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'What is the cost of tonsillectomy surgery in Bangalore?',
      answer:
        'Cost depends on the technique used (coblation vs. traditional), the patient’s age, and any additional procedures needed (such as adenoid removal). We provide a free, personalised cost estimate before surgery so there are no surprises - fill in the form above or call us for a transparent quote.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is tonsillectomy covered under insurance?',
      answer:
        'Yes. Tonsillectomy is covered under most health insurance plans when medically indicated (recurrent infections, sleep apnea, or airway obstruction). Our insurance team handles the entire approval process for you - documentation, pre-authorisation, and claim submission.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How painful is recovery, especially for a child?',
      answer:
        'Some throat discomfort is normal, especially while swallowing, and typically peaks around day 5–7 when the healing scabs naturally come off - this is expected, not a complication. With coblation technique, pain is significantly milder than with traditional surgery, and we provide a clear pain-management and soft-diet plan for both children and adults to make recovery as comfortable as possible.',
      open: false,
    },
    {
      icon: 'fa-robot',
      question: 'What is coblation tonsillectomy, and is it better than traditional surgery?',
      answer:
        'Coblation uses a low-temperature plasma field to remove tonsil tissue, rather than heat/cautery. Compared to traditional (cold steel/bipolar) tonsillectomy, it typically means less post-operative pain, a faster return to normal eating (often 3–5 days), and a notably lower bleeding risk (studies show roughly 0.5% with coblation versus around 3% with traditional bipolar technique).',
      open: false,
    },
    {
      icon: 'fa-circle-question',
      question: 'How do I know if my child needs a tonsillectomy?',
      answer:
        'Common signs include frequent throat infections, loud snoring or pauses in breathing during sleep, mouth breathing, difficulty swallowing solid food, or recurrent tonsil abscesses. If you notice these signs, a consultation and throat examination at Vasavi Hospitals can confirm whether surgery is the right option.',
      open: false,
    },
    {
      icon: 'fa-repeat',
      question: 'Can tonsils grow back after surgery?',
      answer:
        'Complete regrowth is rare. With intracapsular/coblation techniques, a small amount of tonsil tissue may sometimes remain, but clinically significant regrowth requiring another surgery is uncommon. Your surgeon will discuss the most appropriate technique for your specific case.',
      open: false,
    },
  ];

  // ── Patient reviews (bottom of page - kept as fallback data, Elfsight
  // widget is the primary live source; see .html) ───────────
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

  // ── Asset path helpers (used in the template) ─────────────
  asset(file: string): string {
    return `${this.assetBase}/${file}`;
  }

  heroAsset(file: string): string {
    return `${this.heroAssetBase}/${file}`;
  }

  /** Smooth-scrolls to an in-page section (trust-bar Google/Instagram links).
   *  See sinus-surgery.ts for why the two no-arg wrappers below exist
   *  (template reference variable / class property name collision). */
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
    this.titleService.setTitle('Advanced Tonsillectomy Surgery in Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Safe, modern coblation tonsillectomy for children & adults at Vasavi Hospitals, Bangalore. Less pain, faster recovery & insurance-covered packages.',
    });

    // Auto-trigger the second opinion popup 15s after the page loads - long
    // enough that cold PPC ad-click traffic has actually seen the headline
    // first, rather than being interrupted before the page has registered.
    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    // The "What is Tonsillectomy" video sits below the fold, so it's marked
    // preload="none" in the template - nothing downloads until the visitor
    // actually scrolls near it. An IntersectionObserver starts playback
    // (and therefore the download) only once the video enters the viewport.
    const video = this.tonsilVideoRef?.nativeElement;
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
    this.selectedPageName = 'Tonsillectomy Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: EntDoctor): void {
    this.selectedPageName = `Tonsillectomy Surgery, Doctor: ${doctor.name}`;
    this.isBookingOpen = true;
  }

  /** Booking triggered from the symptom checker result panel - tags the enquiry so the team knows the source. */
  openBookingFromSymptomChecker(): void {
    this.selectedPageName = `Tonsillectomy Surgery, Symptom Check: ${this.checkedSymptomCount} symptoms selected`;
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
