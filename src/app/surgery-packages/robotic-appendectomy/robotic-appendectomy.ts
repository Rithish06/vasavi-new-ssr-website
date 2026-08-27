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

interface AppendectomyDoctor {
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
 * "Appendix Removal Surgery in Bangalore" (Robotic Appendectomy) PPC
 * landing page - rebuilt on the same conversion infrastructure as the
 * Hernia and Gallstone Removal pages (trust bar, compact doctors, cost &
 * insurance quiz, insurance marquee, live reviews/Instagram, exit-intent,
 * sticky bars, 2-step lead form). Same General Surgery content-strategy
 * family:
 *
 * 1. "Recognizing Appendicitis" condition grid carried forward from the
 *    pre-rebuild page's real content (classic presentation / general
 *    symptoms / burst-appendix warning signs), reframed into the same
 *    card format used on Hernia/Gallstone.
 *
 * 2. Interactive tool: same 3-tap COST & INSURANCE ESTIMATOR QUIZ pattern.
 *    Step 1 uses plain, symptom-based language (not clinical terms) - the
 *    same fix applied to the Gallstone page after user feedback that
 *    "Biliary Colic" etc. read as jargon to patients. Ends in the inline
 *    lead form tagged with all three answers.
 *
 * 3. Pricing: the pre-rebuild page's live hero banner displayed a real
 *    price ("₹66,999*" baked into the image). Per explicit user decision
 *    for this page, that price moves off the visible page and lives in
 *    appendectomy.schema.ts only (schema-only, same treatment as Hernia
 *    and Gallstone) - the page leans on the callback/quiz for conversion
 *    instead of an on-page price badge.
 *
 * Doctor data (Dr. Ramesh T S, Dr. Mutharaju K. R - the same two General/
 * Robotic Surgery specialists used on Hernia and Gallstone), insurance
 * partner logos, patient reviews and the NABH logo are the same real,
 * already-published assets used across the other surgery pages.
 *
 * HERO ASSETS (LIVE as of 2026-07-14): a clean 4-tier responsive WebP set
 * (appendectomy-hero-banner-{mobile,tablet,1024,desktop}.webp) now lives in
 * public/Images/packages/Appendectomy/ - no price or headline baked into the
 * pixels, consistent with this page's HTML-overlay hero pattern and the
 * schema-only price policy in point 3 above. The source PNGs
 * (appendectomy-banner-*.png) are kept alongside as originals.
 * The OLD text-on-banner images (appendix-surgery-desktop.png /
 * appendix-surgery.png, with "₹66,999*" baked in) remain deliberately
 * unused, per the same policy applied to Adenoid and Gallstone Removal.
 * The explainer video (appendix-video-2.mp4) already exists sitewide flat
 * at public/Images/packages/ and is wired in below via a literal path.
 */
@Component({
  selector: 'app-robotic-appendectomy',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './robotic-appendectomy.html',
  styleUrl: './robotic-appendectomy.css',
})
export class RoboticAppendectomy implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('appendectomyVideo') appendectomyVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  /** Hero banner set (4-tier responsive WebP, live). NOTE: the folder on disk is
   *  capital-A "Appendectomy" - path case must match for case-sensitive servers. */
  private readonly heroAssetBase = 'Images/packages/Appendectomy';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - matches every other surgery page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Appendix Removal Surgery at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Appendix Removal Surgery';

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
    'Lower Right Abdominal Pain',
    'Fever + Nausea',
    'Sudden Severe Pain',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Appendix Removal Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Appendix Removal Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Interactive COST & INSURANCE ESTIMATOR QUIZ ──
  // Same 3-tap mechanic as Hernia/Gallstone. Step 1 uses plain, symptom-
  // based language rather than clinical terms - see class-level comment.
  quizStep = 1;
  quizConditionType = '';
  quizTechnique = '';
  quizInsurance = '';

  readonly quizConditionOptions: string[] = [
    'Dull Pain Near the Belly Button',
    'Sharp Pain in Lower Right Abdomen',
    'Pain + Fever or Vomiting',
    'Sudden, Severe Pain Everywhere',
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
    return `Appendix Removal - Estimate Quiz: ${this.quizConditionType}, ${this.quizTechnique}, Insurance: ${this.quizInsurance}`;
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
  doctors: AppendectomyDoctor[] = [
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
      cssClass: 'inguinal',
      icon: 'fa-circle-dot',
      badgeText: 'Classic Presentation',
      title: 'Recognizing Appendicitis',
      description: 'Pain usually begins as mild discomfort around the navel and shifts to the lower right side of the abdomen, increasing in intensity with tenderness in the area.',
      location: 'Lower Right Abdomen',
      recoveryTime: 'Same-day surgery once confirmed',
      hospitalStay: '1-2 days',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-list-check',
      badgeText: 'General Signs',
      title: 'Common Symptoms',
      description: 'Loss of appetite, nausea or vomiting, mild fever, diarrhea or constipation, abdominal bloating, and pain during urination can all indicate appendix inflammation.',
      location: 'Abdomen / Digestive',
      recoveryTime: 'Seek evaluation promptly',
      hospitalStay: 'Laparoscopic or Robotic Appendectomy',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-triangle-exclamation',
      badgeText: 'High Risk - Emergency',
      title: 'Warning Signs (Burst Appendix)',
      description: 'A high fever combined with severe, sudden pain spreading throughout the abdomen can signal a ruptured appendix - this needs emergency care immediately.',
      location: 'Whole Abdomen',
      recoveryTime: 'Visit emergency care now',
      hospitalStay: 'Emergency Appendectomy',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-triangle-exclamation',
      question: 'Can I wait a few days before getting appendicitis surgery?',
      answer:
        'No. Appendicitis is a medical emergency, not a condition that improves with waiting. An inflamed appendix can rupture within 48-72 hours of symptoms starting, spilling infection into the abdomen (peritonitis) - a serious, potentially life-threatening complication requiring a much longer, more complex surgery and recovery. If a doctor suspects appendicitis, same-day or next-day surgery is the safe standard of care.',
      awareness: true,
      awarenessTag: 'Important - Please Read',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for appendix surgery in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore offers both robotic (Da Vinci Xi) and laparoscopic appendectomy with 24/7 emergency surgical readiness. With 30+ years of experienced surgeons and a team handling appendicitis cases regularly, it is a trusted choice for appendix removal in South Bangalore.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'What is the cost of appendix removal surgery in Bangalore?',
      answer:
        'The cost of appendectomy varies depending on the surgical technique (robotic vs laparoscopic), whether the case is planned or emergency, and your insurance coverage. At Vasavi Hospitals, we provide a free cost estimation so there are no surprises. Fill in the form above or call us for a transparent quote.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is appendix surgery covered under insurance in Bangalore?',
      answer:
        'Yes. Appendectomy is covered under most health insurance plans and government schemes including Ayushman Bharat, ESI, and corporate group insurance - including emergency admissions. Our dedicated insurance team handles the entire approval process for you, even for urgent cases.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How long does appendix surgery take? What is the recovery time?',
      answer:
        'The procedure itself takes about 45 minutes to 1 hour. With robotic or laparoscopic techniques, most patients are discharged within 1-2 days. Most people return to normal routines within 1-2 weeks, though recovery can take longer if the appendix had already ruptured before surgery.',
      open: false,
    },
    {
      icon: 'fa-robot',
      question: 'Is robotic appendectomy better than laparoscopic?',
      answer:
        'Both are minimally invasive and far superior to open surgery. Robotic surgery offers 3D HD vision, tremor-filtered precision, and enhanced control - useful for complex or already-ruptured cases. Laparoscopic surgery is an equally effective, widely used standard for most appendicitis cases. Your surgeon will recommend the best approach based on your condition and how urgent it is.',
      open: false,
    },
    {
      icon: 'fa-circle-question',
      question: 'How do I know if it’s appendicitis and not just a stomach ache?',
      answer:
        'The classic sign is pain that starts near the navel and moves to the lower right abdomen, worsening over hours rather than easing off. It’s often paired with nausea, fever, or loss of appetite, and tends to hurt more with movement, coughing, or pressing on the area. A stomach ache from indigestion usually doesn’t follow this pattern or progression. If in doubt, an ultrasound or CT scan at Vasavi Hospitals can confirm the diagnosis quickly.',
      open: false,
    },
    {
      icon: 'fa-heart-pulse',
      question: 'Is there any long-term effect of having the appendix removed?',
      answer:
        'No. The appendix has no essential function in adults, and its removal does not affect digestion, immunity, or daily life in any noticeable way. Most patients return to a completely normal diet and routine within a couple of weeks of surgery.',
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
    this.titleService.setTitle('Appendix Removal Surgery in Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Advanced appendix removal with laparoscopic & robotic care at Vasavi Hospitals, Bangalore. Fast healing, minimal pain & cashless insurance options.',
    });

    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    const video = this.appendectomyVideoRef?.nativeElement;
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
    this.selectedPageName = 'Appendix Removal Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: AppendectomyDoctor): void {
    this.selectedPageName = `Appendix Removal Surgery, Doctor: ${doctor.name}`;
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
