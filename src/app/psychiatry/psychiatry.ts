import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-psychiatry',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta],
  templateUrl: './psychiatry.html',
  styleUrl: './psychiatry.css'
})
export class Psychiatry {

  constructor(private titleService: Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Psychiatry Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Mental health and psychiatry care at Vasavi Hospitals in Banashankari Bangalore. Expert psychiatrists and therapy support.'})
  }


  testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Psychiatry hospital in Bangalore. The psychiatrist's expertise and the caring staff played a crucial role in my journey to mental wellness.", name: "Sangeetha" },
    { description: "I'm grateful to the best Psychiatry doctor in Bangalore at Vasavi Hospitals. Their therapy and support have been life-changing for me, and I've made significant progress in managing my mental health.", name: "Poorna" },
    { description: "Dealing with my anxiety and stress seemed impossible, but Vasavi Hospitals' psychiatry team provided me with hope and exceptional care. Their dedication is truly commendable.", name: "Priya shankar" },
    { description: "Overcoming my addiction was challenging, but Vasavi Hospitals' substance abuse treatment program transformed my life. The staff's understanding and guidance made all the difference.", name: "Naveen Kumar" },
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
