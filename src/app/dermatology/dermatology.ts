import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dermatology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterModule],
  templateUrl: './dermatology.html',
  styleUrl: './dermatology.css'
})
export class Dermatology {

  constructor(private titleService: Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Skin & Dermatology Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Vasavi Hospitals in Banashankari Bangalore provides expert dermatology treatments for skin conditions, hair issues, and cosmetic care.'})
  }

testimonials = [
    { description: "Vasavi Hospitals is truly the best skin clinic in Bangalore.The dermatologist's expertise and the friendly staff made my acne treatment a breeze.I'm more confident in my skin now.", name: "Chandrika" },
    { description: "I'm so grateful to have found the best dermatologist in Bangalore at Vasavi Hospitals. The personalized skincare plan they provided transformed my skin,and I couldn't be happier.", name: "Rahul M K" },
    { description: "My skin cancer screening at Vasavi Hospitals was thorough, and the dermatologist's attention to detail put my mind at ease. Thank you for your exceptional care!", name: "Ruchika" },
    { description: "I've struggled with hair loss for years, but Vasavi Hospitals' hair and scalp treatments made a noticeable difference. They truly are the best skin care clinic.", name: "Rajesh M" },
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
