import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { QuickAppointmentBooking } from '../../components/quick-appointment-booking/quick-appointment-booking';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [QuickAppointmentBooking],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutPage {
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly showBookingModal = signal(false);

  bookAppointment(): void {
    this.showBookingModal.set(true);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeBookingModal(): void {
    this.showBookingModal.set(false);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  @HostListener('window:keydown', ['$event'])
  protected onWindowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showBookingModal()) {
      this.closeBookingModal();
    }
  }

  scrollToSection(id: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = document.getElementById(id);
    if (!target) return;
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  }
}
