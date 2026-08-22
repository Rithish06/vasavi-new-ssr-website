import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'Vasavi Hospitals — We Cure With Care',
  },
  {
    path: 'doctors',
    loadComponent: () => import('./pages/doctors/doctors').then((m) => m.DoctorsPage),
    title: 'Find a Doctor — Vasavi Hospitals',
  },
  // Individual doctor profile pages live at a top-level slug (e.g.
  // "/dr-ashok-m-v"), matching the `slug` values in the doctor data and the
  // "View Profile" links on the doctors listing page. This wildcard ":slug"
  // route must stay LAST — any future named route (about-us, gallery, etc.)
  // has to be added above it, or this will swallow that path first and the
  // named route will never match.
  {
    path: ':doctorSlug',
    loadComponent: () => import('./pages/doctor-detail/doctor-detail').then((m) => m.DoctorDetailPage),
    title: 'Doctor Profile — Vasavi Hospitals',
  },
];
