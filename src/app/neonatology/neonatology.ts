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
  selector: 'app-neonatology',
  imports: [CarouselModule, CommonModule, ContactFom, SubNavbar, Cta, RouterModule],
  templateUrl: './neonatology.html',
  styleUrl: './neonatology.css'
})
export class Neonatology {


  constructor(private titleService: Title, private metaService: Meta){}

  ngOnInit():void{
    this.titleService.setTitle('Best Neonatology NICU in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({name:'description', content:'Advanced Level 3 NICU in Banashankari Bangalore. Specialized neonatal care for premature and high-risk babies with expert support.'})
  }

testimonials = [
    { description: "Vasavi Hospitals is undoubtedly the best Neonatology (Level – 3 NICU) hospital in Bangalore. The neonatology team's expertise and the caring staff saved our premature baby's life.", name: "Deepak" },
    { description: "I'm grateful to the best Neonatology (Level – 3 NICU) doctor in Bangalore at Vasavi Hospitals. Their dedication during our neonate's surgery was exceptional.", name: "Ravikrishna" },
    { description: "Facing the complexities of a neonatal cardiac issue was overwhelming, but Vasavi Hospitals' neonatology team provided us with hope and exceptional care. Their dedication is truly commendable.", name: "Baskar" },
    { description: "Our premature baby received exceptional care at Vasavi Hospitals' NICU. The staff ensured we were well-informed and supported throughout the entire journey.", name: "Rohini" },
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
