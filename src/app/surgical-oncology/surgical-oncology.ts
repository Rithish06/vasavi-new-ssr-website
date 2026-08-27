import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Cta } from "../cta/cta";
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-surgical-oncology',
  imports: [CarouselModule, CommonModule, Cta, ContactFom, SubNavbar],
  templateUrl: './surgical-oncology.html',
  styleUrl: './surgical-oncology.css'
})
export class SurgicalOncology {

  constructor(private titleService:Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Surgical Oncology Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Cancer surgery at Vasavi Hospitals in Banashankari Bangalore. Expert surgical oncologists for safe and effective treatment.'})
  }

  testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Surgical Oncology hospital in Bangalore. The surgical oncologist's expertise and the caring staff made my cancer surgery successful, and I'm now on my way to recovery.", name: "Bhavana" },
    { description: "I'm grateful to the best Surgical Oncology doctor in Bangalore at Vasavi Hospitals. Their precision and dedication during my cancer surgery were exceptional, and I can't thank them enough.", name: "Vidya" },
    { description: "Facing a complex cancer diagnosis was overwhelming, but Vasavi Hospitals' surgical oncology team provided me with hope and exceptional care. Their dedication is truly commendable.", name: "Ragini" },
    { description: "My reconstructive surgery after cancer treatment at Vasavi Hospitals was life-changing. The staff's support and the surgeon's expertise have made a significant difference in my quality of life.", name: "Latha R" },
  ];

  direction: 'ltr' | 'rtl' = 'ltr';  // track direction

  customOptions: OwlOptions = {
    loop: true,
    margin: 20,
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
