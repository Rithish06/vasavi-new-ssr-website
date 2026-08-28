import {
  Component,
  HostListener,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DoctorsIcon } from './doctors-icon';
import { AppointmentBooking } from '../../components/appointment-booking/appointment-booking';
import { DEPARTMENTS, DOCTORS, MORE_DEPARTMENTS } from '../../data/doctors.data';

type SortKey = 'exp-desc' | 'exp-asc' | 'name-asc';
type ViewMode = 'grid' | 'list';

const FAVORITES_STORAGE_KEY = 'vasavi:favorite-doctors';
const FAVORITE_TIP_DISMISSED_KEY = 'vasavi:favorite-tip-dismissed';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'exp-desc', label: 'Experience - High to Low' },
  { value: 'exp-asc', label: 'Experience - Low to High' },
  { value: 'name-asc', label: 'Name - A to Z' },
];

const PAGE_SIZE = 9;

@Component({
  selector: 'app-doctors-page',
  standalone: true,
  imports: [RouterLink, DoctorsIcon, AppointmentBooking],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class DoctorsPage {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);

  protected readonly departments = DEPARTMENTS;
  protected readonly moreDepartments = MORE_DEPARTMENTS;
  protected readonly sortOptions = SORT_OPTIONS;

  protected readonly searchText = signal('');
  protected readonly selectedDepartments = signal<Set<string>>(new Set());
  protected readonly showMoreDepartments = signal(false);
  protected readonly mobileFiltersOpen = signal(false);
  protected readonly advancedOpen = signal(false);

  protected readonly minExperience = signal(0);

  protected readonly sortBy = signal<SortKey>('exp-desc');
  protected readonly viewMode = signal<ViewMode>('grid');
  protected readonly favorites = signal<Set<string>>(new Set());
  protected readonly currentPage = signal(1);

  /** The "tap the heart to save doctors" tip above the results grid - shown
   *  by default (so it's there the moment this section scrolls into view)
   *  and hidden for good once the person dismisses it, via localStorage. */
  protected readonly showFavoriteTip = signal(true);

  /** Name of the doctor whose card's "Book Appointment" button was just
   *  clicked - non-null while the booking popup is open, and is what the
   *  popup's <app-appointment-booking> instance is bound to, so the form
   *  it shows (and any eventual submission) is tied to that exact card. */
  protected readonly bookingDoctorName = signal<string | null>(null);

  protected readonly totalDoctorCount = DOCTORS.length;

  protected readonly filteredDoctors = computed(() => {
    const query = this.searchText().trim().toLowerCase();
    const depts = this.selectedDepartments();
    const minExp = this.minExperience();
    const favs = this.favorites();

    let list = DOCTORS.filter((doc) => {
      if (query) {
        const haystack = `${doc.name} ${doc.title} ${doc.department} ${doc.qualifications}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (depts.size > 0 && !depts.has(doc.department)) return false;
      if (doc.experienceYears < minExp) return false;
      return true;
    });

    // Favorited doctors always float to the top, ahead of whichever sort
    // order is selected - that ordering only breaks ties within each group
    // (favorited vs. not), so liking a doctor is what actually moves them.
    list = [...list].sort((a, b) => {
      const aFav = favs.has(a.id);
      const bFav = favs.has(b.id);
      if (aFav !== bFav) return aFav ? -1 : 1;

      switch (this.sortBy()) {
        case 'exp-desc':
          return b.experienceYears - a.experienceYears;
        case 'exp-asc':
          return a.experienceYears - b.experienceYears;
        case 'name-asc':
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  });

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredDoctors().length / PAGE_SIZE)));

  protected readonly pagedDoctors = computed(() => {
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * PAGE_SIZE;
    return this.filteredDoctors().slice(start, start + PAGE_SIZE);
  });

  protected readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  protected readonly activeFilterCount = computed(() => {
    let count = this.selectedDepartments().size;
    if (this.minExperience() > 0) count += 1;
    return count;
  });

  constructor() {
    // Picks up the "Select Department" / "Find a Doctor" quick-filter the
    // home page's booking bar hands off via "Find & Book" - read on both
    // server and client (not afterNextRender-gated) so the very first
    // render, SSR included, already reflects the filter instead of
    // flashing the unfiltered list first.
    const queryParams = this.route.snapshot.queryParamMap;
    const department = queryParams.get('department');
    const doctorName = queryParams.get('doctor');
    const search = queryParams.get('search');

    if (department && (DEPARTMENTS.includes(department) || MORE_DEPARTMENTS.includes(department))) {
      this.selectedDepartments.set(new Set([department]));
      if (MORE_DEPARTMENTS.includes(department)) this.showMoreDepartments.set(true);
    }
    if (doctorName) {
      this.searchText.set(doctorName);
    } else if (search) {
      this.searchText.set(search);
    }

    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      try {
        const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (raw) {
          this.favorites.set(new Set(JSON.parse(raw)));
        }
        if (window.localStorage.getItem(FAVORITE_TIP_DISMISSED_KEY) === 'true') {
          this.showFavoriteTip.set(false);
        }
      } catch {
        /* localStorage unavailable (private mode, etc.) - favorites just won't persist. */
      }
    });
  }

  /**
   * Scrolls so the search bar sits right under the sticky navbar - used
   * after any filter/search interaction so the person immediately sees
   * the results header instead of having to scroll up manually.
   * Reads the navbar's live height rather than a hard-coded number since
   * it changes across breakpoints (topbar hides on small screens, etc).
   */
  private scrollToSearch(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = document.getElementById('doctors-search-anchor');
    if (!target) return;
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }

  protected runSearch(): void {
    this.currentPage.set(1);
    this.scrollToSearch();
  }

  protected isFavorite(id: string): boolean {
    return this.favorites().has(id);
  }

  protected toggleFavorite(id: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const next = new Set(this.favorites());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.favorites.set(next);
    if (isPlatformBrowser(this.platformId)) {
      try {
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* ignore persistence failures */
      }
    }
  }

  protected dismissFavoriteTip(): void {
    this.showFavoriteTip.set(false);
    if (isPlatformBrowser(this.platformId)) {
      try {
        window.localStorage.setItem(FAVORITE_TIP_DISMISSED_KEY, 'true');
      } catch {
        /* ignore persistence failures */
      }
    }
  }

  /** Opens the "Book Appointment" popup for one specific doctor card - the
   *  popup hosts the exact same booking form used on that doctor's own
   *  profile page (see <app-appointment-booking>), pre-tied to their name. */
  protected openBookingModal(name: string, event: Event): void {
    event.preventDefault();
    this.bookingDoctorName.set(name);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  protected closeBookingModal(): void {
    this.bookingDoctorName.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:keydown', ['$event'])
  protected onWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.bookingDoctorName() !== null) {
      this.closeBookingModal();
    }
  }

  protected updateSearch(value: string): void {
    this.searchText.set(value);
    this.currentPage.set(1);
  }

  protected toggleDepartment(dept: string): void {
    const next = new Set(this.selectedDepartments());
    if (next.has(dept)) {
      next.delete(dept);
    } else {
      next.add(dept);
    }
    this.selectedDepartments.set(next);
    this.currentPage.set(1);
    this.scrollToSearch();
  }

  protected isDepartmentChecked(dept: string): boolean {
    return this.selectedDepartments().has(dept);
  }

  protected clearDepartments(): void {
    this.selectedDepartments.set(new Set());
    this.currentPage.set(1);
    this.scrollToSearch();
  }

  protected toggleMoreDepartments(): void {
    this.showMoreDepartments.update((v) => !v);
  }

  protected toggleMobileFilters(): void {
    this.mobileFiltersOpen.update((v) => !v);
  }

  protected closeMobileFilters(): void {
    this.mobileFiltersOpen.set(false);
  }

  protected toggleAdvanced(): void {
    this.advancedOpen.update((v) => !v);
  }

  protected setMinExperience(value: string): void {
    this.minExperience.set(Number(value) || 0);
    this.currentPage.set(1);
    this.scrollToSearch();
  }

  protected resetAllFilters(): void {
    this.searchText.set('');
    this.selectedDepartments.set(new Set());
    this.minExperience.set(0);
    this.currentPage.set(1);
    this.scrollToSearch();
  }

  protected setSortBy(value: string): void {
    this.sortBy.set(value as SortKey);
  }

  protected setViewMode(mode: ViewMode): void {
    this.viewMode.set(mode);
  }

  protected goToPage(page: number): void {
    const clamped = Math.min(Math.max(1, page), this.totalPages());
    this.currentPage.set(clamped);
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('doctors-results-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  protected prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  protected nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }
}
