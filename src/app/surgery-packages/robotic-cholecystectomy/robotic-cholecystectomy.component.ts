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

interface GallstoneDoctor {
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
 * "Gallbladder Stone Removal (Robotic Cholecystectomy) Surgery in Bangalore"
 * PPC landing page - rebuilt on the same conversion infrastructure as the
 * Hernia Surgery page (trust bar, compact doctors, cost & insurance quiz,
 * insurance marquee, live reviews/Instagram, exit-intent, sticky bars,
 * 2-step lead form). Same General Surgery content-strategy family as Hernia:
 *
 * 1. "Gallbladder Conditions We Treat" grid (Biliary Colic / Acute
 *    Cholecystitis / Chronic Cholecystitis / Complicated Gallbladder
 *    Disease) is kept as a clinical taxonomy, carried forward from the
 *    pre-rebuild page's real content rather than replaced.
 *
 * 2. Interactive tool: same 3-tap COST & INSURANCE ESTIMATOR QUIZ pattern
 *    as Hernia (condition -> technique -> insurance), ending in the inline
 *    lead form tagged with all three answers. No price number is shown on
 *    page (kept schema-only, see point 3).
 *
 * 3. Pricing: a real, approved starting price (₹81,999) already exists in
 *    gallstone.schema.ts, kept off the visible page per the same product
 *    decision applied to Hernia.
 *
 * Doctor data (Dr. Ramesh T S, Dr. Mutharaju K. R - the same two General/
 * Robotic Surgery specialists used on the Hernia page), insurance partner
 * logos, patient reviews and the NABH logo are the same real, already-
 * published assets used across the other surgery pages.
 *
 * Hero banner set (mobile/tablet/1024/desktop, 4-tier responsive, WebP,
 * clean/no baked-in text or price) is live in
 * public/Images/packages/gallstone-removal/ - see the `heroAsset()` calls in
 * the template for exact filenames. The old hero images (GallBladderSurgery.png
 * / Gallbladder_mobile.png) had the price ("₹81,999*") and headline baked
 * directly into the image pixels in the old "text-on-banner" style, which
 * conflicted with this page's HTML-overlay hero pattern, so they were not
 * reused.
 * The explainer video (gallbladder-video.mp4) already exists sitewide flat
 * at public/Images/packages/ and is wired in below via a literal path.
 */
@Component({
  selector: 'app-robotic-cholecystectomy',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './robotic-cholecystectomy.component.html',
  styleUrl: './robotic-cholecystectomy.component.css',
})
export class RoboticCholecystectomyComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('gallstoneVideo') gallstoneVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  /** Hero banner set expected here (still pending - see class-level comment above). */
  private readonly heroAssetBase = 'Images/packages/gallstone-removal';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - matches every other surgery page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Gallbladder Stone Removal Surgery at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Gallbladder Stone Removal Surgery';

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
    'Gallstone Pain',
    'Indigestion After Meals',
    'Recurring Attacks',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Gallbladder Stone Removal Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Gallbladder Stone Removal Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Interactive COST & INSURANCE ESTIMATOR QUIZ ──
  // Same 3-tap mechanic as the Hernia page (condition -> technique ->
  // insurance), ending in the inline lead form tagged with all three
  // answers. No price number is shown on-page (kept schema-only per
  // product decision) - the payoff is the callback itself.
  quizStep = 1;
  quizConditionType = '';
  quizTechnique = '';
  quizInsurance = '';

  /** Plain-language options for Step 1 - deliberately NOT the clinical
   *  names used in the "Conditions We Treat" section further down the
   *  page (Biliary Colic / Acute Cholecystitis / etc). Someone filling out
   *  a 30-second quiz is describing symptoms in their own words, not
   *  diagnosing themselves - jargon here would just cause drop-off. */
  readonly quizConditionOptions: string[] = [
    'Occasional Pain After Meals',
    'Sudden Severe Pain + Fever',
    'Frequent Mild Attacks Over Time',
    'Severe Pain, Vomiting or Yellowing of Skin',
  ];

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
    return `Gallbladder Stone Removal - Estimate Quiz: ${this.quizConditionType}, ${this.quizTechnique}, Insurance: ${this.quizInsurance}`;
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
  doctors: GallstoneDoctor[] = [
    {
      name: 'Dr. Ramesh T S',
      img: 'Images/new-doctor-image/dr-ramesh-t-s-sq.png',
      alt: 'Dr. Ramesh T S - Robotic Surgeon Vasavi Hospitals',
      specialty: 'Robotic & Minimally Invasive Surgery',
      experience: '30+ Years Experience',
      slug: '/dr-ramesh-t-s',
    },
    {
      name: 'Dr. Mutharaju K. R',
      img: 'Images/new-doctor-image/dr-mutharaju-k-r-sq.png',
      alt: 'Dr. Mutharaju K R - Robotic Surgeon Vasavi Hospitals',
      specialty: 'Robotic & Minimally Invasive Surgery',
      experience: '23+ Years Experience',
      slug: '/dr-mutharaju-k-r',
    },
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
      cssClass: 'epigastric',
      icon: 'fa-stomach',
      badgeText: 'Intermittent Pain',
      title: 'Biliary Colic',
      description: 'Temporary blockage of bile flow caused by gallstones. Pain occurs in the upper right abdomen or under the ribs, often after fatty meals.',
      location: 'Upper Right Abdomen',
      recoveryTime: 'Mild to moderate pain, nausea, bloating',
      hospitalStay: 'Elective surgery recommended',
    },
    {
      cssClass: 'inguinal',
      icon: 'fa-triangle-exclamation',
      badgeText: 'Severe Inflammation',
      title: 'Acute Cholecystitis',
      description: 'Persistent blockage of the gallbladder duct causing sudden, severe inflammation that can worsen quickly without timely care.',
      location: 'Upper Abdomen',
      recoveryTime: 'Severe pain, fever, vomiting',
      hospitalStay: 'Urgent surgery required',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-repeat',
      badgeText: 'Repeated Inflammation',
      title: 'Chronic Cholecystitis',
      description: 'Recurrent gallbladder attacks over time, leading to thickening or scarring of the gallbladder wall - usually linked to long-term gallstone disease.',
      location: 'Upper Abdomen',
      recoveryTime: 'Frequent mild pain, indigestion',
      hospitalStay: 'Planned surgery for permanent relief',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-notes-medical',
      badgeText: 'Advanced Stage',
      title: 'Complicated Gallbladder Disease',
      description: 'Untreated gallstones can lead to gallbladder gangrene or perforation, bile duct obstruction, jaundice, or pancreatitis.',
      location: 'Gallbladder / Bile Duct',
      recoveryTime: 'Emergency evaluation needed',
      hospitalStay: 'Immediate surgical care',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-triangle-exclamation',
      question: 'Can gallstones be left untreated if they don’t cause pain?',
      answer:
        'Silent gallstones with no symptoms are sometimes monitored, but once they start causing pain, indigestion, or inflammation, they rarely resolve on their own. Delaying treatment after symptoms appear raises the risk of acute cholecystitis, gallbladder rupture, bile duct blockage, or pancreatitis - all of which need emergency surgery. If your doctor has confirmed symptomatic gallstones, planned surgery is safer than waiting for a complication.',
      awareness: true,
      awarenessTag: 'Important - Please Read',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for gallbladder surgery in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore is a dedicated surgical centre offering both robotic (Da Vinci Xi) and laparoscopic gallbladder removal. With 30+ years of experienced surgeons and a team handling hundreds of cholecystectomies each year, it is a trusted choice for gallbladder stone removal in South Bangalore.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'What is the cost of gallbladder stone removal surgery in Bangalore?',
      answer:
        'The cost of gallbladder removal surgery varies depending on the surgical technique (robotic vs laparoscopic), your condition, and insurance coverage. At Vasavi Hospitals, we provide a free cost estimation before your surgery so there are no surprises. Fill in the form above or call us for a transparent quote.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is gallbladder surgery covered under insurance in Bangalore?',
      answer:
        'Yes. Gallbladder removal surgery is covered under most health insurance plans and government schemes including Ayushman Bharat, ESI, and corporate group insurance. Our dedicated insurance team handles the entire approval process for you - from documentation to claim submission - with zero hassle.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How long does gallbladder surgery take? What is the recovery time?',
      answer:
        'The procedure itself takes about 1 hour. With robotic or laparoscopic techniques, most patients are discharged within 1-2 days. You can resume light daily activities in 5-7 days and return to full work within 1-2 weeks.',
      open: false,
    },
    {
      icon: 'fa-robot',
      question: 'Is robotic gallbladder surgery better than laparoscopic?',
      answer:
        'Both are minimally invasive and far superior to open surgery. Robotic surgery offers 3D HD vision, tremor-filtered precision, and enhanced control - making it ideal for complex cases. Laparoscopic surgery is an equally effective and widely trusted choice for most standard gallstone cases. Your surgeon will recommend the best approach based on your condition.',
      open: false,
    },
    {
      icon: 'fa-circle-question',
      question: 'How do I know if I need gallbladder surgery?',
      answer:
        'Common signs include sudden or sharp pain in the upper right abdomen, nausea or vomiting after fatty meals, indigestion or bloating, and fever or discomfort below the ribs. If pain is sudden and severe, or accompanied by high fever or jaundice - seek emergency care immediately. An ultrasound or CT scan at Vasavi Hospitals can confirm the diagnosis in one visit.',
      open: false,
    },
    {
      icon: 'fa-heart-pulse',
      question: 'Can I live a normal life without a gallbladder?',
      answer:
        'Yes. The gallbladder stores bile but is not essential for digestion - the liver continues to produce bile, which flows directly into the intestine. Most patients resume a normal diet and daily routine within a couple of weeks, with only minor initial dietary adjustments (like reducing very fatty meals) recommended by the surgical team.',
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
    this.titleService.setTitle('Gallbladder Stone Removal Surgery in Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Safe laparoscopic & robotic gallbladder surgery for stone removal at Vasavi Hospitals, Bangalore. Quick recovery, minimal scarring & affordable, insurance-covered packages.',
    });

    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    const video = this.gallstoneVideoRef?.nativeElement;
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
    this.selectedPageName = 'Gallbladder Stone Removal Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: GallstoneDoctor): void {
    this.selectedPageName = `Gallbladder Stone Removal Surgery, Doctor: ${doctor.name}`;
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
