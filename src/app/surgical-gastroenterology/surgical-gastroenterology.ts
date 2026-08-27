import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-surgical-gastroenterology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta],
  templateUrl: './surgical-gastroenterology.html',
  styleUrl: './surgical-gastroenterology.css'
})
export class SurgicalGastroenterology {

  constructor(private titleService: Title, private metaService:Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Surgical Gastroenterology in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Vasavi Hospitals in Banashankari Bangalore offers advanced surgical gastroenterology care and expert digestive surgeries.'})
  }


testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Surgical Gastroenterology hospital in Bangalore. The surgical gastroenterologist's expertise and the caring staff made my gastrointestinal surgery a success.", name: "Prabhu D" },
    { description: "I'm grateful to the best Surgical Gastroenterology doctor in Bangalore at Vasavi Hospitals. Their precision and guidance during my laparoscopic procedure were exceptional.", name: "Venkatesh" },
    { description: "Facing a complex hepatobiliary issue was daunting, but Vasavi Hospitals' surgical gastroenterologists provided me with hope and outstanding care. Their dedication is truly commendable.", name: "Prakash" },
    { description: "I underwent bariatric surgery at Vasavi Hospitals, and the results were remarkable. The staff ensured I had minimal discomfort throughout the entire process.", name: "Vijay Kumar" },
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
