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
  selector: 'app-pediatrics',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterModule],
  templateUrl: './pediatrics.html',
  styleUrl: './pediatrics.css'
})
export class Pediatrics {

  constructor(private titleService:Title, private metaService: Meta){}
  
  ngOnInit():void{
    this.titleService.setTitle('Best Pediatric Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Vasavi Hospitals in Banashankari Bangalore offers expert pediatricians, neonatal care, and complete child healthcare services.'})
  }

testimonials = [
    { description: "The care and expertise of the pediatric surgeons at Vasavi Hospitals are unmatched. They provided excellent care during my child's surgery, and I'm grateful for their dedication.", name: "Priya A" },
    { description: "As a parent, I couldn't have asked for a better pediatric hospital in Bangalore. The pediatricians at Vasavi Hospitals are not only skilled but also incredibly caring and compassionate.", name: "Arjun P" },
    { description: "My child's pediatric neurology treatment at Vasavi Hospitals was a lifesaver.The neurologist's expertise and the supportive staff made all the difference in my child's recovery.", name: "Rina S" },
    { description: "Vasavi Hospitals' pediatric orthopedic team helped my child recover from a sports injury. Their dedication to children's health is truly commendable.", name: "Kartik R" },
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
