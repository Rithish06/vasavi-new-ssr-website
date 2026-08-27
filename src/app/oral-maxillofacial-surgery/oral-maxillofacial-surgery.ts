import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ContactFom } from "../contact-fom/contact-fom";
import { SubNavbar } from "../sub-navbar/sub-navbar";
import { Cta } from "../cta/cta"; 
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-oral-maxillofacial-surgery',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta],
  templateUrl: './oral-maxillofacial-surgery.html',
  styleUrl: './oral-maxillofacial-surgery.css'
})
export class OralMaxillofacialSurgery {

  constructor(private titleService: Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Maxillofacial Surgery in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Vasavi Hospitals in Banashankari Bangalore provides advanced oral and maxillofacial surgery for dental and facial conditions.'})
  }


testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Oral & Maxillofacial Surgery hospital in Bangalore. The oral surgeon's expertise and the caring staff made my dental implant procedure a success.", name: "Pooja" },
    { description: "I'm grateful to the best Oral & Maxillofacial Surgery doctor in Bangalore at Vasavi Hospitals. Their precision and guidance during my jaw surgery were exceptional.", name: "Yamuna V S" },
    { description: "Facing facial trauma was overwhelming, but Vasavi Hospitals' oral and maxillofacial surgeons provided me with hope and exceptional care. Their dedication is truly commendable.", name: "Seetha Lakshmi" },
    { description: "My child needed cleft lip and palate repair, and Vasavi Hospitals' team was exceptional. Their child-friendly approach made the experience less intimidating for my little one.", name: "Asha" },
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
