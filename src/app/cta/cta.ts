import { Component } from '@angular/core';
import { FacebookPixel } from '../facebook-pixel';

@Component({
  selector: 'app-cta',
  imports: [],
  templateUrl: './cta.html',
  styleUrl: './cta.css'
})
export class Cta {

  constructor(private pixel:FacebookPixel){}

  trackCall() {
  this.pixel.trackCustomEvent('CallInitiated', {
    phone: '08071500500'
  });
}


}
