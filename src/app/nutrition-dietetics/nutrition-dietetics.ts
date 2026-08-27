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
  selector: 'app-nutrition-dietetics',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterLink],
  templateUrl: './nutrition-dietetics.html',
  styleUrl: './nutrition-dietetics.css'
})
export class NutritionDietetics {

  constructor(private titleService: Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Nutrition & Dietetics in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description',content:'Vasavi Hospitals in Banashankari Bangalore provides personalized nutrition and dietetics plans for better health and recovery.'})
  }

testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Nutrition & Dietetics hospital in Bangalore. The dietitian's expertise and the caring staff helped me achieve my weight loss goals and improve my overall health.", name: "Sanjana" },
    { description: "I'm grateful to the best Nutrition & Dietetics doctor in Bangalore at Vasavi Hospitals. Their personalized nutritional therapy transformed my life, and I'm now healthier than ever.", name: "Nandini V" },
    { description: "Managing my child's dietary needs was challenging, but Vasavi Hospitals' pediatric nutritionist provided us with exceptional guidance and support. Their dedication is truly commendable.", name: "Ranjitha" },
    { description: "As a sports enthusiast, I needed specialized nutritional advice. Vasavi Hospitals' sports nutritionist helped me optimize my performance and recovery.", name: "Tejashwini" },
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
