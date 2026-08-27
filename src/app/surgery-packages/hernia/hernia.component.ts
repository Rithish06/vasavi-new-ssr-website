import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

import { SecondOpinionPopup } from '../../second-opinion-popup/second-opinion-popup';
import { CallbackForm } from '../../ads-pages/callback-form/callback-form';
import { InsuranceCheckForm } from '../../insurance-check-form/insurance-check-form';

interface HerniaTypeCard {
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

interface HerniaDoctor {
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
 * "Advanced Hernia Surgery in Bangalore" PPC landing page.
 *
 * Rebuilt on the same conversion infrastructure as the ENT surgery pages
 * (trust bar, compact doctors, insurance marquee, live reviews/Instagram,
 * exit-intent, sticky bars, 2-step lead form) - but the content strategy is
 * deliberately NOT a copy-paste of the ENT playbook. Key differences, per
 * product decision:
 *
 * 1. The existing "Types of Hernia We Treat" anatomical grid (Inguinal /
 *    Umbilical / Femoral / Ventral / Incisional / Hiatal / Epigastric) is
 *    kept as-is rather than replaced with an ENT-style "reasons you might
 *    need surgery" list - people search hernia by type, so this taxonomy
 *    is more useful here than it would be for e.g. sinusitis.
 *
 * 2. The interactive tool is a 3-tap COST & INSURANCE ESTIMATOR QUIZ
 *    (hernia type -> technique -> insurance), not a symptom checklist.
 *    Most hernia-page visitors already know they have a bulge - that's
 *    usually why they searched in the first place - so a symptom checker
 *    mostly restated what they already knew. Cost is the recurring real
 *    objection instead, so the tool leans into that directly and ends in
 *    the inline lead form, tagged with all three answers. No price number
 *    is shown (kept schema-only, see point 3) - the payoff is the
 *    personalised callback itself. The urgency/"don't delay" messaging
 *    from the "Can I delay surgery" FAQ still lives on the page via the
 *    "Why Delaying Hernia Surgery Is Risky" section further down.
 *
 * 3. Pricing: a real, approved starting price (₹88,999) already exists in
 *    hernia.schema.ts, but per product decision it stays off the visible
 *    page (schema-only, same treatment as the ENT pages) rather than being
 *    surfaced as an on-page badge.
 *
 * Doctor data, insurance partner logos, patient reviews and the NABH logo
 * are the same real, already-published assets used across the other
 * surgery pages. All hero/doctor/second-opinion assets for this page
 * already exist in public/Images/packages/hernia/ - nothing pending here.
 */
@Component({
  selector: 'app-hernia',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './hernia.component.html',
  styleUrl: './hernia.component.css',
})
export class HerniaComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('herniaVideo') herniaVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  private readonly assetBase = 'Images/packages/hernia';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - the old page had a placeholder
   *  (tel:+918000000000) here, fixed to match every other surgery page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Hernia Surgery (Robotic/Laparoscopic) at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Hernia Surgery';

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
    'Visible Bulge',
    'Groin / Abdominal Pain',
    'Recurrent Hernia',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Hernia Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Hernia Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  get isDuringOpdHours(): boolean {
    const hour = new Date().getHours();
    return hour >= 8 && hour < 20;
  }

  // ── Interactive COST & INSURANCE ESTIMATOR QUIZ ──
  // Replaces an earlier urgency-triage checklist concept: most hernia-page
  // visitors already know they have a bulge (that's usually why they
  // searched in the first place), so a symptom checklist mostly restated
  // what they already knew. Cost is the recurring real objection instead -
  // this leans into that directly. 3 taps (hernia type -> technique ->
  // insurance), each tap advancing a step, ending in the inline lead form
  // tagged with all three answers. No price number is shown on-page (kept
  // schema-only per product decision) - the payoff is the callback itself.
  quizStep = 1;
  quizHerniaType = '';
  quizTechnique = '';
  quizInsurance = '';

  readonly quizTechniqueOptions: string[] = [
    'Robotic Surgery (Da Vinci Xi)',
    'Laparoscopic Surgery',
    'Not Sure - Let the Doctor Recommend',
  ];

  readonly quizInsuranceOptions: string[] = [
    'Yes, I Have Insurance',
    'No / Not Sure',
  ];

  get quizPageName(): string {
    return `Hernia Surgery - Estimate Quiz: ${this.quizHerniaType}, ${this.quizTechnique}, Insurance: ${this.quizInsurance}`;
  }

  selectQuizHerniaType(type: string): void {
    this.quizHerniaType = type;
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
    this.quizHerniaType = '';
    this.quizTechnique = '';
    this.quizInsurance = '';
  }

  // ── Page data ────────────────────────────────────────────
  doctors: HerniaDoctor[] = [
    {
      name: 'Dr. Ramesh T S',
      img: `${this.assetBase}/dr-ramesh-t-s-sq.webp`,
      alt: 'Dr. Ramesh T S - Robotic Surgeon Vasavi Hospitals',
      specialty: 'Robotic & Minimally Invasive Surgery',
      experience: '30+ Years Experience',
      slug: '/dr-ramesh-t-s',
    },
    {
      name: 'Dr. Mutharaju K. R',
      img: `${this.assetBase}/dr-mutharaju-k-r.webp`,
      alt: 'Dr. Mutharaju K R - Robotic Surgeon Vasavi Hospitals',
      specialty: 'Robotic & Minimally Invasive Surgery',
      experience: '23+ Years Experience',
      slug: '/dr-mutharaju-k-r',
    },
    {
      name: 'Dr. Mohan Ram. P',
      img: `${this.assetBase}/dr-mohan-ram- p-sq.webp`,
      alt: 'Dr. Mohan Ram P - General Surgeon Vasavi Hospitals',
      specialty: 'General Surgery',
      experience: '15+ Years Experience',
      slug: '/dr-mohan-ram-p',
    },
  ];

  herniaTypes: HerniaTypeCard[] = [
    {
      cssClass: 'inguinal',
      icon: 'fa-person',
      badgeText: 'Most Common',
      title: 'Inguinal Hernia',
      description: 'Occurs in the groin when tissue pushes through a weak spot in the abdominal wall. Most common in men.',
      location: 'Groin',
      recoveryTime: '1–2 weeks',
      hospitalStay: '1 day',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-circle-dot',
      badgeText: 'Often in Adults',
      title: 'Umbilical Hernia',
      description: 'Develops near the belly button when part of the intestine pushes through the abdominal wall.',
      location: 'Navel',
      recoveryTime: '1 week',
      hospitalStay: '1 day',
    },
    {
      cssClass: 'femoral',
      icon: 'fa-venus',
      badgeText: 'Common in Women',
      title: 'Femoral Hernia',
      description: 'Appears in the upper thigh or outer groin when fatty tissue or intestine bulges through the femoral canal.',
      location: 'Upper Thigh',
      recoveryTime: '1–2 weeks',
      hospitalStay: '1 day',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-shield-virus',
      badgeText: 'Abdominal Wall',
      title: 'Ventral Hernia',
      description: 'Occurs when tissue bulges through a weak area in the abdominal wall, often visible while standing or straining.',
      location: 'Abdomen',
      recoveryTime: '2 weeks',
      hospitalStay: '1–2 days',
    },
    {
      cssClass: 'incisional',
      icon: 'fa-scissors',
      badgeText: 'Post-Surgery Type',
      title: 'Incisional Hernia',
      description: 'Forms at the site of a previous surgical incision due to weakened tissue from healing.',
      location: 'Surgical Scar',
      recoveryTime: '2–3 weeks',
      hospitalStay: '2 days',
    },
    {
      cssClass: 'hiatal',
      icon: 'fa-lungs',
      badgeText: 'Internal Type',
      title: 'Hiatal Hernia',
      description: 'Part of the stomach moves up through the diaphragm into the chest cavity, often linked to acid reflux.',
      location: 'Upper Abdomen',
      recoveryTime: '2–3 weeks',
      hospitalStay: '1–2 days',
    },
    {
      cssClass: 'epigastric',
      icon: 'fa-stethoscope',
      badgeText: 'Upper Abdomen',
      title: 'Epigastric Hernia',
      description: 'Small bulge between the navel and chest caused by fat pushing through the abdominal wall.',
      location: 'Upper Abdomen',
      recoveryTime: '1–2 weeks',
      hospitalStay: '1 day',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-triangle-exclamation',
      question: 'Can I delay hernia surgery by 3 or 6 months?',
      answer:
        'No. Delaying hernia surgery is risky and not advisable. A hernia does not heal on its own - it only grows larger over time. Waiting can lead to strangulation (blood supply to the trapped tissue gets cut off), which is a life-threatening emergency requiring urgent surgery. The longer you wait, the more complex and expensive the repair becomes. If your doctor has diagnosed a hernia, early surgery is always the safer and more affordable option.',
      awareness: true,
      awarenessTag: 'Important - Please Read',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for hernia surgery in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore is a dedicated surgical centre for hernia repair. With 30+ years of experienced surgeons, advanced robotic (Da Vinci Xi) and laparoscopic facilities, and a team that handles hundreds of hernia cases each year, it is one of the most trusted choices for hernia surgery in South Bangalore.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'What is the cost of hernia surgery in Bangalore?',
      answer:
        'The cost of hernia surgery in Bangalore varies depending on the type of hernia, the surgical technique (robotic vs laparoscopic), and your insurance coverage. At Vasavi Hospitals, we provide a free cost estimation before your surgery so there are no surprises. Fill in the form above or call us for a transparent quote.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is hernia surgery covered under insurance in Bangalore?',
      answer:
        'Yes. Hernia surgery is covered under most health insurance plans and government schemes including Ayushman Bharat, ESI, and corporate group insurance. Our dedicated insurance team handles the entire approval process for you - from documentation to claim submission - with zero hassle.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How long does hernia surgery take? What is the recovery time?',
      answer:
        'The procedure itself takes 1–2 hours. With robotic or laparoscopic techniques, most patients are discharged within 1–2 days. You can resume light daily activities in 3–5 days and return to full work within 1–2 weeks. Heavy lifting should be avoided for 4–6 weeks.',
      open: false,
    },
    {
      icon: 'fa-robot',
      question: 'Is robotic hernia surgery better than laparoscopic?',
      answer:
        'Both are minimally invasive and far superior to open surgery. Robotic surgery offers 3D HD vision, tremor-filtered precision, and faster recovery - making it ideal for complex or recurrent hernias. Laparoscopic surgery is an equally effective and proven choice for most standard hernias. Your surgeon will recommend the best approach based on your hernia type and overall health.',
      open: false,
    },
    {
      icon: 'fa-circle-question',
      question: 'How do I know if I need hernia surgery?',
      answer:
        "Common signs include a visible bulge in the abdomen or groin, a dull ache or burning sensation at the site, discomfort while bending or lifting, and a feeling of heaviness. If you notice sudden severe pain, nausea, or the bulge becomes hard and cannot be pushed back - seek emergency care immediately. A consultation and imaging scan at Vasavi Hospitals can confirm the diagnosis in one visit.",
      open: false,
    },
    {
      icon: 'fa-repeat',
      question: 'Can hernia come back after surgery?',
      answer:
        'Recurrence rates with robotic and laparoscopic mesh repair are very low - typically less than 1–2%. Following post-operative instructions, avoiding heavy lifting during recovery, and attending follow-up visits significantly reduce recurrence risk. Our surgical team also provides a long-term care plan to prevent re-herniation.',
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
    this.titleService.setTitle('Advanced Hernia Surgery in Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Treat hernias safely with laparoscopic and robotic hernia surgery at Vasavi Hospitals, Bangalore. Minimal scars, quick recovery & affordable, insurance-covered packages.',
    });

    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    const video = this.herniaVideoRef?.nativeElement;
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
    this.selectedPageName = 'Hernia Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: HerniaDoctor): void {
    this.selectedPageName = `Hernia Surgery, Doctor: ${doctor.name}`;
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
