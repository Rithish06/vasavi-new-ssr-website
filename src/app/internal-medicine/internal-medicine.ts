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
  selector: 'app-internal-medicine',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterLink],
  templateUrl: './internal-medicine.html',
  styleUrl: './internal-medicine.css'
})
export class InternalMedicine {

  constructor(private titleService: Title, private metaService: Meta){}


  ngOnInit():void{
    this.titleService.setTitle('Best Internal Medicine Hospital in Banashankari Bangalore | Vasavi Hospitals')
    this.metaService.updateTag({name:'description', content:'Vasavi Hospitals in Banashankari Bangalore offers complete internal medicine care, preventive health checks, and adult treatments.'})
  }


testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Internal Medicine hospital in Bangalore. The internal medicine specialist's expertise and the caring staff made my healthcare journey efficient and effective.", name: "Abhishek" },
    { description: "I'm grateful to the best Internal Medicine doctor in Bangalore at Vasavi Hospitals. Their accurate diagnosis and personalized treatment plan significantly improved my chronic condition.", name: "Harshit R" },
    { description: "Facing a complex medical condition was challenging, but Vasavi Hospitals' internal medicine specialists provided me with hope and unwavering support.", name: "Shivakumar" },
    { description: "The routine health check-ups I receive at Vasavi Hospitals are thorough and informative. The staff ensures I understand my health status and any necessary lifestyle changes.", name: "Purthviraj" },
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
