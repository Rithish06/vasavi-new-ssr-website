import { RenderMode, ServerRoute } from '@angular/ssr';
import { DOCTORS } from './data/doctors.data';

export const serverRoutes: ServerRoute[] = [
  // Ported legacy pages (see app.routes.ts) touch window/document directly
  // and were written against the old CSR project's assumptions - they were
  // never built to be prerendered. RenderMode.Client skips SSR/prerendering
  // for these specific paths so the build doesn't crash, and they render
  // purely client-side (same behavior as the old CSR site) instead.
  { path: 'cardiology-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'ent-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'nephrology-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'obstetrics-and-gynaecology-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'oncology-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'orthopedic-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'lung-specialist-in-bangalore', renderMode: RenderMode.Client },
  { path: 'urology-hospital-in-bangalore', renderMode: RenderMode.Client },

  // -- Family B --
  { path: 'anesthesiology-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'bariatric-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'dental-clinic-in-bangalore', renderMode: RenderMode.Client },
  { path: 'dermatology-skin-clinic-in-bangalore', renderMode: RenderMode.Client },
  { path: 'diabetes-and-endocrinology-center-in-bangalore', renderMode: RenderMode.Client },
  { path: 'emergency-and-critical-care-in-bangalore', renderMode: RenderMode.Client },
  { path: 'internal-medicine-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'liver-hpb-care-center-in-bangalore', renderMode: RenderMode.Client },
  { path: 'gastroenterology-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'medical-oncology-cancer-treatment-in-bangalore', renderMode: RenderMode.Client },
  { path: 'minimally-invasive-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'neonatology-and-nicu-care-in-bangalore', renderMode: RenderMode.Client },
  { path: 'neurology-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'neurosurgery-specialist-in-bangalore', renderMode: RenderMode.Client },
  { path: 'nutrition-and-dietetics-consultation-in-bangalore', renderMode: RenderMode.Client },
  { path: 'eye-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'oral-and-maxillofacial-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'pediatric-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'physiotherapy-center-in-bangalore', renderMode: RenderMode.Client },
  { path: 'plastic-and-reconstructive-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'psychiatry-and-mental-health-in-bangalore', renderMode: RenderMode.Client },
  { path: 'radiology-and-imaging-services-in-bangalore', renderMode: RenderMode.Client },
  { path: 'surgical-gastroenterology-in-bangalore', renderMode: RenderMode.Client },
  { path: 'vascular-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'surgical-oncology-cancer-hospital-in-bangalore', renderMode: RenderMode.Client },

  // -- Surgery packages --
  { path: 'hernia-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'total-knee-replacement-in-bangalore', renderMode: RenderMode.Client },
  { path: 'total-hip-replacement-in-bangalore', renderMode: RenderMode.Client },
  { path: 'gallbladder-removal-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'appendectomy-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'hysterectomy-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'sinus-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'adenoid-removal-in-bangalore', renderMode: RenderMode.Client },
  { path: 'acl-reconstruction-in-bangalore', renderMode: RenderMode.Client },
  { path: 'fistula-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'turp-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'piles-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'tonsillectomy-surgery-in-bangalore', renderMode: RenderMode.Client },
  { path: 'ovarian-cystectomy-in-bangalore', renderMode: RenderMode.Client },
  { path: 'fibroid-removal-in-bangalore', renderMode: RenderMode.Client },
  { path: 'ct-angiography-in-bangalore', renderMode: RenderMode.Client },
  { path: 'coronary-angiography-in-bangalore', renderMode: RenderMode.Client },

  { path: 'cghs-hospital-in-bangalore', renderMode: RenderMode.Client },
  { path: 'health-package/:slug', renderMode: RenderMode.Client },

  // The doctor-detail page's ":doctorSlug" param can't be prerendered by
  // the blanket "**" rule below on its own - a parameterized route needs
  // getPrerenderParams to tell the build which concrete slugs exist.
  // Without this, each doctor's page would either fail the build or 404 at
  // request time, the same class of bug the homepage hit when app.routes.ts
  // had no explicit "" route. Doctors with no slug yet (empty string) are
  // skipped since they have no real URL to prerender.
  {
    path: ':doctorSlug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return DOCTORS.filter((doctor) => doctor.slug).map((doctor) => ({
        doctorSlug: doctor.slug.replace(/^\//, ''),
      }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
