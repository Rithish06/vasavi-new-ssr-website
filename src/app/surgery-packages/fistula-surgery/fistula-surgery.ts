import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

import { SecondOpinionPopup } from '../../second-opinion-popup/second-opinion-popup';
import { CallbackForm } from '../../ads-pages/callback-form/callback-form';
import { InsuranceCheckForm } from '../../insurance-check-form/insurance-check-form';

interface ConditionCard {
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

interface FistulaDoctor {
  name: string;
  img: string;
  alt: string;
  specialty: string;
  experience: string;
  slug: string;
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
 * "Fistula (Anal Fistula) Surgery in Bangalore" PPC landing page - built on
 * the same conversion infrastructure as the Piles / TKR / THR / ACL /
 * Appendectomy / Hernia / Gallstone pages (trust bar, compact doctors, cost
 * & insurance quiz, insurance marquee, live reviews/Instagram, exit-intent,
 * sticky bars, 2-step lead form).
 *
 * 1. "Recognizing an Anal Fistula" condition grid frames severity honestly:
 *    simple/low fistula (uncomplicated tract) vs complex/recurrent fistula
 *    vs warning signs (pus discharge with fever/spreading infection),
 *    reframed into the same 3-card format used on Piles/TKR/ACL, with
 *    plain-language symptom descriptions rather than jargon.
 *
 * 2. Interactive tool: same 3-tap COST & INSURANCE ESTIMATOR QUIZ pattern.
 *    Step 1 uses plain, symptom-based language. Step 2 offers Laser/VAAFT
 *    vs Conventional Fistulotomy/Fistulectomy - the same two treatment
 *    names already used in the pre-rebuild page's own <title> tag
 *    ("Fistula Surgery in Bangalore | Fistulectomy & Fistulotomy").
 *
 * 3. Pricing: NO price is shown anywhere on this page or in
 *    fistula.schema.ts. Unlike Piles, the pre-rebuild page didn't even have
 *    leftover boilerplate pricing text - there is simply no confirmed real
 *    fistula price anywhere in the codebase, so (consistent with the Piles
 *    decision) this page omits pricing entirely and relies on the
 *    callback/quiz for conversion instead of a price badge.
 *
 * 4. Anal fistula is framed honestly as a progressive, generally
 *    non-emergency condition - the "risk" section covers what delaying
 *    treatment does over time (chronic discharge/skin irritation, repeat
 *    abscess formation, increasingly complex tract branching that makes
 *    future surgery harder), not false urgency. Pus discharge with fever
 *    is still flagged as needing prompt attention in the condition grid.
 *
 * 5. Treatment comparison (Laser/VAAFT vs Conventional Fistulotomy/
 *    Fistulectomy) is framed the same way as Piles/TKR/THR/ACL's two-card
 *    "treatment-section": Laser/VAAFT = minimally invasive, sphincter-
 *    sparing, faster recovery; Conventional = proven, effective, standard
 *    for straightforward low/simple fistulas.
 *
 * Doctor data: Dr. Mohan Ram. P - the same real General Surgery consultant
 * already used on the pre-rebuild page and on the Piles/Gallstone/
 * Appendectomy pages (15+ years experience). Insurance partner logos,
 * patient reviews and the NABH logo are the same real, already-published
 * assets used across the other surgery pages.
 *
 * Hero banner set (mobile/tablet/1024/desktop, 4-tier responsive, WebP,
 * clean/no baked-in text or price) is live in
 * public/Images/packages/fistula-surgery/ - see the `heroAsset()` calls in the
 * template for exact filenames. The old hero images (fistula-banner-
 * desktop.png / "Fistula - website size.jpg" / "Fistula mobile size.jpg")
 * were flat, non-responsive images that didn't match this page's
 * HTML-overlay hero pattern, so they were not reused.
 *
 * The explainer video (fistula-video.mp4) already exists sitewide flat at
 * public/Images/packages/ and is wired in below via a literal path, same
 * pattern as the other rebuilt surgery pages' own explainer videos.
 */
@Component({
  selector: 'app-fistula-surgery',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './fistula-surgery.html',
  styleUrl: './fistula-surgery.css',
})
export class FistulaSurgery implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('fistulaVideo') fistulaVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  /** Hero banner set is live here - see class-level comment above. */
  private readonly heroAssetBase = 'Images/packages/fistula-surgery';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - matches every other surgery page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Fistula Surgery at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Fistula Surgery';

  // ── Popup state ──────────────────────────────────────────
  isBookingOpen = false;
  isSecondOpinionOpen = false;
  isInsuranceOpen = false;
  isExitIntentOpen = false;
  private exitIntentShown = false;
  private handleMouseLeave = (e: MouseEvent): void => {
    if (e.clientY <= 0 && !this.exitIntentShown && !this.anyPopupOpen()) {
      this.exitIntentShown = true;
      this.isExitIntentOpen = true;
    }
  };

  private soRepeatTimer: ReturnType<typeof setTimeout> | undefined;
  private videoObserver?: IntersectionObserver;

  // ── Insurance partners (Cost & Insurance section) ─────────
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

  get insurancePartnersLoop(): InsurancePartner[] {
    return [...this.insurancePartners, ...this.insurancePartners];
  }

  readonly instagramProfileUrl = 'https://www.instagram.com/vasavi_hospitals/';

  // ── 2-step "micro-commitment" lead form (Section 2 only) ──
  leadConcerns: string[] = [
    'Pus or Discharge Near the Anus',
    'Recurring Pain or Swelling',
    'A Small Opening That Won\'t Heal',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Fistula Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Fistula Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Interactive COST & INSURANCE ESTIMATOR QUIZ ──
  // Same 3-tap mechanic as Piles/TKR/THR/ACL/Appendectomy/Hernia/Gallstone.
  // Step 1 uses plain, symptom-based language rather than clinical terms.
  // Step 2 uses the real Laser/VAAFT vs Conventional choice.
  quizStep = 1;
  quizConditionType = '';
  quizTechnique = '';
  quizInsurance = '';

  readonly quizConditionOptions: string[] = [
    'Pus or Discharge Near the Anus',
    'Recurring Pain or Swelling',
    'A Small Opening That Won\'t Heal',
    'Had a Previous Abscess or Surgery',
  ];

  readonly quizTechniqueOptions: string[] = [
    'Laser / VAAFT Fistula Surgery',
    'Conventional Fistulotomy / Fistulectomy',
    'Not Sure - Let the Doctor Recommend',
  ];

  readonly quizInsuranceOptions: string[] = [
    'Yes, I Have Insurance',
    'No / Not Sure',
  ];

  get quizPageName(): string {
    return `Fistula Surgery - Estimate Quiz: ${this.quizConditionType}, ${this.quizTechnique}, Insurance: ${this.quizInsurance}`;
  }

  selectQuizConditionType(type: string): void {
    this.quizConditionType = type;
    this.quizStep = 2;
  }

  selectQuizTechnique(technique: string): void {
    this.quizTechnique = technique;
    this.quizStep = 3;
  }

  selectQuizInsurance(insurance: string): void {
    this.quizInsurance = insurance;
    this.quizStep = 4;
  }

  /** Jump back to a given step to change an earlier answer, instead of a full reset. */
  editQuizStep(step: number): void {
    this.quizStep = step;
  }

  resetQuiz(): void {
    this.quizStep = 1;
    this.quizConditionType = '';
    this.quizTechnique = '';
    this.quizInsurance = '';
  }

  // ── Page data ────────────────────────────────────────────
  doctors: FistulaDoctor[] = [
    {
      name: 'Dr. Mohan Ram. P',
      img: 'Images/new-doctor-image/dr-mohan-ram- p-sq.png',
      alt: 'Dr. Mohan Ram P - General Surgeon Vasavi Hospitals',
      specialty: 'General Surgery',
      experience: '15+ Years Experience',
      slug: '/dr-mohan-ram-p',
    },
  ];

  conditionTypes: ConditionCard[] = [
    {
      cssClass: 'inguinal',
      icon: 'fa-circle-info',
      badgeText: 'Simple / Low Fistula',
      title: 'Early / Uncomplicated Fistula',
      description: 'A single, short tract close to the surface with occasional discharge or mild irritation near the anus, often following a past abscess. Usually treatable with a straightforward day-care procedure.',
      location: 'Anal Region (Superficial)',
      recoveryTime: 'Consult before it recurs',
      hospitalStay: 'Fistulotomy or Laser Procedure',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-list-check',
      badgeText: 'Complex / Recurrent',
      title: 'Common Symptoms',
      description: 'Persistent pus or blood-stained discharge, recurring pain and swelling near the anus, itching or skin irritation, and a small opening that keeps healing and reopening.',
      location: 'Anal / Perianal Region',
      recoveryTime: 'Seek evaluation promptly',
      hospitalStay: 'Clinical exam + MRI fistulogram',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-triangle-exclamation',
      badgeText: 'Needs Prompt Attention',
      title: 'Warning Signs to Watch For',
      description: 'Fever with worsening anal pain and swelling, spreading redness, or a rapidly enlarging lump can signal an active abscess needing urgent surgical drainage before it can be treated as a fistula.',
      location: 'Anal / Perianal Region',
      recoveryTime: 'See a surgeon this week',
      hospitalStay: 'Urgent Surgical Evaluation',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-circle-question',
      question: 'Can an anal fistula heal on its own without surgery?',
      answer:
        'An established anal fistula almost never closes on its own - the tract is lined with tissue that keeps it open, and medication alone cannot resolve it. Antibiotics may control an associated infection temporarily, but surgery (Laser/VAAFT or conventional fistulotomy/fistulectomy) is generally needed to actually close the tract and prevent recurring abscesses. Your surgeon can confirm the tract\'s complexity with an examination and, if needed, an MRI fistulogram.',
      awareness: true,
      awarenessTag: 'Important - Please Read',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for fistula surgery in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore offers both Laser/VAAFT and Conventional Fistulotomy/Fistulectomy, performed by experienced general surgeons with a dedicated day-care and short-stay recovery setup. It is a trusted choice for fistula treatment in South Bangalore.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is fistula surgery covered under health insurance?',
      answer:
        'Yes. Anal fistula surgery is covered under most health insurance plans and government schemes, including corporate group insurance, when it is medically indicated. Our dedicated insurance team checks your eligibility upfront and handles the entire cashless approval process for you.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How long does fistula surgery take? How many days in hospital?',
      answer:
        'Most fistula procedures take 30-60 minutes depending on the tract\'s complexity. Simple fistulas are often treated as day-care or single overnight-stay procedures, while complex or recurrent fistulas may need a slightly longer stay. Your surgeon will confirm what to expect after examining your specific case.',
      open: false,
    },
    {
      icon: 'fa-bolt',
      question: 'Is Laser/VAAFT treatment better than conventional fistula surgery?',
      answer:
        'Laser and VAAFT (Video-Assisted Anal Fistula Treatment) are minimally invasive, sphincter-sparing techniques that generally cause less pain and allow a faster return to normal activity, especially useful for complex tracts. Conventional Fistulotomy/Fistulectomy remains a proven, effective, time-tested option, particularly for simple, low-lying fistulas. Your surgeon will recommend the best approach based on the tract\'s location and complexity.',
      open: false,
    },
    {
      icon: 'fa-person-walking',
      question: 'When can I return to normal activities after fistula surgery?',
      answer:
        'Most patients resume light daily activities within a few days and desk work within a week to 10 days. Because the surgical wound often heals gradually from the inside out over several weeks, your surgeon will guide you on wound care, sitz baths and dressing changes to support complete healing.',
      open: false,
    },
    {
      icon: 'fa-hourglass-half',
      question: 'What happens if I keep ignoring fistula symptoms?',
      answer:
        'An anal fistula is not usually an overnight emergency - but it is progressive. Ignoring ongoing discharge or discomfort can lead to repeat abscess formation, a more complex, branching tract that is harder to treat, and chronic skin irritation. Getting evaluated while the tract is still simple generally means an easier procedure and smoother recovery.',
      open: false,
    },
    {
      icon: 'fa-rotate',
      question: 'Can a fistula come back after surgery?',
      answer:
        'Recurrence is possible, especially with complex or branching tracts, which is why an accurate pre-surgical assessment (often including an MRI fistulogram) matters. Choosing the right technique for your specific tract - and following your surgeon\'s wound care and follow-up advice closely - significantly reduces the chance of the fistula returning.',
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
  heroAsset(file: string): string {
    return `${this.heroAssetBase}/${file}`;
  }

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
    this.titleService.setTitle('Fistula Surgery in Bangalore | Fistulectomy & Fistulotomy | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Laser/VAAFT & Conventional Fistula Surgery at Vasavi Hospitals, Bangalore. Effective, minimally invasive treatment with quick recovery, low recurrence & cashless insurance.',
    });

    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    const video = this.fistulaVideoRef?.nativeElement;
    if (video && 'IntersectionObserver' in window) {
      this.videoObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              video.muted = true;
              video.play().catch(() => {});
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
    this.selectedPageName = 'Fistula Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: FistulaDoctor): void {
    this.selectedPageName = `Fistula Surgery, Doctor: ${doctor.name}`;
    this.isBookingOpen = true;
  }

  closeBooking(): void {
    this.isBookingOpen = false;
  }

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
