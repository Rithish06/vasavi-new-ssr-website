import { CommonModule } from '@angular/common';
import { Component, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-doctors-slide',
  imports: [CommonModule, RouterModule, CarouselModule],
  templateUrl: './doctors-slide.html',
  styleUrl: './doctors-slide.css'
})
export class DoctorsSlide {
  @Input() doctorSlide: any[] = [];

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 20,
    nav: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    smartSpeed: 700,
    navText: [
      '<i class="fa fa-chevron-left"></i>',   
      '<i class="fa fa-chevron-right"></i>'   
    ],
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 }
    }
  };

}