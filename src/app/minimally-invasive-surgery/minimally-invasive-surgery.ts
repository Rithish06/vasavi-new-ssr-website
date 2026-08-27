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
  selector: 'app-minimally-invasive-surgery',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterLink],
  templateUrl: './minimally-invasive-surgery.html',
  styleUrl: './minimally-invasive-surgery.css'
})
export class MinimallyInvasiveSurgery {

  constructor(private titleService: Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Minimally Invasive Surgery in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Vasavi Hospitals in Banashankari Bangalore offers advanced minimally invasive surgery for faster recovery and expert surgical outcomes.'})
  }


testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the top Minimally Invasive Surgery hospital in Bangalore. The minimally invasive surgeon's expertise and the caring staff made my surgery a breeze.", name: "Ajith V" },
    { description: "I'm grateful to the best Minimally Invasive Surgery doctor in Bangalore at Vasavi Hospitals. Their precision and guidance during my laparoscopic procedure were exceptional.", name: "Duraiswamy" },
    { description: "Facing a complex gastrointestinal issue was daunting, but Vasavi Hospitals' minimally invasive surgeons provided me with hope and a quick recovery. Their dedication is truly commendable.", name: "Maya" },
    { description: "I underwent  surgery at Vasavi Hospitals, and the results were remarkable. The staff at vasavi Hospital made comfort and given me strength.", name: "Satya Prakash" },
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
