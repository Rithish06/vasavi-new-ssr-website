import { Component, DestroyRef, PLATFORM_ID, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DOCTORS, Doctor } from '../../data/doctors.data';
import { DoctorsIcon } from '../doctors/doctors-icon';
import { AppointmentBooking } from '../../components/appointment-booking/appointment-booking';
import { SeoService } from '../../seo/seo.service';
import { HOSPITAL, HOSPITAL_SAME_AS, SCHEMA_ID, SITE_NAME, SITE_URL, absoluteUrl } from '../../seo/seo.config';

/** Published hospital line, same number used in the navbar topbar. */
const HOSPITAL_PHONE_DISPLAY = '1800 412 4779';
const HOSPITAL_PHONE_TEL = '+18004124779';

/** DOM ids of the JSON-LD blocks this page owns - see SeoService.setJsonLd. */
const JSONLD_ID = {
  graph: 'ld-doctor-profile',
  faq: 'ld-doctor-faq',
} as const;

@Component({
  selector: 'app-doctor-detail-page',
  standalone: true,
  imports: [RouterLink, DoctorsIcon, AppointmentBooking],
  templateUrl: './doctor-detail.html',
  styleUrl: './doctor-detail.css',
})
export class DoctorDetailPage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly hospitalPhoneDisplay = HOSPITAL_PHONE_DISPLAY;
  protected readonly hospitalPhoneTel = HOSPITAL_PHONE_TEL;

  private readonly paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly doctor = computed(() => {
    const slug = this.paramMap().get('doctorSlug') ?? '';
    return DOCTORS.find((d) => d.slug === '/' + slug) ?? null;
  });

  /**
   * The profile-page hero photo. Real per-doctor headshots live in
   * `imgDetail` (public/Images/new-doctor-image/new-doc-images) and are
   * used here whenever a doctor has one; doctors without a supplied
   * `imgDetail` yet fall back to the same placeholder graphic every doctor
   * used before real photos existed. The listing page is untouched either
   * way - it always uses each doctor's own `img`, never `imgDetail`.
   */
  protected readonly heroImg = computed(
    () => this.doctor()?.imgDetail || '/Images/new-doctor-image/new-doc-images/dr-male-vector.png',
  );

  /**
   * Every doctor's profile page keeps using the same full-bleed hero
   * treatment (see `.doctor-hero__photo-wrap--full` in doctor-detail.css) -
   * design/layout is unchanged, only which image `heroImg()` resolves to
   * above has changed.
   */
  protected readonly hasFramedPhoto = computed(() => true);

  /**
   * "Brief Profile" section, below the hero. Prefers the multi-paragraph
   * SEO-written `briefProfileParagraphs` and falls back to the original
   * single-paragraph `briefProfile`, so doctors who haven't been rewritten
   * yet render exactly as before. Empty makes the whole section disappear.
   */
  protected readonly profileBio = computed(() => {
    const doc = this.doctor();
    if (doc?.briefProfileParagraphs?.length) return doc.briefProfileParagraphs;
    return doc?.briefProfile ? [doc.briefProfile] : [];
  });

  /** "Areas of Expertise" list within Brief Profile - empty hides that column. */
  protected readonly expertiseHighlights = computed(() => this.doctor()?.expertiseHighlights ?? []);

  /**
   * "Professional Affiliations" section, below Brief Profile. Real
   * per-doctor associations (with logo images from public/Images/affiliations
   * where available) - empty hides the whole section.
   */
  protected readonly professionalAffiliations = computed(() => this.doctor()?.professionalAffiliations ?? []);

  /**
   * "Honors & Awards" section. Real per-doctor awards - empty hides the
   * whole section. `theme` picks the card's accent color (see
   * doctor-detail.css's `.doctor-honors__card--*` modifiers) and `icon` is
   * a name understood by `<app-doctors-icon>`.
   */
  protected readonly honorsAwards = computed(() => this.doctor()?.honorsAwards ?? []);

  /**
   * "Publications" section. Real per-doctor publication titles, numbered
   * for display - empty hides the whole section.
   */
  protected readonly publications = computed(() =>
    (this.doctor()?.publications ?? []).map((title, i) => ({
      num: String(i + 1).padStart(2, '0'),
      title,
    })),
  );

  /**
   * "Education & Training" section - empty hides the whole section. The
   * icon is derived here rather than stored in the data so the data file
   * stays about facts and doesn't have to know the icon set.
   */
  protected readonly education = computed(() =>
    (this.doctor()?.education ?? []).map((entry) => ({
      ...entry,
      icon: entry.kind === 'certification' ? 'certificate' : entry.kind === 'fellowship' ? 'badge' : 'graduation-cap',
    })),
  );

  /** FAQ section - empty hides the section and suppresses the FAQPage JSON-LD. */
  protected readonly faqs = computed(() => this.doctor()?.faqs ?? []);

  /** "Related care at Vasavi" internal links - empty hides the section. */
  protected readonly relatedLinks = computed(() => this.doctor()?.relatedLinks ?? []);

  /** Hero designation line - SEO override if supplied, otherwise the listing designation. */
  protected readonly heroSubtitle = computed(() => {
    const doc = this.doctor();
    return doc?.seo?.heroSubtitle || doc?.title || '';
  });

  /** Second, smaller line inside the H1 - carries the page's primary keyword. */
  protected readonly h1Subtitle = computed(() => this.doctor()?.seo?.h1Subtitle ?? '');

  /** Small "Vasavi Hospitals, Kumaraswamy Layout, Bengaluru" line under the designation. */
  protected readonly heroLocation = computed(() => this.doctor()?.seo?.heroLocation ?? '');

  /** Canonical path for this profile, e.g. "/dr-nisha-buchade". */
  private readonly canonicalPath = computed(() => this.doctor()?.slug ?? '');

  constructor() {
    // Re-derive the whole head block whenever the resolved doctor changes -
    // covers both first load and navigating from one doctor's profile
    // straight to another's. Because these pages are prerendered (see
    // app.routes.server.ts), everything set here is baked into the static
    // HTML a crawler receives rather than being added by client-side JS
    // afterwards. The booking form (<app-appointment-booking>) resets its
    // own in-progress state whenever its `doctorName` input changes, so
    // there's nothing booking-related left to reset here.
    effect(() => {
      const doc = this.doctor();

      if (!doc) {
        this.seo.apply({
          title: 'Doctor Not Found - Vasavi Hospitals',
          description: "We couldn't find that doctor's profile. Browse all specialists at Vasavi Hospitals, Bengaluru.",
          canonical: '/doctors',
          // A slug that resolves to nothing is a soft 404 - keep it out of
          // the index so it can never compete with the real profile pages.
          robots: 'noindex, follow',
        });
        this.seo.clearJsonLd();
        return;
      }

      this.seo.apply({
        title: doc.seo?.metaTitle || `${doc.name} - ${doc.title}, Bangalore | ${SITE_NAME}`,
        description: doc.seo?.metaDescription || this.fallbackDescription(doc),
        keywords: doc.seo?.keywords,
        canonical: doc.slug,
        image: doc.imgDetail || doc.img,
        imageAlt: doc.alt || doc.name,
        ogType: 'profile',
      });

      this.seo.setJsonLd(JSONLD_ID.graph, this.buildProfileGraph(doc));

      if (doc.faqs?.length) {
        this.seo.setJsonLd(JSONLD_ID.faq, this.buildFaqSchema(doc));
      }
    });

    // In-app navigation away from this page has to take the JSON-LD with
    // it, or the previous doctor's structured data stays in <head> and
    // ends up describing whatever page the visitor lands on next.
    this.destroyRef.onDestroy(() => this.seo.clearJsonLd());
  }

  /** Scrolls the booking card under the sticky navbar - mirrors the doctors list page's scroll-to-search. */
  protected scrollToBooking(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = document.getElementById('doctor-booking-card');
    if (!target) return;
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  /** Description used for doctors who don't have hand-written SEO copy yet. */
  private fallbackDescription(doc: Doctor): string {
    const years = doc.experienceYears > 0 ? ` with ${doc.experienceYears}+ years of experience` : '';
    return `${doc.name} is a ${doc.title.toLowerCase()}${years} at ${SITE_NAME}, Kumaraswamy Layout, Bengaluru. ${doc.qualifications}. Book an appointment online.`;
  }

  /**
   * The page's main structured-data payload, as a single @graph so the
   * nodes can cross-reference by @id instead of repeating the hospital's
   * address four times.
   *
   * The doctor node is multi-typed `["Person", "Physician"]` deliberately:
   * Person carries the credentials that feed E-E-A-T (alumniOf,
   * hasCredential, award, knowsAbout) while Physician carries the
   * practice-level properties (medicalSpecialty, availableService,
   * address) that make the entry legible as a medical provider.
   */
  private buildProfileGraph(doc: Doctor): unknown {
    const pageUrl = absoluteUrl(this.canonicalPath());
    const doctorId = `${pageUrl}#doctor`;

    const address = {
      '@type': 'PostalAddress',
      streetAddress: HOSPITAL.streetAddress,
      addressLocality: HOSPITAL.addressLocality,
      addressRegion: HOSPITAL.addressRegion,
      postalCode: HOSPITAL.postalCode,
      addressCountry: HOSPITAL.addressCountry,
    };

    const hospital = {
      '@type': 'Hospital',
      '@id': SCHEMA_ID.hospital,
      name: HOSPITAL.name,
      url: SITE_URL,
      telephone: HOSPITAL.telephone,
      email: HOSPITAL.email,
      address,
      hasMap: HOSPITAL.mapsUrl,
      sameAs: [...HOSPITAL_SAME_AS],
    };

    const doctorNode: Record<string, unknown> = {
      '@type': ['Person', 'Physician'],
      '@id': doctorId,
      name: doc.name,
      honorificPrefix: 'Dr.',
      url: pageUrl,
      image: absoluteUrl(doc.imgDetail || doc.img),
      description: this.plainDescription(doc),
      jobTitle: doc.seo?.heroSubtitle || doc.title,
      medicalSpecialty: this.medicalSpecialties(doc),
      worksFor: { '@id': SCHEMA_ID.hospital },
      workLocation: { '@id': SCHEMA_ID.hospital },
      address,
      telephone: HOSPITAL.tollFree,
      areaServed: [
        { '@type': 'City', name: 'Bengaluru' },
        { '@type': 'AdministrativeArea', name: 'Karnataka' },
      ],
    };

    if (doc.seo?.sameAs?.length) doctorNode['sameAs'] = doc.seo.sameAs;
    if (doc.seo?.knowsAbout?.length) doctorNode['knowsAbout'] = doc.seo.knowsAbout;

    if (doc.seo?.procedures?.length) {
      doctorNode['availableService'] = doc.seo.procedures.map((name) => ({
        '@type': 'MedicalProcedure',
        name,
      }));
    }

    // Degrees become `alumniOf` (the institution) plus `hasCredential`
    // (the qualification itself); fellowships and certifications are
    // credentials only, since a fellowship centre isn't an alma mater.
    const degrees = (doc.education ?? []).filter((e) => e.kind === 'degree' && e.institution);
    if (degrees.length) {
      doctorNode['alumniOf'] = degrees.map((e) => ({
        '@type': 'CollegeOrUniversity',
        name: e.institution,
      }));
    }

    if (doc.education?.length) {
      doctorNode['hasCredential'] = doc.education.map((e) => ({
        '@type': 'EducationalOccupationalCredential',
        name: e.degree,
        credentialCategory:
          e.kind === 'certification' ? 'certification' : e.kind === 'fellowship' ? 'fellowship' : 'degree',
        ...(e.institution ? { recognizedBy: { '@type': 'Organization', name: e.institution } } : {}),
      }));
    }

    if (doc.honorsAwards?.length) {
      doctorNode['award'] = doc.honorsAwards.map((a) => a.description || a.title);
    }

    if (doc.professionalAffiliations?.length) {
      doctorNode['memberOf'] = doc.professionalAffiliations.map((a) => ({
        '@type': 'Organization',
        name: a.description || a.heading,
        ...(a.heading && a.description ? { alternateName: a.heading } : {}),
      }));
    }

    const breadcrumb = {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL + '/' },
        { '@type': 'ListItem', position: 2, name: 'Our Doctors', item: `${SITE_URL}/doctors` },
        { '@type': 'ListItem', position: 3, name: doc.name, item: pageUrl },
      ],
    };

    const webPage = {
      '@type': 'MedicalWebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: doc.seo?.metaTitle || doc.name,
      description: doc.seo?.metaDescription || this.fallbackDescription(doc),
      inLanguage: 'en-IN',
      isPartOf: { '@id': SCHEMA_ID.website },
      about: { '@id': doctorId },
      mainEntity: { '@id': doctorId },
      breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      primaryImageOfPage: absoluteUrl(doc.imgDetail || doc.img),
      publisher: { '@id': SCHEMA_ID.hospital },
    };

    const website = {
      '@type': 'WebSite',
      '@id': SCHEMA_ID.website,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { '@id': SCHEMA_ID.hospital },
      inLanguage: 'en-IN',
    };

    return {
      '@context': 'https://schema.org',
      '@graph': [hospital, website, webPage, breadcrumb, doctorNode],
    };
  }

  /**
   * FAQPage node, kept as its own script block so it can be dropped
   * independently. Google no longer shows FAQ rich results for most
   * commercial sites, but the markup still helps entity understanding and
   * is routinely picked up by the AI answer engines - and the questions
   * are visibly answered on the page, which is the condition for using it.
   */
  private buildFaqSchema(doc: Doctor): unknown {
    const pageUrl = absoluteUrl(this.canonicalPath());
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: (doc.faqs ?? []).map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    };
  }

  /**
   * schema.org's `medicalSpecialty` expects MedicalSpecialty enum values,
   * so the department string is mapped onto them rather than passed
   * through raw. Anything unrecognised falls back to the department name,
   * which is still valid as free text.
   */
  private medicalSpecialties(doc: Doctor): string[] {
    const map: Record<string, string[]> = {
      Gynecology: ['Obstetric', 'Gynecologic', 'Oncologic'],
      'Obstetrics & Gynecology': ['Obstetric', 'Gynecologic'],
      Oncology: ['Oncologic'],
      Cardiology: ['Cardiovascular'],
      Nephrology: ['Renal'],
      Neurology: ['Neurologic'],
      Dermatology: ['Dermatology'],
      'Pediatrics & Neonatology': ['Pediatric'],
      Orthopedics: ['Musculoskeletal'],
      'General Medicine': ['PrimaryCare'],
      'Internal Medicine': ['Internal'],
      Pulmonology: ['Pulmonary'],
      Urology: ['Urologic'],
      Gastroenterology: ['Gastroenterologic'],
    };
    return map[doc.department] ?? [doc.department];
  }

  /** First paragraph of the profile, used as the schema `description`. */
  private plainDescription(doc: Doctor): string {
    return doc.briefProfileParagraphs?.[0] || doc.briefProfile || this.fallbackDescription(doc);
  }
}
