import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-medical-gastroenterology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterLink, RouterModule],
  templateUrl: './medical-gastroenterology.html',
  styleUrl: './medical-gastroenterology.css'
})
export class MedicalGastroenterology {

  constructor(private titleService: Title, private metaService:Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Gastroenterology Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Expert gastroenterology care at Vasavi Hospitals in Banashankari Bangalore. Digestive treatments, stomach care, and endoscopy services.'})
  }


testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Medical Gastroenterology hospital in Bangalore. The gastroenterologist's expertise and the caring staff made my treatment journey seamless, and I'm now enjoying improved digestive health.", name: "Jayalakshmi" },
    { description: "I'm grateful to the best Medical Gastroenterology doctor in Bangalore at Vasavi Hospitals. Their thorough evaluation and treatment plan have made a significant difference in managing my gastrointestinal condition.", name: "Prajwal" },
    { description: "Dealing with my digestive issues was challenging, but Vasavi Hospitals' gastroenterology team provided me with hope and exceptional care. Their dedication is truly commendable.", name: "Lingesh R" },
    { description: "My colonoscopy experience at Vasavi Hospitals was comfortable and efficient. The staff's support and the gastroenterologist's expertise made all the difference.", name: "Naveen R" },
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
