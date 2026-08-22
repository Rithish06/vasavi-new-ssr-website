import { RenderMode, ServerRoute } from '@angular/ssr';
import { DOCTORS } from './data/doctors.data';

export const serverRoutes: ServerRoute[] = [
  // The doctor-detail page's ":doctorSlug" param can't be prerendered by
  // the blanket "**" rule below on its own — a parameterized route needs
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
