import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-doctors-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './doctors-card.html',
  styleUrl: './doctors-card.css'
})
export class DoctorsCard {

  @Input() doctorDetails: any
  @Input() headers: any

  @Output() bookAppointment = new EventEmitter<any>();

  onBookClick(doctor: any) {
    this.bookAppointment.emit(doctor);
  }

}
