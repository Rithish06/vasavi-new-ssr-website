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

interface PilesDoctor {
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
 * "Piles (Haemorrhoids) Surgery in Bangalore" PPC landing page - built on
 * the same conversion infrastructure as the TKR / THR / ACL / Appendectomy /
 * Hernia / Gallstone pages (trust bar, compact doctors, cost & insurance
 * quiz, insurance marquee, live reviews/Instagram, exit-intent, sticky bars,
 * 2-step lead form).
 *
 * 1. "Recognizing Piles" condition grid uses real clinical staging (Grade
 *    1-2 / Grade 3-4 prolapsed / warning signs of thrombosis or heavy
 *    bleeding), reframed into the same 3-card format used on TKR/ACL, with
 *    plain-language symptom descriptions rather than jargon.
 *
 * 2. Interactive tool: same 3-tap COST & INSURANCE ESTIMATOR QUIZ pattern.
 *    Step 1 uses plain, symptom-based language. Step 2 offers the real
 *    Laser vs Conventional (open) Haemorrhoidectomy choice.
 *
 * 3. Pricing: NO price is shown anywhere on this page or in piles.schema.ts.
 *    The pre-rebuild page's "₹1,80,000*" figure was leftover boilerplate
 *    copy-pasted from the Appendectomy template's commented-out hero (the
 *    surrounding text literally said "appendix surgery packages") - not a
 *    real, confirmed piles price. Per explicit user decision, this page
 *    omits pricing entirely and relies on the callback/quiz for conversion
 *    instead of a price badge.
 *
 * 4. Piles is framed honestly as a progressive, generally non-emergency
 *    condition (unlike appendicitis) - the "risk" section covers what
 *    delaying treatment does over time (chronic bleeding/anaemia, worsening
 *    grade, thrombosis, recurring pain), not false urgency. Grade 4/
 *    thrombosed piles with heavy bleeding is still flagged as needing
 *    prompt attention in the condition grid.
 *
 * 5. Treatment comparison (Laser Haemorrhoidectomy vs Conventional Surgery)
 *    is framed the same way as TKR/THR/ACL's two-card "treatment-section":
 *    Laser = minimally invasive, faster recovery, ideal for most grades;
 *    Conventional (open) = proven, effective for advanced/complex cases.
 *
 * Doctor data: Dr. Mohan Ram. P - the same real General Surgery consultant
 * already used on the pre-rebuild page and on the Gallstone/Appendectomy
 * pages (15+ years experience). Insurance partner logos, patient reviews and
 * the NABH logo are the same real, already-published assets used across the
 * other surgery pages.
 *
 * Hero banner set (mobile/tablet/1024/desktop, 4-tier responsive, WebP,
 * clean/no baked-in text or price) is live in public/Images/packages/piles/ -
 * see the `heroAsset()` calls in the template for exact filenames. The old
 * hero images (piles-banner-desktop.png / piles-banner.png) were flat,
 * non-responsive images that didn't match this page's HTML-overlay hero
 * pattern, so they were not reused.
 *
 * The explainer video (piles-video.mp4) already exists sitewide flat at
 * public/Images/packages/ and is wired in below via a literal path, same
 * pattern as the other rebuilt surgery pages' own explainer videos.
 */
@Component({
  selector: 'app-haemorrhoidectomy',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './haemorrhoidectomy.html',
  styleUrl: './haemorrhoidectomy.css',
})
export class Haemorrhoidectomy implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('pilesVideo') pilesVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  /** Hero banner set is live here - see class-level comment above. */
  private readonly heroAssetBase = 'Images/packages/piles';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - matches every other surgery page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Piles (Haemorrhoids) Treatment at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Piles (Haemorrhoids) Surgery';

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
    'Bleeding During Bowel Movements',
    'Pain or Swelling Near the Anus',
    'A Lump That Comes Out',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Piles (Haemorrhoids) Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Piles (Haemorrhoids) Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Interactive COST & INSURANCE ESTIMATOR QUIZ ──
  // Same 3-tap mechanic as TKR/THR/ACL/Appendectomy/Hernia/Gallstone. Step 1
  // uses plain, symptom-based language rather than clinical terms. Step 2
  // uses the real Laser vs Conventional choice.
  quizStep = 1;
  quizConditionType = '';
  quizTechnique = '';
  quizInsurance = '';

  readonly quizConditionOptions: string[] = [
    'Bleeding During Bowel Movements',
    'Pain, Itching or Irritation',
    'A Lump That Comes Out & Goes Back In',
    'A Lump That Stays Out',
  ];

  readonly quizTechniqueOptions: string[] = [
    'Laser Haemorrhoidectomy',
    'Conventional (Open) Surgery',
    'Not Sure - Let the Doctor Recommend',
  ];

  readonly quizInsuranceOptions: string[] = [
    'Yes, I Have Insurance',
    'No / Not Sure',
  ];

  get quizPageName(): string {
    return `Piles Surgery - Estimate Quiz: ${this.quizConditionType}, ${this.quizTechnique}, Insurance: ${this.quizInsurance}`;
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
  doctors: PilesDoctor[] = [
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
      badgeText: 'Grade 1-2, Early Stage',
      title: 'Early / Mild Piles',
      description: 'Occasional bleeding during bowel movements, mild discomfort or itching, and small internal swellings that do not come out of the anus. Often manageable with lifestyle changes, medication, or minor procedures.',
      location: 'Anal Canal (Internal)',
      recoveryTime: 'Consult before it progresses',
      hospitalStay: 'Medication or Minor Procedure',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-list-check',
      badgeText: 'Grade 3-4, Prolapsed',
      title: 'Advanced / Prolapsed Piles',
      description: 'A lump that comes out during bowel movements and needs to be pushed back in (or stays out permanently), along with persistent pain, bleeding, and discomfort while sitting. This is the stage most patients seek surgery for.',
      location: 'Anal Canal / External',
      recoveryTime: 'Seek evaluation promptly',
      hospitalStay: 'Laser or Conventional Surgery',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-triangle-exclamation',
      badgeText: 'Needs Prompt Attention',
      title: 'Warning Signs to Watch For',
      description: 'Heavy or continuous bleeding, a hard and severely painful swollen lump (possible thrombosed pile), or fever alongside anal pain can signal a complication that needs prompt surgical evaluation.',
      location: 'Anal Region',
      recoveryTime: 'See a surgeon this week',
      hospitalStay: 'Urgent Surgical Evaluation',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-circle-question',
      question: 'Can piles be treated without surgery?',
      answer:
        'Early-stage (Grade 1-2) piles are often managed with dietary changes, medication, sitz baths, and minor office procedures like banding. But once piles reach Grade 3-4 - prolapsing out with bowel movements or staying out permanently - conservative treatment stops giving lasting relief, and surgery (laser or conventional) becomes the option that reliably resolves the problem. Your surgeon can confirm your grade with a simple examination.',
      awareness: true,
      awarenessTag: 'Important - Please Read',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for piles surgery in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore offers both Laser Haemorrhoidectomy and Conventional surgery, performed by experienced general surgeons with a dedicated day-care and short-stay recovery setup. It is a trusted choice for piles treatment in South Bangalore.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is piles surgery covered under health insurance?',
      answer:
        'Yes. Piles (Haemorrhoidectomy) surgery is covered under most health insurance plans and government schemes, including corporate group insurance, when it is medically indicated. Our dedicated insurance team checks your eligibility upfront and handles the entire cashless approval process for you.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How long does piles surgery take? How many days in hospital?',
      answer:
        'Laser Haemorrhoidectomy is typically a day-care procedure - many patients go home the same day or after one night. Conventional (open) surgery may need a slightly longer 1-2 day stay depending on the grade and extent of the procedure. Your surgeon will confirm what to expect for your specific case.',
      open: false,
    },
    {
      icon: 'fa-bolt',
      question: 'Is Laser treatment for piles better than conventional surgery?',
      answer:
        'Laser Haemorrhoidectomy is minimally invasive, generally causes less pain, less bleeding, and allows a faster return to normal activity - making it a popular choice for most grades of piles. Conventional (open) surgery remains a proven, effective option, particularly useful for very advanced or complex cases. Your surgeon will recommend the best approach after examining your condition.',
      open: false,
    },
    {
      icon: 'fa-person-walking',
      question: 'When can I return to normal activities after piles surgery?',
      answer:
        'Most patients resume light daily activities within a few days and desk work within a week to 10 days, with laser patients typically recovering a little faster than conventional surgery patients. Your surgeon will guide you on diet, hygiene and activity precautions during the first couple of weeks to support healing.',
      open: false,
    },
    {
      icon: 'fa-hourglass-half',
      question: 'What happens if I keep ignoring piles symptoms?',
      answer:
        'Piles are not usually an overnight emergency - but they are progressive. Ignoring early symptoms can lead to worsening grade, chronic bleeding that causes anaemia over time, recurring pain, and in some cases a thrombosed (clotted) pile that is suddenly very painful. Getting evaluated early, while the condition is still mild, means simpler treatment and faster recovery.',
      open: false,
    },
    {
      icon: 'fa-utensils',
      question: 'Will piles come back after surgery?',
      answer:
        'Both laser and conventional haemorrhoidectomy have high success rates for resolving the piles that are treated. Recurrence risk is reduced significantly by following your surgeon\'s advice on fibre-rich diet, adequate water intake, and avoiding prolonged straining or sitting - habits that helped cause piles in the first place.',
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
    this.titleService.setTitle('Piles (Haemorrhoids) Surgery in Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Laser & Conventional Piles Surgery at Vasavi Hospitals, Bangalore. Painless, minimally invasive treatment with expert surgical care, faster recovery & cashless insurance.',
    });

    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    const video = this.pilesVideoRef?.nativeElement;
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
    this.selectedPageName = 'Piles (Haemorrhoids) Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: PilesDoctor): void {
    this.selectedPageName = `Piles (Haemorrhoids) Surgery, Doctor: ${doctor.name}`;
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
