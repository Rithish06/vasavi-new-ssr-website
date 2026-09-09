/**
 * Shared doctor roster - single source of truth for both the doctors
 * listing page and each doctor's individual profile page.
 */
export interface AffiliationEntry {
  /** Short association code/name shown as the card's bold heading, e.g. "IAP". */
  heading: string;
  /** Full association name, e.g. "Indian Academy of Pediatrics". */
  description: string;
  /** Path to the association's logo under public/Images/affiliations - falls back to a generic badge icon when absent. */
  image?: string;
}

export interface AwardEntry {
  /** Name understood by `<app-doctors-icon>` - see doctors-icon.ts for the full set. */
  icon: string;
  /** Picks the card's accent color - see doctor-detail.css's `.doctor-honors__card--*` modifiers. */
  theme: 'blue' | 'pink' | 'gold' | 'green' | 'purple';
  title: string;
  description: string;
}

/**
 * One row of the "Education & Training" section on a doctor's profile
 * page. Kept as degree + institution rather than a single string so the
 * same data can feed both the visible list and the `alumniOf` /
 * `hasCredential` arrays in the page's JSON-LD.
 */
export interface EducationEntry {
  /** e.g. "MS - Obstetrics & Gynaecology". */
  degree: string;
  /** e.g. "JSS Medical College, Mysuru, Karnataka". Omit when the institution isn't confirmed. */
  institution?: string;
  /** Optional one-line note - typically what a fellowship actually covered. */
  detail?: string;
  /** Picks the row's icon: 'degree' gets the graduation cap, the others get a badge/certificate. */
  kind?: 'degree' | 'fellowship' | 'certification';
}

/**
 * A question/answer pair rendered in the profile page's FAQ section and
 * emitted as FAQPage structured data. Answers should be plain prose with
 * no markup, and self-contained: Google's snippets and the AI answer
 * engines lift them close to verbatim, so a tight 40-60 word answer that
 * reads on its own does far more work than a long one.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * "Related care at Vasavi" link on a doctor's page. These are the
 * internal links that pass topical relevance between a doctor's profile
 * and the matching department/procedure pages - `path` must be a real
 * route from app.routes.ts, or the link 404s and actively hurts.
 */
export interface RelatedLink {
  /** Route path, leading slash included, e.g. "/hysterectomy-surgery-in-bangalore". */
  path: string;
  /** Anchor text - the phrase people actually search, never "click here". */
  label: string;
  /** Short supporting line under the anchor. */
  description?: string;
}

/**
 * Per-page SEO overrides for a doctor's profile page. Present only for
 * doctors whose page has been through an SEO pass; doctor-detail.ts falls
 * back to generated defaults for everyone else, so filling this in for
 * one doctor never changes another doctor's page.
 */
export interface DoctorSeo {
  /** <title>. Aim for ~55-62 characters so Google doesn't truncate it in the SERP. */
  metaTitle: string;
  /** <meta name="description">. Aim for ~150-160 characters and end with a reason to click. */
  metaDescription: string;
  /** <meta name="keywords"> - ignored by Google, still read by Bing and several Indian health aggregators. */
  keywords?: string;
  /**
   * Second line inside the <h1>, rendered smaller than the name. This is
   * what puts the primary keyword ("Gynaecologist & Gynaec-Oncologist in
   * Bangalore") inside the page's only H1 without wrecking the hero design.
   */
  h1Subtitle?: string;
  /** Replaces the hero designation line when a longer, more specific one is wanted. */
  heroSubtitle?: string;
  /** Small location line under the designation - a real local-SEO signal, and genuinely useful to patients. */
  heroLocation?: string;
  /**
   * Subjects the doctor is an authority on, emitted as `knowsAbout` on the
   * Person/Physician node. This is the field that helps entity and AI
   * answer engines connect a doctor to a condition or procedure.
   */
  knowsAbout?: string[];
  /** Procedures offered, emitted as `availableService` MedicalProcedure nodes. */
  procedures?: string[];
  /** Verified external profiles for `sameAs`. Only add URLs someone has actually opened and checked. */
  sameAs?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  /** Real 1:1 headshot in public/Images/new-doctor-image - sq variant used where available. */
  img: string;
  imgDetail?: string;
  // img-detail: string;
  alt: string;
  /** Consultant designation shown under the name, e.g. "Sr. Consultant Bariatric Surgeon". */
  title: string;
  /** Filter bucket - matches one of DEPARTMENTS / MORE_DEPARTMENTS. */
  department: string;
  qualifications: string;
  /** 0 means "not specified" - the experience badge is hidden in that case. */
  experienceYears: number;
  /** Empty string means no profile page exists yet - routes/links to it are hidden in that case. */
  slug: string;

  /**
   * Real detail-page content below. All optional - a handful of doctors
   * (no profile page, or no supplied content yet) simply omit some or all
   * of these, and doctor-detail.ts/html hide each section entirely when
   * its field is missing/empty rather than showing a blank heading.
   */
  briefProfile?: string;
  /**
   * Multi-paragraph version of `briefProfile`. When present it wins, and
   * each string becomes its own <p> - which is what lets an SEO-written
   * profile run to three or four readable paragraphs instead of one wall
   * of text. `briefProfile` stays the single-paragraph fallback for every
   * doctor who hasn't been rewritten yet.
   */
  briefProfileParagraphs?: string[];
  expertiseHighlights?: string[];
  professionalAffiliations?: AffiliationEntry[];
  honorsAwards?: AwardEntry[];
  publications?: string[];

  /** "Education & Training" section - hidden entirely when absent. */
  education?: EducationEntry[];
  /** FAQ section + FAQPage structured data - hidden entirely when absent. */
  faqs?: FaqEntry[];
  /** "Related care at Vasavi" internal links - hidden entirely when absent. */
  relatedLinks?: RelatedLink[];
  /** Per-page SEO overrides - see DoctorSeo. Falls back to generated defaults when absent. */
  seo?: DoctorSeo;
}

/** Primary department checkboxes - the most common ones, shown expanded by default. */
export const DEPARTMENTS = [
  'Anesthesiology',
  'Bariatric Surgery',
  'Cardiology',
  'Critical Care',
  'Dentistry',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'ENT',
];

/** Revealed behind "More Departments". */
export const MORE_DEPARTMENTS = [
  'Gastroenterology',
  'General Medicine',
  'General Surgery',
  'Gynecology',
  'Hematology',
  'Internal Medicine',
  'Nephrology',
  'Neurology',
  'Neurosurgery',
  'Nutrition',
  'Obstetrics & Gynecology',
  'Oncology',
  'Orthopedics',
  'Pediatrics & Neonatology',
  'Pulmonology',
  'Urology',
];

const IMG = '/Images/new-doctor-image/';
const AFF = '/Images/affiliations/';

export const DOCTORS: Doctor[] = [
  {
    id: 'dr-ashok-m-v',
    name: 'Dr. Ashok M. V',
    img: IMG + 'new-doc-images/dr_ashok_mv.png',
    imgDetail: IMG + 'new-doc-images/dr-ashok-m-v.png',
    alt: 'Dr. Ashok M. V | Pediatrician & Neonatologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Neonatologist',
    department: 'Pediatrics & Neonatology',
    qualifications: 'MBBS, MD Pediatrics, Fellowship in Neonatology',
    experienceYears: 15,
    slug: '/dr-ashok-m-v',
    briefProfile:
      'I have done my masters in paediatrics from KIMS and my fellowship in nematology in Indira Gandhi Institute of Child and I have worked in abroad for few few years and I continues my work in hospitals like Sagar Hospital and Fortis Hospital, right now, I am working as a Consultant Neonatologist in Vasavi Hospitals. I have more than 15 years of experience in paediatrics, and I have a teaching experience for DNB students. I have presented few papers in international conference. My area of interest is Neonatology. I take care level 3 NICU and able to manage smaller baby as small as 24 week and other complicated babies.',
    expertiseHighlights: ['Pediatrics and Neonatology'],
    professionalAffiliations: [
      { heading: 'IAP', description: 'Indian Academy of Pediatrics', image: AFF + 'IAP.jpg' },
      { heading: 'NNF', description: 'National Neonatology Forum', image: AFF + 'NNF.png' },
      { heading: 'BPS', description: 'Bangalore Pediatric Society', image: AFF + 'IAP.jpg' },
    ],
    publications: ['Presentation in India and international conferences'],
  },
  {
    id: 'dr-sreenidhi-h-c',
    name: 'Dr. Sreenidhi H. C',
    img: IMG + 'dr-sreenidhi-h-c-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-sreenidhi-h-c.png',
    alt: 'Dr. Sreenidhi H. C | Nephrologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Nephrologist',
    department: 'Nephrology',
    qualifications: 'MBBS, MD, DM Nephrology',
    experienceYears: 3,
    slug: '/dr-sreenidhi-h-c',
    expertiseHighlights: ['Nephrology', 'Kidney Transplantation'],
    professionalAffiliations: [
      { heading: 'ISN', description: 'International Society of Nephrology', image: AFF + 'ISN.jpg' },
      { heading: 'Indian Society of Nephrology', description: 'Indian Society of Nephrology', image: AFF + 'ISN.png' },
      {
        heading: 'AVATAR',
        description: 'Association of Vascular Access & Interventional Renal Physician',
        image: AFF + 'AVATAR.jpeg',
      },
      { heading: 'ISPD', description: 'International Society of Peritoneal Dialysis', image: AFF + 'ISPD.jpg' },
      { heading: 'ISH', description: 'International Society of Hypertension', image: AFF + 'ISH.png' },
    ],
    honorsAwards: [
      {
        icon: 'badge',
        theme: 'blue',
        title: 'Best Poster Award',
        description:
          "Directly Acting Antiviral Agents (DAA) In The Treatment Of HCV Infected Haemodialysis Patients- 4 Years' Experience From A Tertiary Care Hospital- Poster presentation in ISNCON 2021",
      },
      { icon: 'trophy', theme: 'green', title: 'WCN Grant', description: 'WCN GRANT 2022' },
      { icon: 'certificate', theme: 'gold', title: 'DM Gold Medal', description: 'DM nephrology gold medal' },
    ],
    publications: [
      "Study of left ventricular systolic dysfunction, left ventricular diastolic dysfunction and pulmonary hypertension in CKD 3b-5ND patients-A single centre cross-sectional study",
      'Renal outcomes in myeloma associated acute kidney injury; a single centre experience',
      'Prognostic value of modified National Institute of Health activity and chronicity scoring in determining complete renal response in newly diagnosed lupus nephritis: a retrospective single centre study',
      'Thyroid function in patients with idiopathic nephrotic syndrome',
      'Predicting the risk of progression in Indian ADPKD cohort using PROPKD score - A single-centre retrospective study',
    ],
  },
  {
    id: 'dr-nisha-buchade',
    name: 'Dr. Nisha Buchade',
    img: IMG + 'dr-nisha-buchade.png',
    imgDetail: IMG + 'new-doc-images/dr-nisha-buchade.png',
    alt: 'Dr. Nisha Buchade | Gynecologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Gynecologist',
    department: 'Gynecology',
    qualifications: 'MBBS, MS (OBG), Fellowship in Gynaec Oncology',
    experienceYears: 15,
    slug: '/dr-nisha-buchade',
    briefProfile:
      "Dedicated gynecologist providing compassionate, ethical, and evidence-based care with a focus on women's health.",
    // SEO-written profile copy. `briefProfileParagraphs` wins over the
    // single-paragraph `briefProfile` above (kept as the fallback), and the
    // keyword targets are worked into prose rather than stuffed: the page
    // is aiming at "gynecologist in Bangalore", "gynaec oncologist in
    // Bangalore", "hysterectomy / myomectomy / fibroid removal", and the
    // long-tail condition terms further down.
    briefProfileParagraphs: [
      'Dr. Nisha Buchade is a Consultant Obstetrician, Gynaecologist and Gynaec-Oncologist at Vasavi Hospitals, Kumaraswamy Layout, Bengaluru, with more than 15 years of clinical practice in women’s health. She is one of relatively few gynaecologists in Bangalore who pairs everyday obstetric and gynaecological care with the surgical training of a gynaecologic cancer specialist - which means a woman in South Bengaluru can have her pregnancy, her fibroid or endometriosis surgery, and, if it ever comes to it, her cancer surgery managed under one roof by a doctor who already knows her history.',
      'Her surgical practice is built around minimally invasive gynaecology. She performs robotic and laparoscopic hysterectomy (removal of the uterus), myomectomy and fibroid removal that preserves the uterus, ovarian cystectomy, surgery for endometriosis and adenomyosis, pelvic organ prolapse repair, and staging and radical surgery for cervical, endometrial and ovarian cancer - including robotic lymphadenectomy, the subject of her award-winning video presentation at the IAGE national conference. Because these operations are done through keyhole incisions rather than an open cut, most patients have less blood loss, less pain afterwards and a shorter stay in hospital.',
      'On the obstetric side, Dr. Nisha manages high-risk pregnancies - diabetes and high blood pressure in pregnancy, twin pregnancy, previous caesarean, recurrent miscarriage, placental problems and IVF conceptions - with NICU and critical care support on the same campus. She is known for painless normal deliveries supported by labour analgesia. Her outpatient practice covers PCOD/PCOS, infertility evaluation, abnormal uterine bleeding, menopause and hormone therapy, and urinary incontinence and pelvic floor problems.',
      'Prevention is a large part of how she works. Certified by PINCC (Prevention International: No Cervical Cancer) to both perform and teach VIA screening, colposcopy, cervical biopsy and cryotherapy, she runs cervical cancer screening and HPV vaccination for women and adolescent girls. Her stated approach is compassionate, ethical and evidence-based: explaining what a scan or a biopsy actually shows, laying out every option including the option of not operating, and reaching the decision together with the patient rather than for her.',
    ],
    expertiseHighlights: [
      'High-risk pregnancy care and painless normal deliveries',
      'Robotic and laparoscopic hysterectomy (removal of the uterus)',
      'Myomectomy and fibroid removal that preserves the uterus',
      'Laparoscopic surgery for endometriosis and adenomyosis',
      'Gynaec-oncology: cervical, uterine and ovarian cancer surgery',
      'Cervical cancer screening, colposcopy, VIA and HPV vaccination',
      'Pelvic organ prolapse repair and urinary incontinence',
      'PCOD/PCOS, infertility evaluation and fertility-enhancing surgery',
      'Abnormal uterine bleeding and ovarian cyst treatment',
      'Menopause management and hormone therapy',
    ],
    professionalAffiliations: [
      { heading: 'IAGE', description: 'Indian association of Gynecological Endoscopists', image: AFF + 'IAGE.png' },
      { heading: 'BSOG', description: 'Bangalore society of obstetrics and Gynecologist', image: AFF + 'logobsog.png' },
      { heading: 'AGOI', description: 'Association of Gynaecological Oncologists of India', image: AFF + 'AGOI.png' },
      {
        heading: 'UPIA',
        description: 'Urogynecology Pelvic Floor Dysfunction and Incontinence Association',
        image: AFF + 'upia.jpg',
      },
    ],
    honorsAwards: [
      {
        icon: 'certificate',
        theme: 'gold',
        title: 'Excellence in Maternity Care',
        description: 'Times health excellence award for best maternity and child care',
      },
      {
        icon: 'document',
        theme: 'blue',
        title: 'Best Paper Presentation',
        description: 'Indumati Jhaveri award for best paper presentation in national conference',
      },
      { icon: 'badge', theme: 'green', title: 'Robotic Scholar', description: 'Robotic scholar for year 2015' },
      {
        icon: 'document',
        theme: 'purple',
        title: 'Best Poster Presentation',
        description: 'Best poster presentation in state conference',
      },
      {
        icon: 'play',
        theme: 'pink',
        title: 'Best Video Presentation',
        description:
          'Best video presentation of Robotic lymphadenectomy in endometrial cancer in IAGE national conference',
      },
    ],
    publications: [
      'Study Of Diagnostic Efficacy Of Visual Inspection With Acetic Acid (VIA) In Comparison With PAP Smear In Cervical Cancer Screening In indexed journal',
    ],
    // Education is both a trust signal for patients and the source of the
    // `alumniOf` / `hasCredential` nodes in this page's JSON-LD. MBBS is
    // listed against BMCRI (RGUHS is the affiliating university, which is
    // why some directory listings show RGUHS instead) - confirmed with the
    // hospital before publishing.
    education: [
      {
        degree: 'MBBS',
        institution: 'Bangalore Medical College and Research Institute (BMCRI), Bengaluru, Karnataka',
        kind: 'degree',
      },
      {
        degree: 'MS - Obstetrics & Gynaecology',
        institution: 'JSS Medical College, Mysuru, Karnataka',
        kind: 'degree',
      },
      {
        degree: 'Fellowship in Gynaecological Oncology & Minimal Access Surgery',
        institution: 'Hyderabad, Telangana',
        detail: 'Advanced training in laparoscopic and robotic surgery for gynaecological cancers',
        kind: 'fellowship',
      },
      {
        degree: 'Fellowship in Advanced Laparoscopy',
        institution: "Paul's Hospital, Kochi, Kerala",
        kind: 'fellowship',
      },
      {
        degree: 'Fellowship in Advanced Infertility',
        institution: 'Gujarat',
        kind: 'fellowship',
      },
      {
        degree: 'Certification in Colposcopy & Cervical Cancer Screening',
        institution: 'PINCC - Prevention International: No Cervical Cancer',
        detail: 'Certified to perform and to train other clinicians in VIA, cervical biopsy and cryotherapy',
        kind: 'certification',
      },
    ],
    // FAQ answers are written to stand alone at 40-70 words each, because
    // that is the form Google's snippets and the AI answer engines lift.
    // They also carry the long-tail queries the page can realistically win
    // ("can fibroids be removed without removing the uterus", "what does a
    // gynaec oncologist do") without diluting the main keyword targets.
    faqs: [
      {
        question: 'Who is Dr. Nisha Buchade?',
        answer:
          'Dr. Nisha Buchade is a Consultant Obstetrician, Gynaecologist and Gynaec-Oncologist at Vasavi Hospitals, Kumaraswamy Layout, Bengaluru, with over 15 years of clinical experience. She holds an MBBS, an MS in Obstetrics & Gynaecology, and fellowships in gynaecological oncology, advanced laparoscopy and advanced infertility.',
      },
      {
        question: 'What conditions does Dr. Nisha Buchade treat?',
        answer:
          'She treats uterine fibroids, endometriosis and adenomyosis, ovarian cysts, PCOD/PCOS, abnormal uterine bleeding, infertility, pelvic organ prolapse, urinary incontinence and menopausal problems, as well as cancers of the cervix, uterus and ovaries. She also manages routine and high-risk pregnancies through to delivery.',
      },
      {
        question: 'Does Dr. Nisha Buchade perform robotic and laparoscopic hysterectomy?',
        answer:
          'Yes. She performs hysterectomy - removal of the uterus - by robotic and laparoscopic routes at Vasavi Hospitals, for fibroids, heavy bleeding, adenomyosis, prolapse and gynaecological cancer. Keyhole surgery usually means less blood loss, less pain and a shorter hospital stay than open surgery, though the right route depends on your individual case.',
      },
      {
        question: 'Can uterine fibroids be removed without removing the uterus?',
        answer:
          'Often, yes. A myomectomy removes the fibroids and leaves the uterus in place, which matters if you may want to conceive later. Whether it suits you depends on the number, size and position of the fibroids, your age and your plans. Dr. Nisha discusses both myomectomy and hysterectomy before any decision is made.',
      },
      {
        question: 'What does a gynaec-oncologist do, and when should I see one?',
        answer:
          'A gynaec-oncologist is a gynaecologist with additional fellowship training in cancers of the cervix, uterus, ovaries, vulva and vagina, including the staging and radical surgery these need. See one if a Pap smear, HPV test, scan or biopsy is abnormal, or if a gynaecological cancer has been diagnosed or suspected.',
      },
      {
        question: 'Does Dr. Nisha Buchade handle high-risk pregnancies?',
        answer:
          'Yes. She manages high-risk pregnancies including diabetes and high blood pressure in pregnancy, twin pregnancy, previous caesarean, recurrent miscarriage, placental problems and IVF conceptions, with NICU and critical care support available on the same campus if mother or baby needs it.',
      },
      {
        question: 'Is painless normal delivery possible at Vasavi Hospitals?',
        answer:
          'Yes. A painless delivery is a normal vaginal birth with labour analgesia, usually an epidural, controlling contraction pain while you stay awake and able to push. Dr. Nisha supports painless normal delivery wherever it is safe for mother and baby, with anaesthesia cover available round the clock.',
      },
      {
        question: 'How often should I have a cervical cancer screening test?',
        answer:
          'Most guidelines suggest cervical screening roughly every three years with a Pap smear, or every five years with an HPV test, for women from about 25 to 65. Dr. Nisha is PINCC-certified in VIA screening, colposcopy, cervical biopsy and cryotherapy, and will advise the interval that fits your own history.',
      },
      {
        question: 'Where does Dr. Nisha Buchade consult, and how do I book an appointment?',
        answer:
          'She consults at Vasavi Hospitals, #716, 36th Cross, 7th Block, Kumaraswamy Layout, Bengaluru 560078. You can book using the appointment form on this page or by calling the hospital. Carry any previous scans, biopsy reports and prescriptions to the first visit so nothing has to be repeated.',
      },
    ],
    // Internal links from this profile into the matching department and
    // procedure pages. Every path below is a real route in app.routes.ts -
    // check that before adding more, since a 404 here costs more than the
    // link gains. Ideally each of these pages links back to this profile.
    relatedLinks: [
      {
        path: '/obstetrics-and-gynaecology-hospital-in-bangalore',
        label: 'Obstetrics & Gynaecology at Vasavi',
        description: "The full women's health department, from antenatal care to gynaec surgery.",
      },
      {
        path: '/hysterectomy-surgery-in-bangalore',
        label: 'Hysterectomy surgery in Bangalore',
        description: 'Robotic and laparoscopic removal of the uterus, and what recovery looks like.',
      },
      {
        path: '/fibroid-removal-in-bangalore',
        label: 'Fibroid removal (myomectomy)',
        description: 'Uterus-preserving fibroid surgery for women who may still want to conceive.',
      },
      {
        path: '/ovarian-cystectomy-in-bangalore',
        label: 'Ovarian cystectomy',
        description: 'Keyhole removal of ovarian cysts while preserving healthy ovarian tissue.',
      },
      {
        path: '/surgical-oncology-cancer-hospital-in-bangalore',
        label: 'Cancer surgery at Vasavi',
        description: 'Surgical oncology services, including gynaecological cancer surgery.',
      },
      {
        path: '/minimally-invasive-surgery-in-bangalore',
        label: 'Minimally invasive & robotic surgery',
        description: 'How keyhole and robotic surgery differ from open operations.',
      },
    ],
    seo: {
      metaTitle: 'Dr. Nisha Buchade - Gynecologist & Gynaec Oncologist, Bangalore',
      metaDescription:
        'Gynaecologist & gynaec-oncologist at Vasavi Hospitals, Kumaraswamy Layout, Bangalore. 15+ years in robotic hysterectomy, myomectomy & high-risk pregnancy care.',
      keywords:
        'gynecologist in Bangalore, gynaec oncologist in Bangalore, Dr. Nisha Buchade, gynecologist Kumaraswamy Layout, hysterectomy surgeon in Bangalore, myomectomy in Bangalore, fibroid removal in Bangalore, laparoscopic gynecologist Bangalore, robotic gynec surgery Bangalore, high risk pregnancy doctor Bangalore, painless normal delivery Bangalore, PCOD treatment Bangalore, infertility specialist Bangalore, cervical cancer screening Bangalore',
      h1Subtitle: 'Gynaecologist & Gynaec-Oncologist in Bangalore',
      heroSubtitle: 'Consultant Obstetrician, Gynaecologist & Gynaec-Oncologist',
      heroLocation: 'Vasavi Hospitals, Kumaraswamy Layout, Bengaluru',
      knowsAbout: [
        'Gynaecologic oncology',
        'Robotic hysterectomy',
        'Laparoscopic hysterectomy',
        'Myomectomy',
        'Uterine fibroids',
        'Endometriosis',
        'Adenomyosis',
        'Ovarian cysts',
        'Cervical cancer screening',
        'HPV vaccination',
        'Colposcopy',
        'High-risk pregnancy',
        'Painless normal delivery',
        'PCOS',
        'Female infertility',
        'Menopause',
        'Urinary incontinence',
        'Pelvic organ prolapse',
      ],
      procedures: [
        'Robotic hysterectomy',
        'Laparoscopic hysterectomy',
        'Myomectomy (fibroid removal)',
        'Laparoscopic ovarian cystectomy',
        'Laparoscopic excision of endometriosis',
        'Pelvic organ prolapse repair',
        'Radical hysterectomy for cervical cancer',
        'Staging surgery for endometrial and ovarian cancer',
        'Robotic pelvic lymphadenectomy',
        'Colposcopy and cervical biopsy',
        'Cervical cryotherapy',
        'HPV vaccination',
        'Normal delivery with labour analgesia',
        'Caesarean section',
      ],
      // Add verified external profile URLs here (Google Business Profile,
      // Practo, IMA/KMC listing) once someone has actually opened each one
      // and confirmed it is this doctor - a wrong sameAs merges her entity
      // with someone else's, which is hard to undo.
      sameAs: [],
    },
  },
  {
    id: 'dr-venkatesh-rathod-r',
    name: 'Dr. Venkatesh Rathod R',
    img: IMG + 'dr-venkatesh-rathod.png',
    imgDetail: IMG + 'new-doc-images/dr-venkatesh-rathod-r.png',
    alt: 'Dr. Venkatesh Rathod R | Orthopedic Surgeon | Vasavi Hospitals Bangalore',
    title: 'Consultant Orthopedic Surgeon',
    department: 'Orthopedics',
    qualifications: 'MBBS, D.Ortho, DNB Ortho',
    experienceYears: 16,
    slug: '/dr-venkatesh-rathod-r',
    briefProfile:
      'Dr. Venkatesh Rathod - I am a highly competent and skilled surgeon with more than 11 years of experience in orthopedic surgery. I have expertise in upper limb trauma management, expert in minimally invasive surgery, complicated Periarticular Fractures, complex/multiple tendon injuries, local and free flap surgeries in hand and wrist. Have special interest in MAKO robotic Hip Knee & shoulders replacement and arthroscopic surgeries. I have been a member of the team of doctors for royal challengers Bangalore cricket team attending to sport injuries. I have several publications to my credit. I play pivotal role in execution and streamlining the operative plan of the team to ensure smooth running of the department for excellent patient care and rehabilitation. I have been an integral part of Vasavi institute of advanced orthopedics from the time it started. He has performed and assisted nearly 3000 surgeries till date. I have an accomplished medical professional adept at performing surgeries completing evaluations and developing successful treatment plans. Driven to communicate well and establish strong rapport with all patients.',
    expertiseHighlights: ['Upper limb trauma', 'MAKO robotic knee and hip arthroplasty', 'Knee and shoulder arthroscopy'],
    honorsAwards: [
      {
        icon: 'badge',
        theme: 'blue',
        title: 'Best Paper Award',
        description: 'Best paper award for proximal humerus fracture with philos plate and screws 2014',
      },
    ],
    publications: ['Proximal humerus fracture treated with philos plate - clinical outcome'],
  },
  {
    id: 'dr-vinay-hosadurga',
    name: 'Dr. Vinay Hosadurga',
    img: IMG + 'dr-vinay-hosadurga.png',
    imgDetail: IMG + 'new-doc-images/dr-vinay-hosadurga.png',
    alt: 'Dr. Vinay Hosadurga | General Physician | Vasavi Hospitals Bangalore',
    title: 'Consultant Physician',
    department: 'General Medicine',
    qualifications: 'MBBS, MD (General Medicine)',
    experienceYears: 14,
    slug: '/dr-vinay-hosadurga',
    briefProfile:
      'Patient centered evidence based ethical approach to achieve better quality of life to my patients.',
    expertiseHighlights: ['Metabolic diseases', 'Infectious diseases'],
    honorsAwards: [
      { icon: 'badge', theme: 'gold', title: 'Academic Excellence', description: 'M.D 2nd Rank to RGUHS Batch 2012' },
    ],
  },
  {
    id: 'dr-abhiram-r',
    name: 'Dr. Abhiram R',
    img: IMG + 'dr-abhiram-r.png',
    imgDetail: IMG + 'new-doc-images/dr-abhiram-r.png',
    alt: 'Dr. Abhiram R | Dermatologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Dermatologist',
    department: 'Dermatology',
    qualifications: 'MBBS, MD Dermatology',
    experienceYears: 10,
    slug: '/dr-abhiram-r',
    briefProfile:
      'Dr. Abhiram Rayapati is an experienced dermatologist with over 10 years of expertise in treating a wide range of skin, hair, and nail problems. He completed his MBBS and MD in Dermatology from PES Institute of Medical Sciences and Research and pursued advanced training in Dermatosurgery and Hair Transplantation at BMCRI, Bengaluru. He is skilled in laser treatments, aesthetic procedures, skin surgeries, and hair restoration, and has successfully treated thousands of patients. Known for his caring approach and clear communication, Dr. Abhiram ensures that every patient feels comfortable and receives the best possible care. He is also a member of the Indian Association of Dermatologists (IADVL).',
    expertiseHighlights: ['Consultant Dermatologist', 'Dermatosurgeon'],
    professionalAffiliations: [
      {
        heading: 'IADVL',
        description: 'Indian Association of Dermatologists, Venereologists and Leprologists',
        image: AFF + 'IADVL.jpg',
      },
      { heading: 'BDS', description: 'Bangalore Dermatological Society', image: AFF + 'logo.png' },
    ],
  },
  {
    id: 'dr-sunil-r',
    name: 'Dr. Sunil R',
    img: IMG + 'new-doc-images/dr-male-vector.png',
    alt: 'Dr. Sunil R | Nephrologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Nephrologist',
    department: 'Nephrology',
    qualifications: 'MD, DM Nephrology',
    experienceYears: 15,
    slug: '/dr-sunil-r',
    briefProfile:
      'Dr Sunil R is a highly skilled Nephrologist and Transplant Physician with extensive experience in managing complex renal cases. His educational background includes MBBS from Kempegowda Institute of Medical Sciences, MD in General Medicine from JSS Medical College, and DM in Nephrology from Institute of NephroUrology, Victoria Hospital Campus. He has been contributing to the medical field through his clinical expertise and has presented research findings at various national conferences.',
    expertiseHighlights: ['Renal Transplantation', 'CKD Dialysis'],
    professionalAffiliations: [
      { heading: 'ISN', description: 'International Society of Nephrology', image: AFF + 'ISN.jpg' },
      { heading: 'ISOT', description: 'International Society for Organ Transplantation', image: AFF + 'ISOT.png' },
    ],
    publications: ['DREAM D - CJASN', 'DREAM ND - CJASN'],
  },
  {
    id: 'dr-pratham-r-bysani',
    name: 'Dr. Pratham R Bysani',
    img: IMG + 'new-doc-images/dr-male-vector.png',
    alt: 'Dr. Pratham R Bysani | Neurosurgeon | Vasavi Hospitals Bangalore',
    title: 'Consultant Neurosurgeon',
    department: 'Neurosurgery',
    qualifications: 'MBBS, MS, MCh Neurosurgery',
    experienceYears: 10,
    slug: '/dr-pratham-r-bysani',
    expertiseHighlights: ['Brain Surgery', 'Spine Surgery'],
    professionalAffiliations: [
      { heading: 'NSI', description: 'Neurological Society of India', image: AFF + 'NSI.jpg' },
      { heading: 'CVSI', description: 'Cerebrovascular Society of India', image: AFF + 'CVSI.png' },
      { heading: 'CNS', description: 'Congress of Neurological Surgeons USA', image: AFF + 'CNS.jpg' },
      {
        heading: 'ESMINT',
        description: 'European Society of Minimally Invasive Neurological Therapy',
        image: AFF + 'ESMINT.png',
      },
      { heading: 'ASSI', description: 'Association of Spine Surgeons India', image: AFF + 'ASSI.jpg' },
      { heading: 'MISSAB', description: 'Minimally Invasive Spine Surgeons of Bharat', image: AFF + 'MISSAB.jpg' },
      { heading: 'RCS', description: 'Royal College of Surgeons, Europe', image: AFF + 'RCS.png' },
    ],
  },
  {
    id: 'dr-karthik-k',
    name: 'Dr. Karthik K',
    img: IMG + 'dr-karthik-k.png',
    imgDetail: IMG + 'new-doc-images/dr-karthik-k.png',
    alt: 'Dr. Karthik K | Anesthesiologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Anesthesiologist',
    department: 'Anesthesiology',
    qualifications: 'MBBS, DA, DNB Anaesthesiology',
    experienceYears: 21,
    slug: '/dr-karthik-k',
    briefProfile: 'Efficient, experienced and compassionate doctor with leadership qualities.',
    expertiseHighlights: ['Thoracic epidurals', 'Labor epidurals'],
    professionalAffiliations: [
      { heading: 'ISA', description: 'Indian Society of Anaesthesiology', image: AFF + 'ISA.jpg' },
      { heading: 'ICA', description: 'Indian College of Anaesthesiology', image: AFF + 'ICA.jpg' },
      { heading: 'IMA', description: 'Indian Medical Association', image: AFF + 'IMA.png' },
    ],
    publications: ['Thoracic epidural anaesthesia for upper abdominal surgeries'],
  },
  {
    id: 'dr-pradeep-a-dongare',
    name: 'Dr. Pradeep A Dongare',
    img: IMG + 'new-doc-images/dr-male-vector.png',
    alt: 'Dr. Pradeep A Dongare | Anesthesiologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Anesthesiologist',
    department: 'Anesthesiology',
    qualifications: 'DA, DNB',
    experienceYears: 12,
    slug: '/dr-pradeep-a-dongare',
    briefProfile:
      'I completed my undergraduate at VIMS Ballari and specialized in Anaesthesiology from Mysore Medical College; Diploma 2009, DNB Kidwai Institute. Passionate teacher and researcher with 25 publications.',
    expertiseHighlights: ['Regional Anaesthesia', 'Difficult Airway', 'Research Methodology'],
    professionalAffiliations: [
      { heading: 'ISA', description: 'Indian Society of Anaesthesiologists', image: AFF + 'ISA.jpg' },
      { heading: 'AORA', description: 'Academy of Regional Anaesthesia', image: AFF + 'AORA.png' },
      { heading: 'AIDAA', description: 'All India Difficult Airway Association', image: AFF + 'AIDAA.png' },
      { heading: 'AOA', description: 'Association of Obstetric Anaesthetists', image: AFF + 'AOA.png' },
      { heading: 'APSF', description: 'Anaesthesia Patient Safety Forum', image: AFF + 'APSF.png' },
    ],
    honorsAwards: [
      {
        icon: 'badge',
        theme: 'blue',
        title: "ISA President's Appreciation Award",
        description: 'ISA Presidents Appreciation Award',
      },
    ],
    publications: ['25 publications in anesthesiology'],
  },
  {
    id: 'dr-abhirami-ravindran',
    name: 'Dr. Abhirami Ravindran',
    img: IMG + 'new-doc-images/dr-female-vector.png',
    alt: 'Dr. Abhirami Ravindran | Anesthesiologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Anesthesiologist',
    department: 'Anesthesiology',
    qualifications: 'MBBS, DNB Anaesthesia',
    experienceYears: 13,
    slug: '/dr-abhirami-ravindran',
    briefProfile:
      "Well experienced from a high volume centre in oncoanesthesia, liver transplant (350 cases), HIPEC (500 cases), neuro and robotic cases (5000 DaVinci/CMR, 500 MAKO). Faculty for segmental spinal anesthesia with ERAS protocol focus.",
    expertiseHighlights: ['Oncoanesthesia', 'Transplant anesthesia', 'Robotic anesthesia', 'Neuro anesthesia'],
    professionalAffiliations: [
      { heading: 'IMA', description: 'Indian Medical Association', image: AFF + 'IMA.png' },
      { heading: 'ISA', description: 'Indian Society of Anaesthesiologists', image: AFF + 'ISA.jpg' },
      { heading: 'ISSP', description: 'Indian Society for Study of Pain', image: AFF + 'ISSP.png' },
    ],
    publications: [
      'Segmental spinal anesthesia in morbidly obese patient with lung disorder',
      "Segmental spinal in Whipple's patient with enhanced recovery",
    ],
  },
  {
    id: 'dr-raveendra-reddy',
    name: 'Dr. Raveendra Reddy',
    img: IMG + 'Dr. Ravindhra Reddy-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-raveendra-reddy.png',
    alt: 'Dr. Raveendra Reddy | Critical Care Specialist | Vasavi Hospitals Bangalore',
    title: 'Consultant Critical Care Specialist',
    department: 'Critical Care',
    qualifications: 'MBBS, FCCS',
    experienceYears: 16,
    slug: '/dr-raveendra-reddy',
    briefProfile:
      'Work as a team, enthusiastic and motivated, good communication skills, confident and competent doctor aware of limitations and safe practice.',
    expertiseHighlights: ['Sepsis', 'ARDS', 'Critical care illnesses'],
    professionalAffiliations: [
      { heading: 'KMC', description: 'Karnataka Medical Council', image: AFF + 'KMC.jpg' },
      { heading: 'GMC', description: 'General Medical Council', image: AFF + 'GMC.png' },
      { heading: 'ISCCM', description: 'Indian Society of Critical Care Medicine', image: AFF + 'ISCCM.png' },
    ],
    publications: [
      'Acknowledgement by Cancyte team in Immunologic Research',
      'Correspondence published in Anaesthesia journal (UK)',
      'Poster presentation at 15th Annual Scientific Meeting of British Society of Orthopaedic Anaesthetists',
    ],
  },
  {
    id: 'dr-ramesh-hanumegowda',
    name: 'Dr. Ramesh Hanumegowda',
    img: IMG + 'dr-ramesh-hanumegowda-urologist-transparent.png',
    imgDetail: IMG + 'new-doc-images/dr-ramesh-hanumegowda.png',
    alt: 'Dr. Ramesh Hanumegowda | Urologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Urologist',
    department: 'Urology',
    qualifications: 'MBBS, MS, MCh Urology',
    experienceYears: 15,
    slug: '/dr-ramesh-hanumegowda',
    briefProfile:
      'Dr Ramesh Hanumegowda is an eminent urologist with over 15 years of surgical experience. MBBS, MS (Gen Surgery), MCH Urology from Institute of Nephrourology Bengaluru. Special interest in urethral reconstruction and certified Da Vinci robotic surgeon.',
    expertiseHighlights: ['Endourology', 'Robotic urology', 'Uro oncology', 'Kidney transplant', 'Reconstructive urology'],
    professionalAffiliations: [
      { heading: 'USI', description: 'Urology Society of India', image: AFF + 'USI.png' },
      { heading: 'KUA', description: 'Karnataka Urology Association', image: AFF + 'KUA.png' },
      { heading: 'ASU', description: 'Association of Southern Urology', image: AFF + 'ASU.webp' },
      { heading: 'BUS', description: 'Bangalore Urology Society', image: AFF + 'BUS.png' },
    ],
  },
  {
    id: 'dr-sudeep-putta-manohar',
    name: 'Dr. Sudeep Putta Manohar',
    img: IMG + 'new-doc-images/dr-male-vector.png',
    alt: 'Dr. Sudeep Putta Manohar | Endocrinologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Endocrinologist',
    department: 'Endocrinology',
    qualifications: 'MBBS, MRCP (UK)',
    experienceYears: 15,
    slug: '/dr-sudeep-putta-manohar',
    expertiseHighlights: [
      'Diabetes',
      'Thyroid disorders',
      'PCOS',
      'Osteoporosis',
      'Adrenal diseases',
      'Pituitary disorders',
      'Gonadal disorders',
    ],
  },
  {
    id: 'dr-mutharaju-k-r',
    name: 'Dr. Mutharaju K. R',
    img: IMG + 'dr-mutharaju-k-r-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-mutharaju-k-r.png',
    alt: 'Dr. Mutharaju K R | Bariatric Surgeon | Vasavi Hospitals Bangalore',
    title: 'Sr. Consultant Bariatric Surgeon',
    department: 'Bariatric Surgery',
    qualifications: 'MBBS, MS, FMBS',
    experienceYears: 23,
    slug: '/dr-mutharaju-k-r',
    briefProfile:
      'Highly skilled GI, Bariatric, Metabolic and Advanced Laparoscopic Surgeon trained at BMCRI and AFMC Pune; Fellow in Bariatric & Metabolic Surgery (Ahmedabad). Expert in laparoscopic and robotic bypass and revisional surgery for obesity and metabolic disorders.',
    expertiseHighlights: [
      'Robotic Bariatric surgery',
      'Advanced Robotic surgeries',
      'Laparoscopic Bariatric surgery',
      'Colorectal surgeries',
      'Hiatus Hernia surgery',
      'Hernia surgeries',
      'Appendix surgery',
    ],
  },
  {
    id: 'dr-sphoorthy-g-itigi',
    name: 'Dr. Sphoorthy G Itigi',
    img: IMG + 'Dr Sphoorthy G Itigi.png',
    imgDetail: IMG + 'new-doc-images/dr-sphoorthy-g-Itigi.png',
    alt: 'Dr. Sphoorthy G Itigi | ENT Surgeon | Vasavi Hospitals Bangalore',
    title: 'Consultant ENT Surgeon',
    department: 'ENT',
    qualifications: 'MBBS, DLO, DNB ENT',
    experienceYears: 8,
    slug: '/dr-sphoorthy-g-itigi',
    expertiseHighlights: [
      'Micro Ear surgeries',
      'Endoscopic Sinus Surgery',
      'Vertigo management',
      'Vocal cord surgery',
      'Thyroid surgery',
      'Tonsillectomy and Adenoidectomy',
      'Snoring and Sleep Apnea Management',
    ],
  },
  {
    id: 'dr-ramesh-t-s',
    name: 'Dr. Ramesh T. S',
    img: IMG + 'dr-ramesh-t-s-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-ramesh-t-s.png',
    alt: 'Dr. Ramesh T. S | General Surgeon | Vasavi Hospitals Bangalore',
    title: 'Sr. Consultant – Minimally Invasive Surgery',
    department: 'General Surgery',
    qualifications: 'MBBS, DNB, MRCS (UK)',
    experienceYears: 30,
    slug: '/dr-ramesh-t-s',
    briefProfile:
      'Dr. Ramesh T. S is a highly skilled and experienced Consultant in Minimal Access Surgery at Vasavi Hospitals. With a strong academic background and extensive surgical experience, he is recognized for his expertise in laparoscopic procedures involving the abdomen and non-cardiac thoracic region, with a special focus on laser anorectal surgeries. Dr. Ramesh completed his MBBS from Jagadguru Jayadeva Murugarajendra Medical College (JJMMC) in 1996, followed by DNB in General Surgery from the National Board of Examinations, New Delhi, in 2005. In the same year, he earned his MRCS (UK) from the University of Edinburgh. To further strengthen his proficiency in minimally invasive techniques, he has also obtained FMAS (Fellowship in Minimal Access Surgery) and FICS (Fellowship of the International College of Surgeons).',
    expertiseHighlights: [
      'Robotic & Minimally Invasive Surgery',
      'General & Laparoscopic Surgery',
      'Advanced Laparoscopic Procedures',
      'Laparoscopic Gynecology Surgeries',
      'Endoscopy (Upper GI & related procedures)',
      'Gastrointestinal & Colorectal Surgeries',
      'Hernia Repairs, Gallbladder & Appendectomy',
      'Trauma and Emergency Surgeries',
    ],
  },
  {
    id: 'dr-yashaswi-srikakula',
    name: 'Dr. Yashaswi Srikakula',
    img: IMG + 'dr-yashasvi-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-yashaswi-srikakula.png',
    alt: 'Dr. Yashaswi Srikakula | ENT Specialist | Vasavi Hospitals Bangalore',
    title: 'Consultant ENT',
    department: 'ENT',
    qualifications: 'MBBS, DLO',
    experienceYears: 15,
    slug: '/dr-yashaswi-srikakula',
    briefProfile:
      'Dr. Yashaswi Srikakula is a highly experienced ENT specialist with over 15 years of expertise in treating complex ear, nose, and throat conditions. She completed her MBBS at JSS Medical College, Mysore, and her post-graduate training at KIMS, Bangalore. Dr. Yashaswi specializes in microscopic ear surgery, functional endoscopic sinus surgery (FESS) and allergy treatments. She has received advanced training in anterior skull base surgery at MCV ENT Trust Hospital, Coimbatore and in allergy and immunology at the Bangalore Allergy Centre. With a focus on personalized care, Dr. Yashaswi provides comprehensive treatment for a wide range of ENT and allergy-related conditions.',
    expertiseHighlights: [
      'Chronic Rhinosinusitis & Sinus Surgery (FESS)',
      'Nasal Obstruction & Deviated Septum',
      'Allergic Rhinitis & Seasonal Allergies',
      'Immunotherapy for Allergies',
      'Nasal Polyps Treatment',
      'Autoimmune & Inflammatory Disorders (affecting ENT)',
      'Allergy Testing & Management',
      'Pediatric Rhinology & Allergy Care',
    ],
    publications: ['All India journal publications'],
  },
  {
    id: 'dr-krishna-kumar-b-r',
    name: 'Dr. Krishna Kumar B R',
    img: IMG + 'dr-krishna-kumar-b-r-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-krishna-kumar-b-r.png',
    alt: 'Dr. Krishna Kumar B R | Cardiologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Cardiologist',
    department: 'Cardiology',
    qualifications: 'MBBS, Diploma Clinical Cardiology',
    experienceYears: 17,
    slug: '/dr-krishna-kumar-b-r',
    briefProfile:
      'Dr. Krishna Kumar B. R. is a well-known cardiologist with 17 years of experience in the field of cardiology. He has worked as a specialist in different cities across India and has been associated with many reputed hospitals. Dr. Krishna Kumar B. R. has contributed to the management of numerous complex medical cases in several hospitals. He is widely recognized for his accurate diagnosis and empathetic approach to patient care. His areas of special interest include clinical cardiology, heart failure management, echocardiography (ECHO), treadmill test (TMT), CT coronary angiography (CT-CAG), cardiac MRI (C-MRI), and cardiac stress studies. He is a graduate and has also completed a diploma in Clinical Cardiology. In addition, he has actively participated in research work and various workshops under the cardiology department.',
    expertiseHighlights: [
      'Clinical Cardiology',
      'Heart Failure Management',
      'ECG, Echocardiography, TMT, C-MRI (Cardiac MRI), CT-CAG (CT Coronary Angiography)',
      'Cardiac Stress Studies',
    ],
  },
  {
    id: 'dr-sruthi-bhaskaran',
    name: 'Dr. Sruthi Bhaskaran',
    img: IMG + 'dr-sruthi-bhaskaran-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-sruthi-bhaskaran.png',
    alt: 'Dr. Sruthi Bhaskaran | Emergency Medicine | Vasavi Hospitals Bangalore',
    title: 'HOD – Emergency Medicine',
    department: 'Emergency Medicine',
    qualifications: 'MBBS, DNB Emergency Medicine',
    experienceYears: 10,
    slug: '/dr-sruthi-bhaskaran',
    briefProfile:
      'Dr. Sruthi Bhaskaran is an experienced Emergency Medicine specialist and the Head of Department – Emergency Medicine at Vasavi Hospitals. With over a decade of clinical and leadership experience, she has played a pivotal role in enhancing emergency department efficiency, improving trauma survival rates, and strengthening critical care systems. She has successfully led large multidisciplinary teams, expanded HDU capacity by 200% during the COVID-19 pandemic, reduced ER wait times, and implemented data-driven clinical protocols. Dr. Sruthi is deeply committed to patient-centered care, clinical excellence, and training the next generation of emergency care professionals.',
    expertiseHighlights: [
      'Emergency & Trauma Care',
      'Acute Critical Care Management',
      'Triage Optimization & ER Operations',
      'Trauma Protocol Development',
      'Prehospital & Point-of-Care Testing',
      'Neurological and Cardiac Emergencies',
      'Pediatric Emergency Care',
      'Crisis & Disaster Management (COVID-19 response)',
      'Medical Education & Clinical Training',
    ],
  },
  {
    id: 'dr-manjunath-p-h',
    name: 'Dr. Manjunath P H',
    img: IMG + 'dr-manjunath-p-h-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-manjunath-p-h.png',
    alt: 'Dr. Manjunath P H | Pulmonologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Pulmonologist',
    department: 'Pulmonology',
    qualifications: 'MBBS, DTCD, DNB',
    experienceYears: 17,
    slug: '/dr-manjunath-p-h',
    briefProfile:
      'Dr. Manjunath P H graduated from BMC & RI bengaluru and NH Bengaluru. He is practising in the field of pulmonology for the past 8 years. His areas of interest are Intervention Pulmonology and Interstitial lung diseases. He has performed numerous procedures in his career including bronchoscopy, pleuroscopy, EBUS and Lung biopsies. He has multiple publications in national and international journals. He has given talks on various topics in his field on various forums.',
    expertiseHighlights: [
      'Smoking Cessation Program',
      'Sleep Disorder Management',
      'Pulmonary Rehabilitation',
      'Allergy and Immunology Services',
      'Interventional Procedures',
      'Bronchoscopy',
      'Pleuroscopy',
      'EBUS',
      'Lung Biopsies',
    ],
  },
  {
    id: 'dr-akshay-masur',
    name: 'Dr. Akshay Masur',
    img: IMG + 'dr-akshay-masur-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-akshay-masur.png',
    alt: 'Dr. Akshay Masur | Internal Medicine & Gastroenterology | Vasavi Hospitals Bangalore',
    title: 'Consultant Gastroenterology',
    department: 'Gastroenterology',
    qualifications: 'MBBS, MD, DNB',
    experienceYears: 14,
    slug: '/dr-akshay-masur',
    briefProfile:
      'Dr. Akshay Masur is an internal medicine specialist with over nine years of experience in different aspects of internal medicine. Dr. Akshay Masur has graduated from the Sri Siddhartha Medical College and pursued his specialization in Internal Medicine (MD) at Dr.S N Medical College, Jodhpur, Rajasthan. Later on he has worked in multiple reputed institutions and acquired "Fellowship in Therapeutic Gastrointestinal Endoscopy" (affiliated by RGUHS) in 2017, and acquired DNB in internal medicine in 2019. He has worked as a senior resident cum fellow in BGS Global Hospital Bangalore in the Department of Gastroenterology. Currently, along with treating the illnesses in the preview of internal medicine, he also specializes in Upper GI Endoscopy and Colonoscopy (both diagnostic and therapeutic procedures) and practices at Vasavi Hospitals Bangalore as a lead consultant.',
    expertiseHighlights: [
      'Infectious Disease Treatment',
      'Men And Women Wellness Screening',
      'Emergency Medicine',
      'Medical Gastroenterology',
      'Upper GI Endoscopy (Both Diagnostic & Therapeutic)',
      'Colonoscopy',
      'Holistic Care',
      'Outpatient Department (OPD)',
      'Anemia Workup',
      'UGI Endoscopy',
      'Infections - GERD (acid reflux) and dysphagia',
      'UGI Bleed Management',
      'Esophageal Variceal Banding',
      'Liver Care - Jaundice, Hepatitis, Cirrhosis, HCC',
      'Gallbladder Stones',
      'Cholecystitis - DILI',
      'Pancreatitis - Acute & Chronic',
      'Chronic Diarrhea',
      'Bleeding Per Rectum',
      'Sigmoidoscopy',
    ],
  },
  {
    id: 'dr-revathi-natesan',
    name: 'Dr. Revathi Natesan',
    img: IMG + 'dr-revathi-natesan.png',
    imgDetail: IMG + 'new-doc-images/dr-revathi-natesan.png',
    alt: 'Dr. Revathi Natesan | Endodontist | Vasavi Hospitals Bangalore',
    title: 'Consultant Endodontist',
    department: 'Dentistry',
    qualifications: 'MDS Conservative Dentistry & Endodontics',
    experienceYears: 15,
    slug: '/dr-revathi-natesan',
    briefProfile:
      'An Endodontist that believes in the preventive, minimally invasive and integrated approaches for treating conditions of the oral cavity. Dedicated to providing comprehensive dental care with a focus on patient comfort and long-term oral health.',
    expertiseHighlights: [
      'Preventive Dentistry',
      'Caries Management',
      'Dental Fillings',
      'Inlays',
      'Pulpectomy',
      'Pulpotomy',
      'Root Canal Treatment',
      'Esthetic Dentistry',
      'Dental Crowns',
      'Bridges',
      'Post & Core',
      'Minimally Invasive Dentistry',
      'General Dentistry',
    ],
  },
  {
    id: 'dr-mohan-ram-p',
    name: 'Dr. Mohan Ram. P',
    img: IMG + 'dr-mohan-ram- p-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-mohan-ram-p.png',
    alt: 'Dr. Mohan Ram. P | Laparoscopic General Surgeon | Vasavi Hospitals Bangalore',
    title: 'Consultant Laparoscopic & General Surgeon | Laser Proctologist',
    department: 'General Surgery',
    qualifications: 'MBBS, MS (General Surgery), FIAGES, FALS',
    experienceYears: 15,
    slug: '/dr-mohan-ram-p',
    briefProfile:
      'Dr. Mohan Ram is a General Surgeon, Laparoscopic Surgeon, Vascular Surgeon, Proctologist and Laser Specialist practicing at Vasavi Hospitals, Bangalore. He completed his MBBS from Raja Rajeshwari Medical College & Hospital, Bangalore in 2011 and MS (General Surgery) from PES Institute of Medical Sciences and Research, Kuppam in 2017. With over 14 years of experience, he ensures patients receive quality, timely treatment, focusing on patient comfort, quick recovery and state-of-the-art surgical practices. He has also earned prestigious fellowships, including FIAGES (2019) - Fellowship of the Indian Association of Gastrointestinal Endo Surgeons and FALS (2024) - Fellowship in Advanced Laparoscopic Surgery, reflecting his expertise in advanced surgical care.',
    expertiseHighlights: [
      'Hernia Repairs & GI Endoscopies',
      'Laparoscopic & Open General Surgeries',
      'Varicose Vein & Colorectal Surgeries',
      'Laser Proctology (Piles, Fissures, Fistula)',
      'Emergency Trauma & Critical Care Surgeries',
    ],
  },
  {
    id: 'dr-sridhar-srinivasan-g',
    name: 'Dr. Sridhar Srinivasan G',
    img: IMG + 'dr-sridhar-srinivasan-g.png',
    imgDetail: IMG + 'new-doc-images/dr-sridhar-srinivasan-g.png',
    alt: 'Dr. Sridhar Srinivasan G | Internal Medicine | Vasavi Hospitals Bangalore',
    title: 'Consultant Internal Medicine',
    department: 'Internal Medicine',
    qualifications: 'MBBS, MD',
    experienceYears: 0,
    slug: '',
  },
  {
    id: 'dr-sivacharan-p-v',
    name: 'Dr. Sivacharan P. V',
    img: IMG + 'dr-shivacharan-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-sivacharan-p-v.png',
    alt: 'Dr. Sivacharan P. V | Medical Oncologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Medical Oncology',
    department: 'Oncology',
    qualifications:
      'MBBS, MRCP (UK) & MRCP (Medical Oncology) with CCT - Royal Colleges of Physicians, UK; ICH-GCP Certified.',
    experienceYears: 18,
    slug: '/dr-sivacharan-p-v',
    expertiseHighlights: [
      'Clinical Oncology',
      'Immunotherapy & Targeted Therapy',
      'Lung Cancer Treatment',
      'Breast Cancer Treatment',
      'Ovarian Cancer Management',
      'Lymphoma Management',
      'Cancer Screening & Preventive Oncology',
    ],
  },
  {
    id: 'dr-hamsa-b-t',
    name: 'Dr. Hamsa B T',
    img: IMG + 'dr-hamsa-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-hamsa-b-t.png',
    alt: 'Dr. Hamsa B T | Neurologist | Vasavi Hospitals Bangalore',
    title: 'Consultant - Neurology',
    department: 'Neurology',
    qualifications: 'MBBS, MD (General Medicine), DM (Neurology)',
    experienceYears: 7,
    slug: '/dr-hamsa-b-t',
    expertiseHighlights: [
      'Neurology (Adult Neurological Disorders)',
      'Stroke management',
      'Epilepsy & seizure disorders',
      'Neurocritical care',
      'Headache & migraine management',
      'Movement disorders',
      'Neuromuscular disorders',
      'General medicine & emergency care',
      'ICU & critical care procedures',
      'Lumbar puncture, intubation',
      'Dementia and sleep disorders Management',
      'Multiple Sclerosis and other immune mediated diseases',
      'Ataxia',
      'Low backache and neck pain',
      'Botulinum toxin injection for blepharospasm and hemifacial spasm',
    ],
  },
  {
    id: 'dr-rashmi-ag',
    name: 'Dr. Rashmi A.G.',
    img: IMG + 'dr-rashmi-a-g-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-rashmi-a-g.png',
    alt: 'Dr. Rashmi A.G. | Obstetrician & Gynaecologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Obstetrician and Gynaecologist',
    department: 'Obstetrics & Gynecology',
    qualifications: 'MBBS, MS (Obstetrics & Gynaecology), FIGE (Fellowship in Gynaec Endoscopy)',
    experienceYears: 19,
    slug: '/dr-rashmi-ag',
    expertiseHighlights: [
      'High-Risk Pregnancy Management',
      'Infertility Evaluation & Treatment',
      'Laparoscopic & Hysteroscopic Surgeries',
      'Vaginal & Open Gynaecological Surgeries',
      'Endometriosis Management',
      'Ultrasound & Foetal Monitoring',
      "Women's Health & Preventive Gynaecology",
    ],
  },
  {
    id: 'dr-rohini-s',
    name: 'Dr. Rohini S',
    img: IMG + 'dr-rohini-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-rohini-s.png',
    alt: 'Dr. Rohini S | Urologist | Vasavi Hospitals Bangalore',
    title: 'Jr. Consultant - Urologist',
    department: 'Urology',
    qualifications: 'MBBS, MS (General Surgery), M.Ch (Urology)',
    experienceYears: 8,
    slug: '/dr-rohini-s',
    expertiseHighlights: [
      'Endourology',
      'Laparoscopic Urology',
      'Reconstructive Urology',
      'Uro-oncology (basic exposure)',
      'Renal Transplant Care',
      'Management of Kidney Stones (RIRS, ureteric stones)',
      'Minimally Invasive Urological Procedures',
      'Urogynecology and Female urology',
      'Management of urinary incontinence & pelvic floor disorders.',
    ],
  },
  {
    id: 'dr-sarvajith-s-s',
    name: 'Dr. Sarvajith S S',
    img: IMG + 'dr-sarvajith-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-sarvajith-s-s.png',
    alt: 'Dr. Sarvajith S S | Orthopedic Surgeon | Vasavi Hospitals Bangalore',
    title: 'Consultant Orthopaedics',
    department: 'Orthopedics',
    qualifications:
      'MBBS | MS (Orthopaedics), FRGUHS (Sanjay Gandhi Institute of Trauma), Fellowship in Arthroscopy & Sports Medicine, Fellowship in Advanced Trauma - First team doctor, Bangaluru FC',
    experienceYears: 10,
    slug: '/dr-sarvajith-s-s',
    expertiseHighlights: [
      'Sports Injury Management',
      'Arthroscopy & Ligament Reconstruction',
      'Knee & Shoulder Arthroscopy',
      'Advanced Trauma & Fracture Care',
      'Cartilage Restoration & PRP Therapy',
      'Hip, Ankle & Elbow Arthroscopy',
      'Polytrauma & Sports Rehabilitation',
    ],
  },
  {
    id: 'dr-vivek-kumar-n-savsani',
    name: 'Dr. Vivek Kumar N Savsani',
    img: IMG + 'dr-vivek-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-vivek-kumar-n-savsani.png',
    alt: 'Dr. Vivek Kumar N Savsani | Orthopedic Surgeon | Vasavi Hospitals Bangalore',
    title: 'Consultant Orthopaedic Surgeon & Joint Replacement Specialist',
    department: 'Orthopedics',
    qualifications: 'MBBS, MS (Orthopaedics), Fellowship in Joint Replacement',
    experienceYears: 15,
    slug: '/dr-vivek-kumar-n-savsani',
    expertiseHighlights: [
      'Joint Replacement Surgery',
      'Total Knee Replacement',
      'Robotic Knee Replacement',
      'Hip Replacement Surgery',
      'Trauma & Fracture Management',
      'Arthroscopy',
      'Sports Injury Management',
      'Foot & Ankle Disorders',
      'Shoulder Disorders & Arthroplasty',
      'Complex Orthopaedic Trauma Care',
    ],
  },
  {
    id: 'dr-balakrishna-g-t',
    name: 'Dr. Balakrishna G T',
    img: IMG + 'dr-balakrishna-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-balakrishna-g-t.png',
    alt: 'Dr. Balakrishna G T | Interventional Cardiologist | Vasavi Hospitals Bangalore',
    title: 'Consultant Interventional Cardiologist',
    department: 'Cardiology',
    qualifications: 'MBBS | MD General Medicine, DM Cardiology',
    experienceYears: 7,
    slug: '/dr-balakrishna-g-t',
    expertiseHighlights: [
      'Coronary Angiography',
      'Coronary Angioplasty (PCI)',
      'Acute Coronary Syndrome Management',
      'Heart Failure Management',
      'Arrhythmia Management',
      'Valvular Heart Disease',
      '2D Echocardiography',
      'Treadmill Test (TMT)',
      'Holter Monitoring Interpretation',
      'Temporary Pacemaker Insertion',
      'Pericardiocentesis',
      'Cardiac ICU & CCU Care',
      'Structural Heart Interventions',
    ],
  },
  {
    id: 'dt-rashmi',
    name: 'Dt. Rashmi',
    img: IMG + 'dr-rashmi-r-sq.png',
    imgDetail: IMG + 'new-doc-images/dt-rashmi.png',
    alt: 'Dt. Rashmi | Senior Dietitian | Vasavi Hospitals Bangalore',
    title: 'Consultant - Senior Dietitian',
    department: 'Nutrition',
    qualifications: 'M. Sc in Food and Nutrition, Certified Diabetes Educator',
    experienceYears: 10,
    slug: '',
  },
  {
    id: 'dr-sachin-jadhav',
    name: 'Dr. Sachin Jadhav',
    img: IMG + 'sachin-jadhav-sq.png',
    imgDetail: IMG + 'new-doc-images/dr-sachin-jadhav.png',
    alt: 'Dr. Sachin Jadhav | Hematologist | Vasavi Hospitals Bangalore',
    title: 'Consultant - Hematology & Bone Marrow Transplant (BMT)',
    department: 'Hematology',
    qualifications: 'MBBS, MD, DM (Clinical Hematology), Chairman - International Hematology Consortium',
    experienceYears: 20,
    slug: '/dr-sachin-jadhav',
    briefProfile:
      'Dr. Sachin Jadhav is now practicing at Vasavi Hospitals, as well as the Director of Hematology and Bone Marrow Transplantation (BMT) at Trustwell Hospitals Pvt Ltd. With extensive experience in founding and managing BMT centers, he has successfully established 14 such centers since 2013. Additionally, Dr. Jadhav serves as the CEO of Chiron Cancer, where he focuses on creating accessible cancer and BMT facilities across multiple countries. He plays an active role in several prestigious professional organizations, including ASTCT, ASH, and AAAS, and holds various leadership positions such as International Ambassador for the CGC.',
    expertiseHighlights: [
      'Bone Marrow Transplantation (Autologous & Allogeneic)',
      'Treatment of Leukemia',
      'Lymphoma Management',
      'Multiple Myeloma Treatment',
      'Aplastic Anaemia Management',
      'Myelodysplastic Syndromes (MDS)',
      'Hematologic Malignancies',
      'Stem Cell Transplantation',
      'Management of Complex Blood Disorders',
      'Development and Leadership of Hematology & BMT Centres',
      'Cancer Genomics',
      'Graft-versus-Host Disease (GVHD)',
      'Infections in Hematologic Malignancies',
      'Febrile Neutropenia Management',
      'Clinical Research in Hematology and Transplant Medicine',
    ],
  },
];
