import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-radiology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta],
  templateUrl: './radiology.html',
  styleUrl: './radiology.css'
})
export class Radiology {

  constructor(private titleService: Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Radiology Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Advanced radiology and diagnostic imaging at Vasavi Hospitals in Banashankari Bangalore. Accurate results with modern technology.'})
  }

 testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best radiology hospital in Bangalore. The radiologist's expertise and the caring staff made my diagnostic process seamless and accurate.", name: "Shareetha" },
    { description: "I'm grateful to the best radiology doctor in Bangalore at Vasavi Hospitals.Their precise interpretation of my imaging results was instrumental in my treatment plan.", name: "Pavithra" },
    { description: "Facing a complex medical condition was challenging, but Vasavi Hospitals' radiologists provided me with accurate and timely diagnoses. Their dedication is truly commendable.", name: "Pavana" },
    { description: "My mammography experience at Vasavi Hospitals was stress-free, and the staff ensured I felt comfortable throughout the procedure. Their professionalism is unmatched.", name: "Ramya" },
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
