import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dentistry',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterLink],
  templateUrl: './dentistry.html',
  styleUrl: './dentistry.css'
})
export class Dentistry {

  constructor( private titleService:Title, private metaService:Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Dental Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Advanced dental care at Vasavi Hospitals in Banashankari Bangalore. Cosmetic dentistry, oral health treatments, and expert dental specialists.'})
  }

testimonials = [
    { description: " Vasavi Hospitals is undoubtedly the best Dentistry hospital in Bangalore.The dentist's expertise and the caring staff made my dental visit painless, and I'm now more confident about my smile.", name: "Bhavani" },
    { description: "I'm grateful to the best Dentistry doctor in Bangalore at Vasavi Hospitals. Their precision and dedication during my dental procedure were exceptional, and I can't thank them enough.", name: "Supriya C K" },
    { description: "My child's dental care at Vasavi Hospitals was exceptional. The pediatric dentist and staff made the experience enjoyable, and I'm impressed with the level of care they provided.", name: "Preeti Sharma T" },
    { description: "I was hesitant about getting braces, but Vasavi Hospitals'orthodontic team made the process smooth and painless. I'm thrilled with the results!", name: "Aparna G" },
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
