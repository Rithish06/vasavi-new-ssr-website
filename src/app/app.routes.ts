import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
    title: 'Vasavi Hospitals - We Cure With Care',
  },
  {
    path: 'doctors',
    loadComponent: () => import('./pages/doctors/doctors').then((m) => m.DoctorsPage),
    title: 'Find a Doctor - Vasavi Hospitals',
  },

  // ============================================================
  // Ported legacy pages (literal port from the old CSR project -
  // see src/app/<name>/ for each). Routes/paths match the old
  // project's SEO-friendly slugs exactly so existing external links
  // and search rankings keep working. Each of these also needs a
  // matching entry in app.routes.server.ts (RenderMode.Client) since
  // these components touch window/document directly and were not
  // written to be prerendered.
  // ============================================================

  // -- Family A (cardiology, ent, nephrology, obstetrics-gynaecology,
  //    oncology, orthopedic, pulmonology, urology) --
  {
    path: 'cardiology-hospital-in-bangalore',
    loadComponent: () => import('./cardiology/cardiology').then((m) => m.Cardiology),
  },
  {
    path: 'ent-hospital-in-bangalore',
    loadComponent: () => import('./ent/ent').then((m) => m.Ent),
  },
  {
    path: 'nephrology-hospital-in-bangalore',
    loadComponent: () => import('./nephrology/nephrology').then((m) => m.Nephrology),
  },
  {
    path: 'obstetrics-and-gynaecology-hospital-in-bangalore',
    loadComponent: () =>
      import('./obstetrics-gynaecology/obstetrics-gynaecology').then((m) => m.ObstetricsGynaecology),
  },
  {
    path: 'oncology-hospital-in-bangalore',
    loadComponent: () => import('./oncology/oncology').then((m) => m.Oncology),
  },
  {
    path: 'orthopedic-hospital-in-bangalore',
    loadComponent: () => import('./orthopedic/orthopedic').then((m) => m.Orthopedic),
  },
  {
    path: 'lung-specialist-in-bangalore',
    loadComponent: () => import('./pulmonology/pulmonology').then((m) => m.Pulmonology),
  },
  {
    path: 'urology-hospital-in-bangalore',
    loadComponent: () => import('./urology/urology').then((m) => m.Urology),
  },

  // -- Family B (simple ContactFom/SubNavbar/Cta template pages) --
  {
    path: 'anesthesiology-hospital-in-bangalore',
    loadComponent: () => import('./anesthesiology/anesthesiology').then((m) => m.Anesthesiology),
  },
  {
    path: 'bariatric-surgery-in-bangalore',
    loadComponent: () => import('./bariatricsurgery/bariatricsurgery').then((m) => m.Bariatricsurgery),
  },
  {
    path: 'dental-clinic-in-bangalore',
    loadComponent: () => import('./dentistry/dentistry').then((m) => m.Dentistry),
  },
  {
    path: 'dermatology-skin-clinic-in-bangalore',
    loadComponent: () => import('./dermatology/dermatology').then((m) => m.Dermatology),
  },
  {
    path: 'diabetes-and-endocrinology-center-in-bangalore',
    loadComponent: () => import('./diabetes-endocrinology/diabetes-endocrinology').then((m) => m.DiabetesEndocrinology),
  },
  {
    path: 'emergency-and-critical-care-in-bangalore',
    loadComponent: () => import('./emergency-critical-care/emergency-critical-care').then((m) => m.EmergencyCriticalCare),
  },
  {
    path: 'internal-medicine-hospital-in-bangalore',
    loadComponent: () => import('./internal-medicine/internal-medicine').then((m) => m.InternalMedicine),
  },
  {
    path: 'liver-hpb-care-center-in-bangalore',
    loadComponent: () => import('./liver-hpb-care/liver-hpb-care').then((m) => m.LiverHpbCare),
  },
  {
    path: 'gastroenterology-hospital-in-bangalore',
    loadComponent: () => import('./medical-gastroenterology/medical-gastroenterology').then((m) => m.MedicalGastroenterology),
  },
  {
    path: 'medical-oncology-cancer-treatment-in-bangalore',
    loadComponent: () => import('./medical-oncology/medical-oncology').then((m) => m.MedicalOncology),
  },
  {
    path: 'minimally-invasive-surgery-in-bangalore',
    loadComponent: () => import('./minimally-invasive-surgery/minimally-invasive-surgery').then((m) => m.MinimallyInvasiveSurgery),
  },
  {
    path: 'neonatology-and-nicu-care-in-bangalore',
    loadComponent: () => import('./neonatology/neonatology').then((m) => m.Neonatology),
  },
  {
    path: 'neurology-hospital-in-bangalore',
    loadComponent: () => import('./neurology/neurology').then((m) => m.Neurology),
  },
  {
    path: 'neurosurgery-specialist-in-bangalore',
    loadComponent: () => import('./neurosurgery/neurosurgery').then((m) => m.Neurosurgery),
  },
  {
    path: 'nutrition-and-dietetics-consultation-in-bangalore',
    loadComponent: () => import('./nutrition-dietetics/nutrition-dietetics').then((m) => m.NutritionDietetics),
  },
  {
    path: 'eye-hospital-in-bangalore',
    loadComponent: () => import('./opthalmology/opthalmology').then((m) => m.Opthalmology),
  },
  {
    path: 'oral-and-maxillofacial-surgery-in-bangalore',
    loadComponent: () => import('./oral-maxillofacial-surgery/oral-maxillofacial-surgery').then((m) => m.OralMaxillofacialSurgery),
  },
  {
    path: 'pediatric-hospital-in-bangalore',
    loadComponent: () => import('./pediatrics/pediatrics').then((m) => m.Pediatrics),
  },
  {
    path: 'physiotherapy-center-in-bangalore',
    loadComponent: () => import('./physiotherapy/physiotherapy').then((m) => m.Physiotherapy),
  },
  {
    path: 'plastic-and-reconstructive-surgery-in-bangalore',
    loadComponent: () => import('./plastic-surgery/plastic-surgery').then((m) => m.PlasticSurgery),
  },
  {
    path: 'psychiatry-and-mental-health-in-bangalore',
    loadComponent: () => import('./psychiatry/psychiatry').then((m) => m.Psychiatry),
  },
  {
    path: 'radiology-and-imaging-services-in-bangalore',
    loadComponent: () => import('./radiology/radiology').then((m) => m.Radiology),
  },
  {
    path: 'surgical-gastroenterology-in-bangalore',
    loadComponent: () => import('./surgical-gastroenterology/surgical-gastroenterology').then((m) => m.SurgicalGastroenterology),
  },
  {
    path: 'vascular-surgery-in-bangalore',
    loadComponent: () => import('./vascular-science/vascular-science').then((m) => m.VascularScience),
  },
  {
    path: 'surgical-oncology-cancer-hospital-in-bangalore',
    loadComponent: () => import('./surgical-oncology/surgical-oncology').then((m) => m.SurgicalOncology),
  },

  // -- Surgery packages (17 PPC landing pages) --
  {
    path: 'hernia-surgery-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/hernia/hernia.component').then((m) => m.HerniaComponent),
  },
  {
    path: 'total-knee-replacement-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/robotic-tkr/robotic-tkr.component').then((m) => m.RoboticTkrComponent),
  },
  {
    path: 'total-hip-replacement-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/robotic-thr/robotic-thr.component').then((m) => m.RoboticThrComponent),
  },
  {
    path: 'gallbladder-removal-surgery-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/robotic-cholecystectomy/robotic-cholecystectomy.component').then(
        (m) => m.RoboticCholecystectomyComponent,
      ),
  },
  {
    path: 'appendectomy-surgery-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/robotic-appendectomy/robotic-appendectomy').then((m) => m.RoboticAppendectomy),
  },
  {
    path: 'hysterectomy-surgery-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/robotic-hysterectomy/robotic-hysterectomy').then((m) => m.RoboticHysterectomy),
  },
  {
    path: 'sinus-surgery-in-bangalore',
    loadComponent: () => import('./surgery-packages/sinus-surgery/sinus-surgery').then((m) => m.SinusSurgery),
  },
  {
    path: 'adenoid-removal-in-bangalore',
    loadComponent: () => import('./surgery-packages/adenoid-removal/adenoid-removal').then((m) => m.AdenoidRemoval),
  },
  {
    path: 'acl-reconstruction-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/acl-reconstructio/acl-reconstructio').then((m) => m.ACLReconstructio),
  },
  {
    path: 'fistula-surgery-in-bangalore',
    loadComponent: () => import('./surgery-packages/fistula-surgery/fistula-surgery').then((m) => m.FistulaSurgery),
  },
  {
    path: 'turp-surgery-in-bangalore',
    loadComponent: () => import('./surgery-packages/prostate-removal/prostate-removal').then((m) => m.ProstateRemoval),
  },
  {
    path: 'piles-surgery-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/haemorrhoidectomy/haemorrhoidectomy').then((m) => m.Haemorrhoidectomy),
  },
  {
    path: 'tonsillectomy-surgery-in-bangalore',
    loadComponent: () => import('./surgery-packages/tonsillectomy/tonsillectomy').then((m) => m.Tonsillectomy),
  },
  {
    path: 'ovarian-cystectomy-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/ovarian-cystectomy/ovarian-cystectomy').then((m) => m.OvarianCystectomy),
  },
  {
    path: 'fibroid-removal-in-bangalore',
    loadComponent: () => import('./surgery-packages/fibroid-removal/fibroid-removal').then((m) => m.FibroidRemoval),
  },
  {
    path: 'ct-angiography-in-bangalore',
    loadComponent: () => import('./surgery-packages/ct-angiography/ct-angiography').then((m) => m.CTAngiography),
  },
  {
    path: 'coronary-angiography-in-bangalore',
    loadComponent: () =>
      import('./surgery-packages/coronary-angiography/coronary-angiography').then((m) => m.CoronaryAngiography),
  },

  // -- Schemes --
  {
    path: 'cghs-hospital-in-bangalore',
    loadComponent: () => import('./cghs/cghs').then((m) => m.Cghs),
  },

  // -- Health checkup packages (one component, param-driven by slug) --
  // "/health-package" (no slug) is the packages hub/landing page - it must
  // be declared ABOVE "health-package/:slug" so this exact one-segment path
  // isn't shadowed... it can't be (":slug" requires two segments), but it's
  // kept here for readability, right next to the family of routes it hubs.
  {
    path: 'health-package',
    loadComponent: () =>
      import('./pages/health-package/health-package').then((m) => m.HealthPackagePage),
    title: 'Comprehensive Health Check Packages - Vasavi Hospitals',
  },
  {
    path: 'health-package/:slug',
    loadComponent: () =>
      import('./health-package/health-check/health-check').then((m) => m.HealthCheck),
  },

  // -- Awards & Recognition --
  {
    path: 'awards',
    loadComponent: () => import('./pages/awards/awards').then((m) => m.AwardsPage),
    title: 'Awards & Recognition - Vasavi Hospitals',
  },

  // -- Photo Gallery --
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery').then((m) => m.GalleryPage),
    title: 'Photo Gallery - Vasavi Hospitals',
  },

  // -- Contact Us --
  {
    path: 'contact-us',
    loadComponent: () => import('./pages/contact-us/contact-us').then((m) => m.ContactUs),
    title: 'Contact Us - Vasavi Hospitals',
  },

  {
    path: 'about-us',
    loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage),
    title: 'About Us — Vasavi Hospitals',
  },
  // Individual doctor profile pages live at a top-level slug (e.g.
  // "/dr-ashok-m-v"), matching the `slug` values in the doctor data and the
  // "View Profile" links on the doctors listing page. This wildcard ":slug"
  // route must stay LAST - any future named route (about-us, gallery, etc.)
  // has to be added above it, or this will swallow that path first and the
  // named route will never match.
  {
    path: ':doctorSlug',
    loadComponent: () => import('./pages/doctor-detail/doctor-detail').then((m) => m.DoctorDetailPage),
    title: 'Doctor Profile - Vasavi Hospitals',
  },
];
