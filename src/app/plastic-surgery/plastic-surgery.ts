import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-plastic-surgery',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta],
  templateUrl: './plastic-surgery.html',
  styleUrl: './plastic-surgery.css'
})
export class PlasticSurgery {

  constructor(private titleService:Title, private metaService:Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Plastic Surgery Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Advanced plastic, cosmetic, and reconstructive surgery at Vasavi Hospitals in Banashankari Bangalore. Safe and expert care.'})
  }


testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Plastic Surgery hospital in Bangalore. The plastic surgeon's expertise and the caring staff made my facelift procedure a success.", name: "Palavi" },
    { description: "I'm grateful to the best Plastic Surgery doctor in Bangalore at Vasavi Hospitals. Their precision and guidance during my breast augmentation surgery were exceptional.", name: "Deepa" },
    { description: "Enhancing my appearance was a significant decision, but Vasavi Hospitals' plastic surgeons provided me with outstanding care and results. Their dedication is truly commendable.", name: "Vinodini" },
    { description: "The non-surgical treatments I received at Vasavi Hospitals transformed my skin. The staff ensured I felt comfortable and confident throughout the process.", name: "Hema" },
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
