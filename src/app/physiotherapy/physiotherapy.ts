import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta"; 
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-physiotherapy',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta],
  templateUrl: './physiotherapy.html',
  styleUrl: './physiotherapy.css'
})
export class Physiotherapy {

  constructor(private titleService:Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Physiotherapy Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Vasavi Hospitals in Banashankari Bangalore provides expert physiotherapy, rehabilitation, and pain management care.'})
  }

testimonials = [
    { description: "Vasavi Hospitals is truly the best physiotherapy hospital in Bangalore. The physiotherapist's expertise and the caring staff made my recovery after knee surgery smooth and efficient.", name: "Thulasiram" },
    { description: "I'm grateful to the best physiotherapy doctor in Bangalore at Vasavi Hospitals. Their personalized care and tailored exercises have significantly reduced my chronic pain.", name: "Chandra" },
    { description: "Recovering from a neurological condition was challenging, but Vasavi Hospitals' physiotherapists provided me with hope and unwavering support. Their dedication is truly commendable.", name: "Amulya" },
    { description: "My child needed pediatric physiotherapy, and Vasavi Hospitals' team was exceptional. Their child-friendly approach made the experience enjoyable and effective.", name: "Raveena" },
  ];

direction: 'ltr' | 'rtl' = 'ltr';  // track direction

  customOptions: OwlOptions = {
    loop: true,
    margin:20,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: false,
    nav: false,
    rtl: false,   // will be toggled dynamically
    responsive: {
      0: { items: 1 },
      768: { items: 2 },
      992: { items: 3 }
    }
  };

  // method to flip direction
  toggleDirection() {
    this.direction = this.direction === 'ltr' ? 'rtl' : 'ltr';
    this.customOptions = { ...this.customOptions, rtl: this.direction === 'rtl' };
    // console.log(this.customOptions)
  }

  // example: change direction every 3 slides
onTranslated(event: any) {
  // event.startPosition tells you the index of the first visible slide
  const index = event.startPosition ?? 0;

  if (index % 3 === 0) {
    this.toggleDirection();
  }
}
}
