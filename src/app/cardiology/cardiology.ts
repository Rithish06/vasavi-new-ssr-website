import { Component } from '@angular/core';
import { AfterViewInit, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Cta } from "../cta/cta";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-cardiology',
  imports: [CommonModule, Cta, ReactiveFormsModule, RouterModule],
  templateUrl: './cardiology.html',
  styleUrl: './cardiology.css'
})
export class Cardiology {
  sections = [
    { name: 'Overview', id: 'overview' },
    { name: 'Services', id: 'services' },
    { name: 'Surgery Options', id: 'surgeries' },
    { name: 'Our Doctors', id: 'doctors' },
    { name: 'Cathlab', id: 'cathlab' },
    { name: 'Treatments', id: 'treatments' },
    { name: 'Book an Appointment', id: 'appointment' },
    { name: 'Why Vasavi', id: 'whyvasavi' },
    { name: 'FAQs', id: 'faqs' }
  ];


  @ViewChild('carouselTrack', { static: false }) trackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('prevBtn', { static: false }) prevBtnRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextBtn', { static: false }) nextBtnRef!: ElementRef<HTMLButtonElement>;
  currentIndex = 0;
  itemsPerView = 1;
  isCarouselMode = false;
  resizeTimeout: any;


  appointmentForm!: FormGroup;
  submitted = false;
  successMsg = '';
  errorMsg = '';

  activeSection = 'overview';


  apiUrl = 'https://vasavi-hospitals-812956739285.us-east4.run.app/api';
  // apiUrl = 'http://localhost:3000/api';

  constructor(private fb: FormBuilder, private titleService: Title, private metaService:Meta, private http: HttpClient, private router: Router) { }


  get f() {
    return this.appointmentForm.controls;
  }


  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/), Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
      doctor: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
  });

    this.titleService.setTitle('Best Cardiology Hospital in Banashankari Bangalore | Vasavi Hospitals');
    this.metaService.updateTag({
      name: 'description',
      content: 'Leading heart hospital in Banashankari Bangalore with Cath Lab, experienced cardiologists, and 24/7 emergency cardiac care.'
    });
  }

  submitForm(): void {
    if (this.appointmentForm.invalid) {
      alert('⚠️ Please fill all required fields correctly and the message should be more than 10 characters.');
      return;
    }

    // if (!this.recaptchaResponse) {
    //   alert('⚠️ Please complete the reCAPTCHA.');
    //   return;
    // }

    const formValues = this.appointmentForm.value;

    // ✅ Construct email parameters
    const emailParams = {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      date: formValues.date,
      doctor: formValues.doctor,
      message: formValues.message,
    };

    const emailRequest = {
      // to: ['inventionmindsblr@gmail.com'],
      to: ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com'],
      whatsappNumber: ['918884466000'],
      status: 'Service-Page',
      appointmentDetails: emailParams,
    };

    console.log('📤 Sending email request:', emailRequest);

    // ✅ Send email request
    this.http.post(`${this.apiUrl}/email/send-pages-email`, emailRequest).subscribe({
      next: (res:any) => {
        console.log('✅ Email sent successfully:', res);
        alert('✅ Thank you! Your message has been sent successfully.');
        this.appointmentForm.reset();
        this.router.navigate(['/thank-you']);
      },
      error: (err:any) => {
        console.error('❌ Error sending email:', err);
        alert('❌ Failed to send message. Please try again later.');
      },
    });
  }



  // sub navbar
  ngAfterViewInit(): void {
    this.updateCarouselMode();
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  // Carousel Items
  private get items(): NodeListOf<HTMLElement> {
    return this.trackRef.nativeElement.querySelectorAll('.section-item');
  }

  // Update carousel mode
  private updateCarouselMode(): void {
    const containerWidth = this.trackRef.nativeElement.parentElement!.clientWidth - 32;
    const itemsArray = Array.from(this.items);
    const itemsWidth = itemsArray.reduce((total, item) => total + item.offsetWidth + 16, 0) - 16;

    this.isCarouselMode = itemsWidth > containerWidth;

    if (this.isCarouselMode) {
      this.calculateItemsPerView();
      this.showCarouselControls();
      this.updateCarousel();
    } else {
      this.hideCarouselControls();
      this.trackRef.nativeElement.style.transform = 'translateX(0)';
    }
  }

  // Calculate visible items
  private calculateItemsPerView(): void {
    const containerWidth = this.trackRef.nativeElement.parentElement!.clientWidth - 32;
    let totalWidth = 0;
    let itemCount = 0;

    for (const item of Array.from(this.items)) {
      const itemWidth = item.offsetWidth + 16;
      if (totalWidth + itemWidth <= containerWidth) {
        totalWidth += itemWidth;
        itemCount++;
      } else break;
    }

    this.itemsPerView = Math.max(1, itemCount);
  }

  // Show/hide carousel buttons
  private showCarouselControls(): void {
    this.prevBtnRef.nativeElement.classList.remove('hide');
    this.prevBtnRef.nativeElement.classList.add('show');
    this.nextBtnRef.nativeElement.classList.remove('hide');
    this.nextBtnRef.nativeElement.classList.add('show');
  }

  private hideCarouselControls(): void {
    this.prevBtnRef.nativeElement.classList.remove('show');
    this.prevBtnRef.nativeElement.classList.add('hide');
    this.nextBtnRef.nativeElement.classList.remove('show');
    this.nextBtnRef.nativeElement.classList.add('hide');
  }

  // Update carousel position
  private updateCarousel(): void {
    if (!this.isCarouselMode) return;
    const itemWidth = this.items[0].offsetWidth + 16;
    const translateX = -this.currentIndex * itemWidth * this.itemsPerView;
    this.trackRef.nativeElement.style.transform = `translateX(${translateX}px)`;
    this.updateButtons();
  }

  private updateButtons(): void {
    const maxIndex = Math.ceil(this.items.length / this.itemsPerView) - 1;
    this.prevBtnRef.nativeElement.disabled = this.currentIndex <= 0;
    this.nextBtnRef.nativeElement.disabled = this.currentIndex >= maxIndex;
  }

  next(): void {
    const maxIndex = Math.ceil(this.items.length / this.itemsPerView) - 1;
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  // Scroll to section
  scrollToSection(sectionId: string): void {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection = sectionId;
    }
  }

  // Event listeners
  private setupEventListeners(): void {
    this.prevBtnRef.nativeElement.addEventListener('click', () => this.prev());
    this.nextBtnRef.nativeElement.addEventListener('click', () => this.next());

    // Touch support
    let startX: number | null = null;
    const track = this.trackRef.nativeElement;

    track.addEventListener('touchstart', (e: TouchEvent) => startX = e.touches[0].clientX);
    track.addEventListener('touchend', (e: TouchEvent) => {
      if (!startX || !this.isCarouselMode) return;
      const diffX = startX - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > 50) diffX > 0 ? this.next() : this.prev();
      startX = null;
    });

    // Window resize
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => this.updateCarouselMode(), 300);
  }

}
