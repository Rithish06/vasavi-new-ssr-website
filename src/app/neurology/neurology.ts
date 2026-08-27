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
  selector: 'app-neurology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterLink],
  templateUrl: './neurology.html',
  styleUrl: './neurology.css'
})
export class Neurology {

  constructor(private titleService:Title, private metaService:Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Neurology Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Vasavi Hospitals in Banashankari Bangalore provides expert neurology care for brain, spine, and nervous system disorders.'})
  }

testimonials = [
    { description: " Vasavi Hospitals truly lives up to its reputation as the best neurology hospital in Bangalore. The neurologist's expertise and the hospital's caring environment made my journey to recovery smooth.", name: "Shanmugam" },
    { description: "Facing a complex neurological issue was daunting, but Vasavi Hospitals' neurosurgical team stepped in with confidence and precision. They are undoubtedly the best neurosurgeons in Bangalore.", name: "Manoj Sharma" },
    { description: "I'm grateful to the team at Vasavi Hospitals for their exceptional stroke management. Their timely intervention and expert care made all the difference in my recovery.", name: "Eshwar" },
    { description: "Living with epilepsy was challenging, but Vasavi Hospitals' neurologists provided me with effective treatment and support. I couldn't have asked for better care.", name: "Amit G" },
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
