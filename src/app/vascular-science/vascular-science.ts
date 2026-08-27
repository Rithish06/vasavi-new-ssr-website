import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-vascular-science',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta],
  templateUrl: './vascular-science.html',
  styleUrl: './vascular-science.css'
})
export class VascularScience {

  constructor(private titleService: Title, private metaService:Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Vascular Surgery Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Advanced vascular sciences care at Vasavi Hospitals in Banashankari Bangalore. Expert treatments for veins, arteries, and circulation.'})
  }

  testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Vascular Sciences hospital in Bangalore. The vascular specialist's expertise and the caring staff made my vascular treatment journey smooth and efficient.", name: "Aradhya" },
    { description: "I'm grateful to the best Vascular Sciences doctor in Bangalore at Vasavi Hospitals. Their precise diagnosis of my vascular condition was instrumental in my treatment plan.", name: "Gowtham" },
    { description: "Facing peripheral artery disease was challenging, but Vasavi Hospitals' vascular specialists provided me with accurate diagnoses and innovative treatment options. Their dedication is truly commendable.", name: "Lokesh" },
    { description: "My varicose vein treatment at Vasavi Hospitals was a success, and the staff ensured my comfort throughout the procedure. Their professionalism is unmatched.", name: "Shankar P" },
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
