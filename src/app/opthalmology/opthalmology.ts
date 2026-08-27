import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-opthalmology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterModule],
  templateUrl: './opthalmology.html',
  styleUrl: './opthalmology.css'
})
export class Opthalmology {

  constructor(private titleService:Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Eye Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Comprehensive ophthalmology care at Vasavi Hospitals in Banashankari Bangalore. Vision correction, eye surgeries, and routine eye care.'})
  }

testimonials = [
    { description: "Vasavi Hospitals is truly the best ophthalmology hospital in Bangalore. The ophthalmologist's expertise and the friendly staff made my cataract surgery a breeze. I can see clearly again!", name: "Kamala" },
    { description: "I'm grateful to the best ophthalmology doctor in Bangalore at Vasavi Hospitals. Their personalized care and attention to detail transformed my experience with glaucoma management.", name: "Surendra" },
    { description: "Facing a retina issue was concerning, but Vasavi Hospitals' ophthalmologists provided me with hope and tailored treatment. Their dedication is truly commendable.", name: "Srinivas" },
    { description: "My child needed pediatric ophthalmology care, and Vasavi Hospitals' team was exceptional. Their child-friendly approach made the experience easier for my little one.", name: "Manjunath" },
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
