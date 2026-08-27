import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-diabetes-endocrinology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterLink, RouterModule],
  templateUrl: './diabetes-endocrinology.html',
  styleUrl: './diabetes-endocrinology.css'
})
export class DiabetesEndocrinology {

  constructor(private titleService: Title, private metaService: Meta){}


  ngOnInit():void{
    this.titleService.setTitle('Best Diabetes Care Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Specialized diabetes and endocrinology services in Banashankari Bangalore. Expert doctors for lifelong health management and care.'})
  }

 testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Diabetes & Endocrinology hospital in Bangalore. The endocrinologist's expertise and the caring staff helped me regain control of my diabetes.", name: "Surabhi" },
    { description: "I'm grateful to the best Diabetes & Endocrinology doctor in Bangalore at Vasavi Hospitals. Their guidance and personalized treatment plan significantly improved my thyroid condition.", name: "Mahesh Kumar" },
    { description: "Managing hormone imbalance and metabolic syndrome were challenging, but Vasavi Hospitals' endocrinologists provided me with hope and effective solutions. Their dedication is truly commendable.", name: "Usha Shree" },
    { description: "The osteoporosis care I received at Vasavi Hospitals was exceptional. The staff ensured my treatment was tailored to my needs and that I understood every step of the process.", name: "Naveena G S" },
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
