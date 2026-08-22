import {
  Component,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorsIcon } from './doctors-icon';
import { DEPARTMENTS, DOCTORS, MORE_DEPARTMENTS } from '../../data/doctors.data';

type SortKey = 'exp-desc' | 'exp-asc' | 'name-asc';
type ViewMode = 'grid' | 'list';

const FAVORITES_STORAGE_KEY = 'vasavi:favorite-doctors';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'exp-desc', label: 'Experience - High to Low' },
  { value: 'exp-asc', label: 'Experience - Low to High' },
  { value: 'name-asc', label: 'Name - A to Z' },
];

const PAGE_SIZE = 9;

@Component({
  selector: 'app-doctors-page',
  standalone: true,
  imports: [RouterLink, DoctorsIcon],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class DoctorsPage {
  private readonly platformId = inject(PLATFORM_ID);

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

  protected readonly totalDoctorCount = DOCTORS.length;

  protected readonly filteredDoctors = computed(() => {
    const query = this.searchText().trim().toLowerCase();
    const depts = this.selectedDepartments();
    const minExp = this.minExperience();

    let list = DOCTORS.filter((doc) => {
      if (query) {
        const haystack = `${doc.name} ${doc.title} ${doc.department} ${doc.qualifications}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      if (depts.size > 0 && !depts.has(doc.department)) return false;
      if (doc.experienceYears < minExp) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
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
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      try {
        const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (raw) {
          this.favorites.set(new Set(JSON.parse(raw)));
        }
      } catch {
        /* localStorage unavailable (private mode, etc.) — favorites just won't persist. */
      }
    });
  }

  /**
   * Scrolls so the search bar sits right under the sticky navbar — used
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
