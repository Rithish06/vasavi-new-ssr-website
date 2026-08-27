import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SlidesOutputData } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-anesthesiology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta,RouterModule ],
  templateUrl: './anesthesiology.html',
  styleUrl: './anesthesiology.css'
})
export class Anesthesiology {

  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit():void{
    this.titleService.setTitle('Best Anesthesiology Hospital in Banashankari Bangalore | Vasavi Hospitals')
    this.metaService.updateTag({name:'description', content:'Expert anesthesiology care in Banashankari Bangalore. Safe anesthesia, pain-free surgeries, and advanced monitoring by specialists.'})
  }

  testimonials = [
    { description: "Vasavi Hospitals exceeded my expectations as the best anesthesiology hospital in Bangalore. The anesthesiologist's expertise and the caring staff made my surgery experience smooth and painless.", name: "Avanthika P" },
    { description: "I'm grateful to the best anesthesiologist doctor in Bangalore at Vasavi Hospitals. Their skillful administration of anesthesia ensured my procedure was stress-free, and my recovery was swift.", name: "Raghuram S P" },
    { description: "When it comes to pain management, I trust Vasavi Hospitals. Their anesthesiologists are thorough, and their personalized care made all the difference in my post-surgery comfort.", name: "Madhukar E" },
    { description: "My child's procedure required pediatric anesthesia, and Vasavi Hospitals provided exceptional care. They are undoubtedly the best anesthesiology specialists in Bangalore.", name: "Niveditha R" },
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
