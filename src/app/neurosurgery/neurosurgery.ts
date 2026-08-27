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
  selector: 'app-neurosurgery',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterModule],
  templateUrl: './neurosurgery.html',
  styleUrl: './neurosurgery.css'
})
export class Neurosurgery {

  constructor(private titleService: Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Neurosurgery Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Advanced brain and spine surgery at Vasavi Hospitals in Banashankari Bangalore. Expert neurosurgeons ensuring precision care.'})
  }


 testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Neurosurgery hospital in Bangalore. The neurosurgeon's expertise and the caring staff made my brain tumor surgery a success.", name: "Amrutha" },
    { description: "I'm grateful to the best Neurosurgery doctor in Bangalore at Vasavi Hospitals. Their precision and guidance during my spinal surgery have significantly improved my quality of life.", name: "Yashika" },
    { description: "Facing a traumatic brain injury was overwhelming, but Vasavi Hospitals' neurosurgeons provided me with hope and exceptional care. Their dedication is truly commendable.", name: "Dharmaraj Gowda" },
    { description: "My child needed pediatric neurosurgery, and Vasavi Hospitals' team was exceptional. Their child-friendly approach made the experience less intimidating for my little one.", name: "Udaya P" },
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
