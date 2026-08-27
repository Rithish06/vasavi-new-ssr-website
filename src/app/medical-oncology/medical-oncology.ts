import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-medical-oncology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta],
  templateUrl: './medical-oncology.html',
  styleUrl: './medical-oncology.css'
})
export class MedicalOncology {

  constructor(private titleService:Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Expert Medical Oncology & Chemotherapy Treatment');
    this.metaService.updateTag({name:'description', content:'Advanced Medical Oncology treatments, including chemotherapy, immunotherapy, and targeted therapy. Consult with our leading cancer specialists today.'})
  }

  testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Medical Oncology hospital in Bangalore. The medical oncologist's expertise and the caring staff made my cancer journey more manageable.", name: "Keerthi" },
    { description: "I'm grateful to the best Medical Oncology doctor in Bangalore at Vasavi Hospitals. Their care and guidance during my cancer treatment gave me hope and strength.", name: "Sharath" },
    { description: "Facing a cancer diagnosis was challenging, but Vasavi Hospitals' medical oncologists provided me with personalized care and unwavering support. Their dedication is truly commendable.", name: "Manikandan" },
    { description: "As a cancer survivor, I can attest to the exceptional care at Vasavi Hospitals. Their survivorship programs helped me regain my quality of life.", name: "Suresh V" },
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
