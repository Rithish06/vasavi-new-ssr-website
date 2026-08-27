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
  selector: 'app-emergency-critical-care',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterModule],
  templateUrl: './emergency-critical-care.html',
  styleUrl: './emergency-critical-care.css'
})
export class EmergencyCriticalCare {

  constructor(private titleService:Title, private metaService:Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Emergency & ICU Hospital in Banashankari Bangalore | Vasavi Hospitals')
    this.metaService.updateTag({name:'description', content:'24/7 emergency and critical care hospital in Banashankari Bangalore. Advanced ICU facilities and lifesaving medical services.'})
  }


 testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Emergency & Critical Care hospital in Bangalore. The emergency physicians' quick response and the caring staff saved my life during a cardiac emergency.", name: "Manohar N" },
    { description: "I'm grateful to the best Emergency & Critical Care doctor in Bangalore at Vasavi Hospitals. Their expertise and immediate intervention during a traumatic injury were exceptional.", name: "Radha Krishna" },
    { description: "Facing a stroke was terrifying, but Vasavi Hospitals' critical care team provided me with hope and exceptional care. Their dedication is truly commendable.", name: "Manjari" },
    { description: "My child needed pediatric critical care, and Vasavi Hospitals' team was exceptional. Their child-friendly approach made the experience less intimidating for my little one.", name: "Rudreshan" },
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
