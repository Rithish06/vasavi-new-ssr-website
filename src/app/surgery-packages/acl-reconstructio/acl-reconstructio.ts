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

interface AclDoctor {
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
 * "ACL Reconstruction Surgery in Bangalore" PPC landing page - rebuilt on
 * the same conversion infrastructure as the Appendectomy / Hernia /
 * Gallstone pages (trust bar, compact doctors, cost & insurance quiz,
 * insurance marquee, live reviews/Instagram, exit-intent, sticky bars,
 * 2-step lead form). First Orthopaedics page in this content-strategy
 * family:
 *
 * 1. "Recognizing an ACL Tear" condition grid carried forward from the
 *    pre-rebuild page's real content (pop-at-injury presentation / general
 *    symptoms / locked-knee & multi-ligament warning), reframed into the
 *    same card format used on Appendectomy.
 *
 * 2. Interactive tool: same 3-tap COST & INSURANCE ESTIMATOR QUIZ pattern.
 *    Step 1 uses plain, symptom-based language ("Knee gave way during
 *    sports") - not clinical terms, per the fix applied on Gallstone.
 *    Ends in the inline lead form tagged with all three answers.
 *
 * 3. Pricing: the pre-rebuild page's live hero banner displayed a real
 *    price ("₹1,21,999*" baked into the image). Per the same explicit user
 *    decision applied to Appendectomy, that price stays off the visible
 *    page and lives in acl-reconstruction.ts (SEO schema) only - the page
 *    leans on the callback/quiz for conversion instead of a price badge.
 *
 * 4. Unlike appendicitis, an ACL tear is not an hours-level emergency -
 *    the "risk" section is framed honestly around what repeated giving-way
 *    episodes do over weeks/months (meniscus tears, cartilage damage,
 *    early arthritis), not around false urgency.
 *
 * Doctor data (Dr. Venkatesh Rathod R - the same Orthopaedics consultant
 * featured on the pre-rebuild page and in the live ACL_SCHEMA; Dr. Rupendu
 * T and Dr. Srivatsa Subramanya were already commented out there and stay
 * excluded), insurance partner logos, patient reviews and the NABH logo
 * are the same real, already-published assets used across the other
 * surgery pages.
 *
 * Hero banner set (mobile/tablet/1024/desktop, 4-tier responsive, WebP,
 * clean/no baked-in text or price) is live in
 * public/Images/packages/acl-reconstruction/ - see the `heroAsset()` calls in
 * the template for exact filenames. The old hero images
 * (acl-reconstruction-desktop.png / ACL-reconstruction.png) had the price
 * ("₹1,21,999*") and headline baked directly into the image pixels in the
 * old "text-on-banner" style, which conflicted with this page's
 * HTML-overlay hero pattern, so they were not reused.
 * The explainer video (acl-video.mp4) already exists sitewide flat at
 * public/Images/packages/ and is wired in below via a literal path.
 */
@Component({
  selector: 'app-acl-reconstructio',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './acl-reconstructio.html',
  styleUrl: './acl-reconstructio.css',
})
export class ACLReconstructio implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('aclVideo') aclVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  /** Hero banner set is live here - see class-level comment above. */
  private readonly heroAssetBase = 'Images/packages/acl-reconstruction';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - matches every other surgery page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about ACL Reconstruction Surgery at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'ACL Reconstruction Surgery';

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
    'Knee Instability After Injury',
    'Sports Injury / Heard a Pop',
    'Swelling & Pain in the Knee',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'ACL Reconstruction Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `ACL Reconstruction Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Interactive COST & INSURANCE ESTIMATOR QUIZ ──
  // Same 3-tap mechanic as Appendectomy/Hernia/Gallstone. Step 1 uses
  // plain, symptom-based language rather than clinical terms.
  quizStep = 1;
  quizConditionType = '';
  quizTechnique = '';
  quizInsurance = '';

  readonly quizConditionOptions: string[] = [
    'Knee Gave Way During Sports',
    'Heard a "Pop" + Swelling After Injury',
    'Knee Feels Unstable While Walking',
    'Old Injury - Pain Keeps Returning',
  ];

  readonly quizTechniqueOptions: string[] = [
    'Arthroscopic (Keyhole) Reconstruction',
    'Physiotherapy / Non-Surgical First',
    'Not Sure - Let the Doctor Recommend',
  ];

  readonly quizInsuranceOptions: string[] = [
    'Yes, I Have Insurance',
    'No / Not Sure',
  ];

  get quizPageName(): string {
    return `ACL Reconstruction - Estimate Quiz: ${this.quizConditionType}, ${this.quizTechnique}, Insurance: ${this.quizInsurance}`;
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
  doctors: AclDoctor[] = [
    {
      name: 'Dr. Venkatesh Rathod R',
      img: 'Images/new-doctor-image/dr-venkatesh-rathod-spec.png',
      alt: 'Dr. Venkatesh Rathod R - Orthopedic Surgeon Vasavi Hospitals Bangalore',
      specialty: 'Orthopaedics & Sports Injury Surgery',
      experience: '16+ Years Experience',
      slug: '/dr-venkatesh-rathod-r',
    },
    {
      name: 'Dr. Vivek Kumar N Savsani',
      img: 'Images/new-doctor-image/dr-vivek-sq.png',
      alt: 'Best Orthopedic Surgeon in Bangalore | Dr. Vivek Kumar N Savsani',
      experience: '15+ Years Experience',
      specialty: 'Consultant Orthopaedic Surgeon & Joint Replacement Specialist',
      // department: "Consultant - ENT",
      // qualification: "MBBS, MS (Orthopaedics), Fellowship in Joint Replacement",
      slug: '/dr-vivek-kumar-n-savsani',
    },
    {
      name: 'Dr. Sarvajith S S',
      img: 'Images/new-doctor-image/dr-sarvajith-sq.png',
      alt: 'Best Orthopedic Surgeon in Bangalore | Dr. Sarvajith S S',
      experience: '10+ Years Experience',
      specialty: 'Consultant Orthopaedics',
      // department: "Consultant - ENT",
      // qualification: "MBBS | MS (Orthopaedics FRGUHS (Sanjay Gandhi Institute of Trauma) Fellowship in Arthroscopy & Sports Medicine, Fellowship in Advanced Trauma First team doctor Bangaluru FC",
      slug: '/dr-sarvajith-s-s',
    },
  ];

  conditionTypes: ConditionCard[] = [
    {
      cssClass: 'inguinal',
      icon: 'fa-person-running',
      badgeText: 'Classic Presentation',
      title: 'The Pivot Injury',
      description: 'A sudden twist, landing, or direction change during sports - followed by a "pop" sound, pain deep in the knee, and swelling within a few hours. The classic way an ACL tears.',
      location: 'Inside the Knee Joint',
      recoveryTime: 'Get an MRI evaluation soon',
      hospitalStay: 'Arthroscopic ACL Reconstruction',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-list-check',
      badgeText: 'General Signs',
      title: 'Common Symptoms',
      description: 'Knee instability or a "giving way" feeling, swelling and stiffness, difficulty bearing weight, discomfort while pivoting or climbing stairs, and reduced range of motion.',
      location: 'Knee / Movement',
      recoveryTime: 'Seek evaluation promptly',
      hospitalStay: 'Clinical exam + MRI confirmation',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-triangle-exclamation',
      badgeText: 'Needs Prompt Attention',
      title: 'When It May Be More Than the ACL',
      description: 'A knee that locks and will not straighten, severe swelling within an hour, or a knee that buckles on every step can signal meniscus or multi-ligament injury alongside the ACL.',
      location: 'Whole Knee',
      recoveryTime: 'See an orthopaedic surgeon this week',
      hospitalStay: 'Combined arthroscopic repair',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-circle-question',
      question: 'Can an ACL tear heal on its own without surgery?',
      answer:
        'A fully torn ACL does not grow back together on its own - it has a poor blood supply. Some partial tears and low-demand patients do well with structured physiotherapy alone. But if your knee keeps giving way, every episode risks new damage to the meniscus and cartilage, which is why active people and athletes are usually advised reconstruction. An MRI and a proper orthopaedic evaluation will tell you which group you fall into.',
      awareness: true,
      awarenessTag: 'Important - Please Read',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for ACL reconstruction in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore performs arthroscopic (keyhole) ACL reconstruction with an experienced orthopaedic and sports-injury team, advanced arthroscopy equipment, and an in-house physiotherapy and rehabilitation unit - the part of ACL recovery most patients underestimate. It is a trusted choice for knee ligament surgery in South Bangalore.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'What is the cost of ACL reconstruction surgery in Bangalore?',
      answer:
        'The cost of ACL reconstruction varies with the graft type, whether additional injuries (like a meniscus tear) need repair in the same sitting, and your insurance coverage. At Vasavi Hospitals, we provide a free, personalised cost estimation so there are no surprises. Fill in the form above or call us for a transparent quote.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is ACL surgery covered under health insurance?',
      answer:
        'Yes. ACL reconstruction is covered under most health insurance plans when it is medically indicated after an injury, including corporate group insurance and many government schemes. Our dedicated insurance team checks your eligibility upfront and handles the entire cashless approval process for you.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How long does ACL surgery take? How many days in hospital?',
      answer:
        'The arthroscopic procedure itself usually takes about 1-2 hours under spinal or general anaesthesia. Most patients stay in hospital for 1-2 days, and physiotherapy begins almost immediately - gentle knee movement starts before you go home.',
      open: false,
    },
    {
      icon: 'fa-bone',
      question: 'What graft is used to reconstruct the ACL?',
      answer:
        'The torn ligament is replaced with a graft - most commonly your own hamstring or patellar tendon (autograft), and in select cases donor tissue (allograft). Each option has trade-offs in strength, recovery and donor-site comfort. Your surgeon will recommend the right graft based on your age, activity level and sport.',
      open: false,
    },
    {
      icon: 'fa-person-walking',
      question: 'When can I walk again - and when can I return to sports?',
      answer:
        'Most patients walk with support within a few days of surgery and return to desk work in 1-2 weeks. Jogging typically resumes around 3 months. Return to pivoting sports like football, basketball or badminton usually takes 6-9 months, guided by physiotherapy strength milestones rather than the calendar alone.',
      open: false,
    },
    {
      icon: 'fa-hourglass-half',
      question: 'What happens if I delay ACL surgery for months?',
      answer:
        'An ACL tear is not an overnight emergency - but it should not be ignored either. Every "giving way" episode can tear the meniscus or damage cartilage, and long-standing instability is linked to early knee arthritis. If you are active and your knee is unstable, earlier reconstruction protects the rest of the joint and makes rehabilitation easier.',
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
    this.titleService.setTitle('ACL Reconstruction Surgery in Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Arthroscopic ACL reconstruction at Vasavi Hospitals, Bangalore. Restore knee stability with keyhole surgery, expert physiotherapy & cashless insurance options.',
    });

    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    const video = this.aclVideoRef?.nativeElement;
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
    this.selectedPageName = 'ACL Reconstruction Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: AclDoctor): void {
    this.selectedPageName = `ACL Reconstruction Surgery, Doctor: ${doctor.name}`;
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
