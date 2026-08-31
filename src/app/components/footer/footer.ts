import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterIcon } from './footer-icon';
import { CommonModule } from '@angular/common';

interface LinkItem {
  label: string;
  path: string;
  /** Set for links that leave the Angular app entirely (e.g. the blog,
   *  which lives outside this SPA) - the template renders these with a
   *  plain `href` (a normal page navigation) instead of `routerLink`. */
  external?: boolean;
}

interface ServiceItem extends LinkItem {
  icon: string;
}

interface ContactItem {
  icon: string;
  lines: string[];
  href?: string;
}

interface ActionCard {
  icon: string;
  title: string;
  description: string;
  ctaLabel: string;
  path?: string;
  link?: string;
  /** Hides the ctaLabel "button" row - used where there's nothing to click
   *  through to yet (e.g. no dedicated Insurance & TPA page). */
  hideCta?: boolean;
}

/** Icon keys resolved to inline SVG paths in footer.html via the [ngSwitch]-free
 *  approach below - kept as a flat lookup so the template can just do
 *  `<svg><use ...>` style repetition without a giant inline switch. */
export const FOOTER_ICONS = {
  emergency: 'emergency',
  robotic: 'robotic',
  orthopaedics: 'orthopaedics',
  cardiology: 'cardiology',
  nephrology: 'nephrology',
  gastro: 'gastro',
  women: 'women',
  diagnostics: 'diagnostics',
  pin: 'pin',
  mail: 'mail',
  phone: 'phone',
  clock: 'clock',
  ambulance: 'ambulance',
  calendar: 'calendar',
  stethoscope: 'stethoscope',
  shield: 'shield',
  clipboard: 'clipboard',
  arrow: 'arrow',
} as const;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FooterIcon, CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly quickLinks: LinkItem[] = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about-us' },
    { label: 'CGHS', path: '/cghs-hospital-in-bangalore' },
    { label: 'Awards', path: '/awards' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: 'https://vasavihospitals.com/blog/', external: true },
    { label: 'Contact Us', path: '/contact-us' },
    { label: 'Careers', path: '/careers' },
  ];

  /** Curated highlight of 8 (of the 33 ported) clinical specialty pages -
   * real routes from app.routes.ts, not a generated/guessed slug. The full
   * 33-page list lives in the navbar's "Our Services" mega-menu. */
  protected readonly services: ServiceItem[] = [
    { icon: FOOTER_ICONS.emergency, label: 'Emergency & Critical Care', path: '/emergency-and-critical-care-in-bangalore' },
    { icon: FOOTER_ICONS.robotic, label: 'Minimally Invasive Surgery', path: '/minimally-invasive-surgery-in-bangalore' },
    { icon: FOOTER_ICONS.orthopaedics, label: 'Orthopedics', path: '/orthopedic-hospital-in-bangalore' },
    { icon: FOOTER_ICONS.cardiology, label: 'Cardiology', path: '/cardiology-hospital-in-bangalore' },
    { icon: FOOTER_ICONS.nephrology, label: 'Nephrology', path: '/nephrology-hospital-in-bangalore' },
    { icon: FOOTER_ICONS.gastro, label: 'Gastroenterology', path: '/gastroenterology-hospital-in-bangalore' },
    { icon: FOOTER_ICONS.women, label: 'Obstetrics & Gynaecology', path: '/obstetrics-and-gynaecology-hospital-in-bangalore' },
    { icon: FOOTER_ICONS.diagnostics, label: 'Radiology & Imaging', path: '/radiology-and-imaging-services-in-bangalore' },
  ];

  protected readonly contactItems: ContactItem[] = [
    {
      icon: FOOTER_ICONS.pin,
      lines: ['#15, 1st Stage, 70th Cross Rd,', 'Kumaraswamy Layout,', 'Bengaluru, Karnataka 560078'],
    },
    {
      icon: FOOTER_ICONS.mail,
      lines: ['appointments@vasavihospitals.com'],
      href: 'mailto:appointments@vasavihospitals.com',
    },
    {
      icon: FOOTER_ICONS.phone,
      lines: ['080 71 500 500'],
      href: 'tel:+918071500500',
    },
    {
      icon: FOOTER_ICONS.clock,
      lines: ['24x7 Emergency Services'],
    },
  ];

  protected readonly actionCards: ActionCard[] = [
    {
      icon: FOOTER_ICONS.calendar,
      title: 'Book an Appointment',
      description: 'Schedule your visit with our specialists in just a few clicks.',
      ctaLabel: 'Book Now',
      link: 'http://115.243.85.241:650/',
    },
    {
      icon: FOOTER_ICONS.stethoscope,
      title: 'Find a Doctor',
      description: 'Search and connect with our experienced doctors.',
      ctaLabel: 'Find Now',
      path: '/doctors',
    },
    {
      icon: FOOTER_ICONS.shield,
      title: 'Insurance & TPA',
      description: 'List of empanelled insurance partners and TPA details.',
      ctaLabel: 'Know More',
      path: '/insurance-tpa',
      hideCta: true,
    },
    {
      icon: FOOTER_ICONS.clipboard,
      title: 'Health Packages',
      description: 'Explore our preventive health check-up packages.',
      ctaLabel: 'Explore Now',
      path: '/health-package',
    },
  ];

  protected readonly legalLinks: LinkItem[] = [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-and-conditions' },
    { label: 'Sitemap', path: '/sitemap' },
  ];
}
