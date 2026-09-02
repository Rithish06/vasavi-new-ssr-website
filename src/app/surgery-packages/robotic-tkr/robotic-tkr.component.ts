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

interface TkrDoctor {
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
 * "Total Knee Replacement Surgery in Bangalore" PPC landing page - rebuilt on
 * the same conversion infrastructure as the ACL Reconstruction / Appendectomy
 * / Hernia / Gallstone pages (trust bar, compact doctors, cost & insurance
 * quiz, insurance marquee, live reviews/Instagram, exit-intent, sticky bars,
 * 2-step lead form).
 *
 * 1. "Recognizing When You Need a Knee Replacement" condition grid carried
 *    forward from the pre-rebuild page's real content (severe pain on
 *    walking/stairs, stiffness/swelling at rest, deformity/reduced range of
 *    motion), reframed into the same 3-card format used on ACL.
 *
 * 2. Interactive tool: same 3-tap COST & INSURANCE ESTIMATOR QUIZ pattern.
 *    Step 1 uses plain, symptom-based language, not clinical terms - the
 *    same fix applied across every other surgery page. Step 2 offers the
 *    real Mako Robotic-Assisted vs Conventional choice from the pre-rebuild
 *    page.
 *
 * 3. Pricing: the pre-rebuild page never showed a price on the visible page
 *    (unlike Appendectomy/Gallstone's old banners) - the real, already-live
 *    price (₹99,999) lives only in tkr.schema.ts, unchanged, consistent with
 *    this page staying off a price badge and leaning on the callback/quiz.
 *
 * 4. Like ACL, knee arthritis is a progressive condition rather than an
 *    hours-level emergency - the "risk" section is framed honestly around
 *    what delaying surgery does over months/years (bone loss, deformity,
 *    loss of mobility), not around false urgency.
 *
 * 5. Treatment comparison (Mako Robotic-Assisted vs Conventional TKR) is the
 *    pre-rebuild page's real, detailed content, restructured into the same
 *    "treatment-section" two-card format used on ACL (Arthroscopic vs
 *    Structured Non-Surgical Care).
 *
 * Doctor data (Dr. Venkatesh Rathod R - the same Orthopaedics consultant
 * featured on the pre-rebuild page and in the live TKR_SCHEMA; Dr. Rupendu T
 * and Dr. Srivatsa Subramanya were already commented out there and stay
 * excluded, same as ACL), insurance partner logos, patient reviews and the
 * NABH logo are the same real, already-published assets used across the
 * other surgery pages.
 *
 * Hero banner set (mobile/tablet/1024/desktop, 4-tier responsive, WebP,
 * clean/no baked-in text or price) is live in public/Images/packages/tkr/ -
 * see the `heroAsset()` calls in the template for exact filenames. The old
 * hero images (total-knee-replacement-desktop.png / total-knee-replacement.png)
 * were flat, non-responsive images with no baked-in price, but didn't match
 * this page's HTML-overlay hero pattern, so they were not reused.
 *
 * The explainer video (total-knee-replacement-2025-10-16-07-35-12-utc.mp4)
 * already exists sitewide flat at public/Images/packages/ and is wired in below
 * via a literal path, same pattern as ACL's acl-video.mp4.
 */
@Component({
  selector: 'app-robotic-tkr',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './robotic-tkr.component.html',
  styleUrl: './robotic-tkr.component.css',
})
export class RoboticTkrComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('tkrVideo') tkrVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  /** Hero banner set is live here - see class-level comment above. */
  private readonly heroAssetBase = 'Images/packages/tkr';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - matches every other surgery page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Total Knee Replacement Surgery at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Total Knee Replacement Surgery';

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
    'Knee Pain While Walking or Climbing Stairs',
    'Stiffness or Swelling, Even at Rest',
    'Knee Deformity / Bow-Leggedness',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Total Knee Replacement Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Total Knee Replacement Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Interactive COST & INSURANCE ESTIMATOR QUIZ ──
  // Same 3-tap mechanic as ACL/Appendectomy/Hernia/Gallstone. Step 1 uses
  // plain, symptom-based language rather than clinical terms. Step 2 uses
  // the real Mako Robotic-Assisted vs Conventional choice.
  quizStep = 1;
  quizConditionType = '';
  quizTechnique = '';
  quizInsurance = '';

  readonly quizConditionOptions: string[] = [
    'Constant Pain on Walking or Stairs',
    'Knee Stiff or Swollen Even at Rest',
    'Knee Looks Bent or Deformed',
    'Pain Not Improving With Medication',
  ];

  readonly quizTechniqueOptions: string[] = [
    'Mako Robotic-Assisted Replacement',
    'Conventional Knee Replacement',
    'Not Sure - Let the Doctor Recommend',
  ];

  readonly quizInsuranceOptions: string[] = [
    'Yes, I Have Insurance',
    'No / Not Sure',
  ];

  get quizPageName(): string {
    return `Total Knee Replacement - Estimate Quiz: ${this.quizConditionType}, ${this.quizTechnique}, Insurance: ${this.quizInsurance}`;
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
  doctors: TkrDoctor[] = [
    {
      name: 'Dr. Venkatesh Rathod R',
      img: 'Images/new-doctor-image/dr-venkatesh-rathod-spec.png',
      alt: 'Dr. Venkatesh Rathod R - Orthopedic Surgeon Vasavi Hospitals Bangalore',
      specialty: 'Orthopaedics & Joint Replacement Surgery',
      experience: '16+ Years Experience',
      slug: '/dr-venkatesh-rathod-r',
    },
    // {
    //   name: "Dr. Venkatesh Rathod R",
    //   img: "Images/new-doctor-image/dr-venkatesh-rathod-spec.png",
    //   alt: "Best Orthopedic Surgeon in Bangalore | Dr. Venkatesh Rathod R",
    //   experience: "16+",
    //   specialty: "Consultant - Orthopedics",
    //   // qualification: "MBBS, Dortho, DNB ortho",
    //   slug: "/dr-venkatesh-rathod-r"
    // },
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
      icon: 'fa-person-walking-with-cane',
      badgeText: 'Classic Presentation',
      title: 'Advanced Knee Arthritis',
      description: 'Persistent knee pain on walking, climbing stairs, or even at rest, that has stopped responding to medication or physiotherapy. The most common reason patients are referred for knee replacement.',
      location: 'Knee Joint',
      recoveryTime: 'Get an X-ray evaluation soon',
      hospitalStay: 'Mako Robotic or Conventional TKR',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-list-check',
      badgeText: 'General Signs',
      title: 'Common Symptoms',
      description: 'Stiffness or swelling even at rest, reduced range of motion, difficulty bearing weight, and pain that disturbs sleep or limits everyday activities like squatting or sitting cross-legged.',
      location: 'Knee / Mobility',
      recoveryTime: 'Seek evaluation promptly',
      hospitalStay: 'Clinical exam + X-ray/MRI confirmation',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-triangle-exclamation',
      badgeText: 'Needs Prompt Attention',
      title: 'When It May Be More Urgent',
      description: 'A visibly bent or bowed knee, sudden loss of the ability to walk, or bone-on-bone pain that keeps you up at night can signal advanced joint degeneration that should not wait much longer.',
      location: 'Whole Knee Joint',
      recoveryTime: 'See an orthopaedic surgeon this week',
      hospitalStay: 'Total Knee Replacement Surgery',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-circle-question',
      question: 'Can knee arthritis be managed without surgery?',
      answer:
        'Early-stage knee arthritis is often managed with medication, physiotherapy, weight management and lifestyle changes. But once the cartilage has worn down significantly and pain persists despite these measures - especially pain at rest or at night - conservative treatment stops helping much, and knee replacement becomes the option that reliably restores pain-free mobility. Your orthopaedic surgeon can confirm which stage you are at with an X-ray.',
      awareness: true,
      awarenessTag: 'Important - Please Read',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for knee replacement surgery in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore offers both Mako Robotic-Assisted and Conventional Total Knee Replacement, backed by 40+ years of experienced orthopaedic surgeons and an in-house physiotherapy and rehabilitation unit - the part of TKR recovery most patients underestimate. It is a trusted choice for knee replacement in South Bangalore.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'What is the cost of total knee replacement surgery in Bangalore?',
      answer:
        'The cost of knee replacement varies depending on the implant type, whether it is Mako robotic-assisted or conventional surgery, and your insurance coverage. At Vasavi Hospitals, we provide a free, personalised cost estimation so there are no surprises. Fill in the form above or call us for a transparent quote.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is knee replacement surgery covered under health insurance?',
      answer:
        'Yes. Total Knee Replacement is covered under most health insurance plans and government schemes, including corporate group insurance, when it is medically indicated. Our dedicated insurance team checks your eligibility upfront and handles the entire cashless approval process for you.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How long does knee replacement surgery take? How many days in hospital?',
      answer:
        'The procedure itself typically takes about 1-2 hours under anaesthesia. Most patients walk with support within 24 hours of surgery, and a short 2-3 day hospital stay includes structured physiotherapy and pain management before you go home with a clear rehab plan.',
      open: false,
    },
    {
      icon: 'fa-robot',
      question: 'Is Mako Robotic-Assisted knee replacement better than conventional surgery?',
      answer:
        'Both deliver lasting relief from knee arthritis. The Mako Robotic System uses a 3D CT-based surgical plan and a robotic arm to help the surgeon achieve more precise bone cuts and implant alignment, which can mean less tissue trauma and a smoother early recovery. Conventional knee replacement is a proven, time-tested technique with decades of high success rates. Your surgeon will recommend the best approach for your knee.',
      open: false,
    },
    {
      icon: 'fa-person-walking',
      question: 'When can I walk again - and when can I return to normal activities?',
      answer:
        'Most patients start walking with support within 24 hours of surgery and are discharged in 2-3 days. Return to daily activities like walking, light housework and short outings typically happens over 4-6 weeks, guided by physiotherapy milestones. Full recovery, with improved strength and range of motion, generally continues over 2-3 months.',
      open: false,
    },
    {
      icon: 'fa-hourglass-half',
      question: 'What happens if I delay knee replacement surgery for years?',
      answer:
        'Knee arthritis is not an overnight emergency - but it is progressive. The longer a severely worn joint is left untreated, the more the knee can develop deformity (bowing), muscle weakness, and stiffness, which can make surgery more complex and rehabilitation slower. If pain is limiting your daily life despite medication and physiotherapy, earlier evaluation keeps your options - and your recovery - simpler.',
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
    this.titleService.setTitle('Total Knee Replacement Surgery in Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Mako Robotic-Assisted & Conventional Total Knee Replacement at Vasavi Hospitals, Bangalore. Walk pain-free again with expert orthopaedic care, faster recovery & cashless insurance.',
    });

    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    const video = this.tkrVideoRef?.nativeElement;
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
    this.selectedPageName = 'Total Knee Replacement Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: TkrDoctor): void {
    this.selectedPageName = `Total Knee Replacement Surgery, Doctor: ${doctor.name}`;
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
  // doctorProfileData: any = {
  //   name: 'Dr. Rupendu T',
  //   header: "Orthopedic",
  //   bannerImg: 'Images/senior-doctor/6363 2.png',
  //   img: 'Images/senior-doctor/ortho-dr-rupendu-t.png',
  //   alt: 'Best Orthopedic Surgeon in Bangalore | Dr. Rupendu T',
  //   experience: '45+',
  //   department: 'Sr. Consultant Orthopaedic Surgeon',
  //   qualification: 'MBBS, D.Ortho, MS(Ortho), Fellowship in Joint Replacement Surgery (Australia, Germany)',
  //   slug: "dr-rupendu-t",
  //   boxDetails: [
  //     {
  //       img: "Images/senior-doctor/kneepad.png",
  //       count: "45+ Years",
  //       department: "of Orthopedic Excellence"
  //     },
  //     {
  //       img: "Images/senior-doctor/surgery.png",
  //       count: "5000+",
  //       department: "Surgeries Performed"
  //     },
  //     {
  //       img: "Images/senior-doctor/Vector.png",
  //       count: "15,764+",
  //       department: "Patients Treated Successfully"
  //     },


  //   ]
  // }

  // selectedPageName: string = 'TKR';


  // handleBookAppointment(doctor: any) {
  //   // console.log('Doctor clicked:', doctor);
  //   this.selectedPageName = `TKR, Doctor Name: ${doctor.name}`;
  //   // console.log('Page Name:', this.selectedPageName);
  //   this.openPopup();
  // }
  // }

