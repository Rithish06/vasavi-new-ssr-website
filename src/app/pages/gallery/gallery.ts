import { Component, HostListener, computed, signal } from '@angular/core';
import { DoctorsIcon } from '../doctors/doctors-icon';

type CategoryKey =
  | 'facility'
  | 'emergency'
  | 'ot'
  | 'diagnostics'
  | 'specialty'
  | 'rooms';

interface GalleryCategory {
  key: CategoryKey;
  label: string;
}

interface GalleryPhoto {
  src: string;
  title: string;
  category: CategoryKey;
}

const CATEGORIES: GalleryCategory[] = [
  { key: 'facility', label: 'Facility & Reception' },
  { key: 'emergency', label: 'Emergency & Critical Care' },
  { key: 'ot', label: 'Operation Theatres' },
  { key: 'diagnostics', label: 'Diagnostics & Imaging' },
  { key: 'specialty', label: 'Specialty Clinics' },
  { key: 'rooms', label: 'Patient Rooms & Wards' },
];

/**
 * Gallery ("/gallery") - a photo tour of the hospital built from the actual
 * facility photography in public/Images/gallery.
 *
 * The source filenames in that folder were unreliable in two ways: many
 * didn't match their own photo at all (e.g. the file named
 * "mri-scan-machine-bangalore.jpg" is actually a CT scanner; the one named
 * "sterilization-unit-bangalore.jpg" is actually the dental clinic), and
 * several used camera-roll names (IMG_3406.jpg) or literal "%20"/"&"
 * characters in the filename instead of real spaces. Every title below was
 * assigned after visually reviewing the photo itself, and every file used
 * here was renamed on disk to a descriptive, hyphenated, keyword-rich
 * filename ("vasavi-hospitals-bangalore-<what's-in-the-photo>") for image
 * SEO - matching what the photo actually shows, not the old name. A
 * handful of exact duplicate files (byte-identical, saved under two names)
 * and one logo-only graphic were left out of the list entirely.
 */
const PHOTOS: GalleryPhoto[] = [
  // -- Facility & Reception --
  { src: '/Images/gallery/vasavi-hospitals-bangalore-hospital-building-aerial-view.jpg', title: 'Vasavi Hospitals, Bangalore', category: 'facility' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-main-entrance.jpg', title: 'Main Entrance', category: 'facility' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-reception-desk.png', title: 'Reception Desk', category: 'facility' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-24-7-pharmacy.jpg', title: '24/7 In-House Pharmacy', category: 'facility' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-opd-waiting-area.jpg', title: 'OPD Waiting Area', category: 'facility' },

  // -- Emergency & Critical Care --
  { src: '/Images/gallery/vasavi-hospitals-bangalore-ambulance-emergency-response.jpg', title: 'Ambulance & Emergency Response', category: 'emergency' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-emergency-resuscitation-bay.jpg', title: 'Emergency Resuscitation Bay', category: 'emergency' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-icu-ventilator-support.jpg', title: 'Advanced Ventilator Support', category: 'emergency' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-nicu-newborn-intensive-care.jpg', title: 'NICU - Newborn Intensive Care', category: 'emergency' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-icu-critical-care-bed.jpg', title: 'ICU - Critical Care Bed', category: 'emergency' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-dialysis-unit.jpg', title: 'Dialysis Unit', category: 'emergency' },

  // -- Operation Theatres --
  { src: '/Images/gallery/vasavi-hospitals-bangalore-operation-theatre.jpg', title: 'Operation Theatre', category: 'ot' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-operation-theatre-surgical-table.jpg', title: 'Operation Theatre - Surgical Table', category: 'ot' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-cardiac-cath-lab.jpg', title: 'Cardiac Cath Lab', category: 'ot' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-modular-operation-theatre.jpg', title: 'Modular Operation Theatre', category: 'ot' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-surgical-suite.jpg', title: 'Operation Theatre - Surgical Suite', category: 'ot' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-central-sterile-supply-unit.jpg', title: 'Central Sterile Supply Unit', category: 'ot' },

  // -- Diagnostics & Imaging --
  { src: '/Images/gallery/vasavi-hospitals-bangalore-ct-scan-machine.jpg', title: 'CT Scan', category: 'diagnostics' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-mri-scan-machine.jpg', title: 'MRI Scan', category: 'diagnostics' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-neuro-navigation-system.png', title: 'Neuro-Navigation System', category: 'diagnostics' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-laboratory-diagnostics-equipment.jpg', title: 'Advanced Laboratory Diagnostics', category: 'diagnostics' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-ophthalmology-fundus-imaging.jpg', title: 'Ophthalmology - Fundus Imaging', category: 'diagnostics' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-ophthalmology-refraction-unit.jpg', title: 'Ophthalmology - Refraction Unit', category: 'diagnostics' },

  // -- Specialty Clinics --
  { src: '/Images/gallery/vasavi-hospitals-bangalore-aesthetic-laser-treatment.jpg', title: 'Aesthetic Laser Treatment', category: 'specialty' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-dental-clinic.jpg', title: 'Dental Clinic', category: 'specialty' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-derma-care-department.jpg', title: 'Derma Care Department', category: 'specialty' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-derma-care-skin-hair-laser-services.jpg', title: 'Derma Care - Skin, Hair & Laser Services', category: 'specialty' },

  // -- Patient Rooms & Wards --
  { src: '/Images/gallery/vasavi-hospitals-bangalore-twin-sharing-room.jpg', title: 'Twin Sharing Room', category: 'rooms' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-deluxe-patient-room.jpg', title: 'Deluxe Patient Room', category: 'rooms' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-private-room.jpg', title: 'Private Room', category: 'rooms' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-twin-sharing-room-2.jpg', title: 'Twin Sharing Room', category: 'rooms' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-general-ward.jpg', title: 'General Ward', category: 'rooms' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-general-ward-2.jpg', title: 'General Ward', category: 'rooms' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-multi-bed-ward.jpg', title: 'Multi-Bed Ward', category: 'rooms' },
  { src: '/Images/gallery/vasavi-hospitals-bangalore-nurse-station.jpg', title: 'Nurse Station', category: 'rooms' },
];

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [DoctorsIcon],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class GalleryPage {
  protected readonly categories = CATEGORIES;
  protected readonly totalCount = PHOTOS.length;

  /** 'all' or a CategoryKey - drives the visible grid. */
  protected readonly activeCategory = signal<'all' | CategoryKey>('all');

  protected readonly filteredPhotos = computed(() => {
    const active = this.activeCategory();
    return active === 'all' ? PHOTOS : PHOTOS.filter((photo) => photo.category === active);
  });

  /** Index into filteredPhotos() of the photo open in the lightbox, or null when closed. */
  protected readonly lightboxIndex = signal<number | null>(null);

  protected countFor(category: CategoryKey): number {
    return PHOTOS.filter((photo) => photo.category === category).length;
  }

  protected setCategory(category: 'all' | CategoryKey): void {
    this.activeCategory.set(category);
    this.lightboxIndex.set(null);
  }

  protected openLightbox(index: number): void {
    this.lightboxIndex.set(index);
  }

  protected closeLightbox(): void {
    this.lightboxIndex.set(null);
  }

  protected showNext(): void {
    const photos = this.filteredPhotos();
    const current = this.lightboxIndex();
    if (current === null || !photos.length) return;
    this.lightboxIndex.set((current + 1) % photos.length);
  }

  protected showPrev(): void {
    const photos = this.filteredPhotos();
    const current = this.lightboxIndex();
    if (current === null || !photos.length) return;
    this.lightboxIndex.set((current - 1 + photos.length) % photos.length);
  }

  @HostListener('window:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.lightboxIndex() === null) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowRight') this.showNext();
    if (event.key === 'ArrowLeft') this.showPrev();
  }
}
