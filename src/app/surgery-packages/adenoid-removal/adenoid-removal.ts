import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

import { SecondOpinionPopup } from '../../second-opinion-popup/second-opinion-popup';
import { CallbackForm } from '../../ads-pages/callback-form/callback-form';
import { InsuranceCheckForm } from '../../insurance-check-form/insurance-check-form';

interface AdenoidIndicationCard {
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
 * "Advanced Adenoid Removal Surgery in Bangalore" PPC landing page.
 *
 * Rebuilt on the same architecture as the Sinus Surgery / Tonsillectomy
 * pages - same design system, popup components, and conversion mechanics.
 * See sinus-surgery.ts for the fuller rationale behind each mechanic.
 *
 * Doctor data, insurance partner logos, patient reviews and the NABH logo
 * are the same real, already-published assets used on the other ENT
 * surgery pages - not invented, and not procedure-specific (same hospital,
 * same ENT team, same Google/Instagram account).
 *
 * Hero banner set (mobile/tablet/1024/desktop, 4-tier responsive, WebP,
 * clean/no baked-in text or price) is live in
 * public/Images/packages/adenoid-removal/ - see heroAsset() calls in the
 * template for exact filenames. An extra mobile-360 tier was also
 * converted and is available in that folder but not currently wired into
 * a breakpoint.
 *
 * adenoid-video.mp4 already exists sitewide at public/Images/packages/ (flat,
 * not under the adenoid-removal/ subfolder like the old asset() helper
 * assumed - that was actually a broken path on the old page) and is wired
 * in below via a literal path.
 */
@Component({
  selector: 'app-adenoid-removal',
  standalone: true,
  imports: [CommonModule, FormsModule, SecondOpinionPopup, CallbackForm, InsuranceCheckForm],
  templateUrl: './adenoid-removal.html',
  styleUrl: './adenoid-removal.css',
})
export class AdenoidRemoval implements OnInit, AfterViewInit, OnDestroy {
  constructor(private titleService: Title, private metaService: Meta, private router: Router) {}

  @ViewChild('adenoidVideo') adenoidVideoRef?: ElementRef<HTMLVideoElement>;

  // Trust-bar "Google Reviews" / "Follow Us" links scroll to these two
  // sections further down the page.
  @ViewChild('patientReviewsSection') patientReviewsSection?: ElementRef<HTMLElement>;
  @ViewChild('instagramSection') instagramSection?: ElementRef<HTMLElement>;

  /** Hero banner set lives here (see class-level comment above). */
  private readonly heroAssetBase = 'Images/packages/adenoid-removal';
  private readonly assetBase = 'Images/packages/adenoid-removal';
  /** The NABH logo is a flat, sitewide asset (not surgery-specific). */
  readonly nabhLogoPath = 'Images/packages/NABH-logo.webp';

  /** Real, verified hospital number - used on every call CTA on this page. */
  readonly phoneNumber = '08071500500';
  readonly phoneHref = 'tel:08071500500';

  /** Click-to-chat WhatsApp - zero-friction alternative for mobile users who
   *  hesitate to call. Pre-filled message keeps the conversation on-topic. */
  readonly whatsappHref =
    'https://wa.me/918844466000?text=' +
    encodeURIComponent('Hi, I would like to know more about Adenoid Removal Surgery (Adenoidectomy) at Vasavi Hospitals.');

  /** Passed into <app-callback-form [pageName]>, shown to the backend/admin as the enquiry source. */
  selectedPageName = 'Adenoid Removal Surgery';

  // ── Popup state ──────────────────────────────────────────
  isBookingOpen = false;
  isSecondOpinionOpen = false;
  isInsuranceOpen = false;
  isExitIntentOpen = false;
  private exitIntentShown = false;
  private handleMouseLeave = (e: MouseEvent): void => {
    // Fires only when the cursor exits the top of the viewport - desktop
    // only (touch devices already get the always-visible sticky bottom bar).
    if (e.clientY <= 0 && !this.exitIntentShown && !this.anyPopupOpen()) {
      this.exitIntentShown = true;
      this.isExitIntentOpen = true;
    }
  };

  private soRepeatTimer: ReturnType<typeof setTimeout> | undefined;
  private videoObserver?: IntersectionObserver;

  // ── Insurance partners (Cost & Insurance section) ─────────
  // Real logos, same set already used sitewide in insurance-section.html.
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
    'Snoring / Sleep Apnea',
    'Mouth Breathing',
    'Recurrent Ear Infections',
    'Just Exploring Options',
  ];
  leadConcern = '';
  showLeadForm = false;
  leadFormPageName = 'Adenoid Removal Surgery';

  selectLeadConcern(concern: string): void {
    this.leadConcern = concern;
    this.leadFormPageName = `Adenoid Removal Surgery - Concern: ${concern}`;
    this.showLeadForm = true;
  }

  changeLeadConcern(): void {
    this.showLeadForm = false;
  }

  // ── Time-aware CTA badge ───────────────────────────────────
  // ASSUMPTION (flagged to the client): OPD desk hours 8 AM - 8 PM, same as
  // the other surgery pages. Currently unused in the template (commented
  // out there too) - left wired here in case it's turned back on.
  get isDuringOpdHours(): boolean {
    const hour = new Date().getHours();
    return hour >= 8 && hour < 20;
  }

  // ── Interactive symptom self-checker ──────────────────────
  // Purely client-side engagement tool - not a diagnosis. Parent-facing,
  // since adenoid issues are almost always in children. Framed to nudge
  // toward a real consultation.
  symptomChecklist: SymptomCheckItem[] = [
    { label: 'Loud snoring most nights', checked: false },
    { label: 'Breathing through the mouth during the day', checked: false },
    { label: 'Pauses in breathing or gasping during sleep', checked: false },
    { label: 'Frequent ear infections or hearing difficulty', checked: false },
    { label: 'Nasal-sounding or persistently blocked voice', checked: false },
    { label: 'Frequent sinus infections or nasal discharge', checked: false },
    { label: 'Poor appetite or slow weight gain', checked: false },
    { label: 'Trouble concentrating in school or daytime tiredness', checked: false },
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

  indications: AdenoidIndicationCard[] = [
    {
      cssClass: 'inguinal',
      icon: 'fa-bed',
      badgeText: 'Most Common Reason',
      title: 'Snoring & Sleep Apnea',
      description: 'Enlarged adenoids blocking the airway behind the nose, causing loud snoring, mouth breathing, or pauses in breathing during sleep.',
      location: 'Affects: Almost Always Children',
      recoveryTime: 'Recovery: 2–3 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'umbilical',
      icon: 'fa-head-side-mask',
      badgeText: 'Common in Children',
      title: 'Chronic Mouth Breathing',
      description: 'Persistent nasal blockage forcing a child to breathe through the mouth, which can affect sleep quality, facial growth, and daytime concentration.',
      location: 'Affects: Children',
      recoveryTime: 'Recovery: 2–3 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'femoral',
      icon: 'fa-ear-deaf',
      badgeText: 'Ear Health',
      title: 'Recurrent Ear Infections',
      description: 'Enlarged adenoids blocking the eustachian tube, leading to repeated middle-ear infections or persistent fluid buildup ("glue ear").',
      location: 'Affects: Young Children',
      recoveryTime: 'Recovery: 2–3 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'ventral',
      icon: 'fa-head-side-cough',
      badgeText: 'Frequent Illness',
      title: 'Chronic Sinus Infections',
      description: 'Adenoids acting as a reservoir for infection, causing repeated sinusitis or nasal discharge that doesn’t clear with medication alone.',
      location: 'Affects: Children & Some Adults',
      recoveryTime: 'Recovery: 2–3 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'incisional',
      icon: 'fa-wind',
      badgeText: 'Breathing Concern',
      title: 'Persistent Nasal Obstruction',
      description: 'A constantly blocked or stuffy nose not caused by a cold or allergy, often accompanied by a nasal-sounding voice.',
      location: 'Affects: Children',
      recoveryTime: 'Recovery: 2–3 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
    {
      cssClass: 'hiatal',
      icon: 'fa-child',
      badgeText: 'Often Combined',
      title: 'Alongside Enlarged Tonsils',
      description: 'Adenoids and tonsils often enlarge together - many children with sleep apnea or recurrent infections need both removed in the same procedure (adenotonsillectomy).',
      location: 'Affects: Children',
      recoveryTime: 'Recovery: 7–10 days',
      hospitalStay: 'Stay: Day-care / 1 day',
    },
  ];

  faqs: FaqItem[] = [
    {
      icon: 'fa-triangle-exclamation',
      question: 'Is adenoid removal safe for young children?',
      answer:
        'Yes. Adenoidectomy is one of the safest and most commonly performed ENT surgeries in children. It’s done entirely through the mouth or nose with no external cuts or visible scars, and takes only about 15–20 minutes under general anaesthesia. At Vasavi Hospitals, our ENT team uses child-friendly anaesthesia protocols and monitors every child closely before, during, and after surgery.',
      awareness: true,
      awarenessTag: 'Common Parent Concern',
      open: true,
    },
    {
      icon: 'fa-location-dot',
      question: 'Which is the best hospital for adenoid removal in Bangalore?',
      answer:
        'Vasavi Hospitals in Kumaraswamy Layout, Bangalore has a dedicated pediatric-friendly ENT team led by 25+ year experienced specialists, equipped to handle both adenoidectomy alone and combined adenotonsillectomy where needed.',
      open: false,
    },
    {
      icon: 'fa-indian-rupee-sign',
      question: 'What is the cost of adenoid removal surgery in Bangalore?',
      answer:
        'Cost depends on whether adenoids are removed alone or combined with tonsil removal (adenotonsillectomy), along with the child’s age and any additional evaluation needed. We provide a free, personalised cost estimate before surgery so there are no surprises - fill in the form above or call us for a transparent quote.',
      open: false,
    },
    {
      icon: 'fa-shield-halved',
      question: 'Is adenoidectomy covered under insurance?',
      answer:
        'Yes. Adenoid removal is covered under most health insurance plans when medically indicated (sleep apnea, recurrent ear or sinus infections, or nasal obstruction). Our insurance team handles the entire approval process for you - documentation, pre-authorisation, and claim submission.',
      open: false,
    },
    {
      icon: 'fa-clock',
      question: 'How is recovery different from tonsillectomy? Is it easier on my child?',
      answer:
        'Yes, noticeably. Because adenoidectomy involves no external incision and no wound in a high-movement area like the throat, recovery is typically faster and less painful than tonsillectomy - most children return to normal activity and diet within 2–3 days, versus 7–10 days for tonsil removal. If both are done together (adenotonsillectomy), recovery follows the longer tonsillectomy timeline.',
      open: false,
    },
    {
      icon: 'fa-circle-question',
      question: 'Does my child need adenoids removed, tonsils removed, or both?',
      answer:
        'It depends on which tissue is causing the symptoms. Some children only have enlarged adenoids (nasal blockage, snoring, ear infections) while others have both adenoids and tonsils enlarged, needing a combined adenotonsillectomy. A throat and nasal examination at Vasavi Hospitals can confirm exactly what your child needs.',
      open: false,
    },
    {
      icon: 'fa-ear-listen',
      question: 'How do I know if my child needs adenoid removal?',
      answer:
        'Common signs include loud snoring, breathing through the mouth most of the time, pauses in breathing during sleep, frequent ear infections or hearing difficulty, and repeated sinus infections. If you notice these signs, a consultation at Vasavi Hospitals can confirm whether surgery is the right option.',
      open: false,
    },
    {
      icon: 'fa-repeat',
      question: 'Can adenoids grow back after surgery?',
      answer:
        'Complete regrowth requiring another surgery is uncommon. A small amount of adenoid tissue can occasionally remain and cause mild symptoms again, but this is rare with a thorough procedure. Your surgeon will discuss this with you based on your child’s specific case.',
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
    this.titleService.setTitle('Advanced Adenoid Removal Surgery in Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Safe, painless adenoidectomy for children at Vasavi Hospitals, Bangalore. No external cuts, quick recovery & insurance-covered packages.',
    });

    // Auto-trigger the second opinion popup 15s after the page loads - long
    // enough that cold PPC ad-click traffic has actually seen the headline
    // first, rather than being interrupted before the page has registered.
    setTimeout(() => this.openSecondOpinion(), 15000);
  }

  ngAfterViewInit(): void {
    // The "What is Adenoidectomy" video sits below the fold, so it's marked
    // preload="none" in the template - nothing downloads until the visitor
    // actually scrolls near it. An IntersectionObserver starts playback
    // (and therefore the download) only once the video enters the viewport.
    const video = this.adenoidVideoRef?.nativeElement;
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
    this.selectedPageName = 'Adenoid Removal Surgery';
    this.isBookingOpen = true;
  }

  openBookingForDoctor(doctor: EntDoctor): void {
    this.selectedPageName = `Adenoid Removal Surgery, Doctor: ${doctor.name}`;
    this.isBookingOpen = true;
  }

  /** Booking triggered from the symptom checker result panel - tags the enquiry so the team knows the source. */
  openBookingFromSymptomChecker(): void {
    this.selectedPageName = `Adenoid Removal Surgery, Symptom Check: ${this.checkedSymptomCount} symptoms selected`;
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
