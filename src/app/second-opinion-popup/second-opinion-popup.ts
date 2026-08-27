import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable auto-triggered "second opinion" image popup.
 * Shows a single promotional image; clicking it (or the CTA button)
 * emits `bookAppointment` so the host page can open its booking popup.
 *
 * Usage:
 *   <app-second-opinion-popup
 *     [isOpen]="isSecondOpinionOpen"
 *     imageSrc="img/packages/hernia/second-opinion-pop-up.jpg"
 *     imageAlt="Get Free Second Surgical Opinion at Vasavi Hospitals"
 *     (close)="closeSecondOpinion()"
 *     (bookAppointment)="onSecondOpinionBook()">
 *   </app-second-opinion-popup>
 */
@Component({
  selector: 'app-second-opinion-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './second-opinion-popup.html',
  styleUrl: './second-opinion-popup.css',
})
export class SecondOpinionPopup {
  @Input() isOpen = false;
  @Input() imageSrc = '';
  @Input() imageAlt = 'Get a free second surgical opinion';

  @Output() close = new EventEmitter<void>();
  @Output() bookAppointment = new EventEmitter<void>();

  closePopup(): void {
    this.close.emit();
  }

  onImageClick(): void {
    this.bookAppointment.emit();
  }

  onBookClick(): void {
    this.bookAppointment.emit();
  }
}
