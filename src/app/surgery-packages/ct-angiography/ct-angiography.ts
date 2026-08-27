import { Component, ElementRef, ViewChild } from '@angular/core';
import { CallbackForm } from '../../ads-pages/callback-form/callback-form';
import { CommonModule } from '@angular/common';
import { DoctorsCard } from "../../doctors-card/doctors-card";
import { PopUpFormAds } from '../../pop-up-form-ads/pop-up-form-ads';
import { Cta } from "../../cta/cta";
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-ct-angiography',
  imports: [CallbackForm, CommonModule, DoctorsCard, Cta, PopUpFormAds],
  templateUrl: './ct-angiography.html',
  styleUrl: './ct-angiography.css'
})
export class CTAngiography {

  constructor(private title: Title, private meta: Meta) { }
  @ViewChild('carouselTrack', { static: false }) trackRef!: ElementRef<HTMLDivElement>;
  @ViewChild('prevBtn', { static: false }) prevBtnRef!: ElementRef<HTMLButtonElement>;
  @ViewChild('nextBtn', { static: false }) nextBtnRef!: ElementRef<HTMLButtonElement>;

  currentIndex = 0;
  itemsPerView = 1;
  isCarouselMode = false;
  resizeTimeout: any;
  activeSection = 'overview';

  sections = [
    { name: 'Overview', id: 'overview' },
    { name: 'Symptoms', id: 'symptoms' },
    { name: 'Book an Appointment', id: 'appointment' },
    { name: 'Our Doctors', id: 'doctors' },
    // { name: 'Surgery Options', id: 'surgery' },
    // { name: 'Types', id: 'types' },
    { name: 'Procedures', id: 'procedures' }
  ];

  doctorHeader: any = {
    title: "Meet Our Surgery Specialist",
    description: ""
  }

  doctors: any = [
    {
      name: "Dr. Krishna Kumar B. R",
      img: "Images/new-doctor-image/dr-krishna-kumar-b-r-sq.png",
      alt: "Best Gynecologic Oncologist and Robotic Hysterectomy Surgeon in Bangalore | Dr. Nisha Buchade",
      experience: "17+",
      department: "Cardiologist",
      qualification: "MBBS, Diploma in Clinical Cardiology",
      slug: "/dr-krishna-kumar-b-r"
    },
    // {
    //   name: "Dr. Girish Navasundi",
    //   img: "Images/new-doctor-image/dr-girish-b-navasundi.png",
    //   alt: "Best Gynecologist and Laparoscopic Surgeon in Bangalore | Dr. Sowmya Sangamesh",
    //   // experience: "14+",
    //   // department: "Consultant - ENT",
    //   qualification: "MBBS MD DNB",
    //   // slug: "/dr-sowmya-sangamesh"
    // },

    {
      name: "Dr. Balaraj",
      img: "Images/new-doctor-image/dr-balaraj.png",
      alt: "Best Gynecologist and Laparoscopic Surgeon in Bangalore | Dr. Sowmya Sangamesh",
      // experience: "14+",
      // department: "Consultant - ENT",
      qualification: "MBBS MD DNB DM Cardiology",
      // slug: "/dr-sowmya-sangamesh"
    },
    {
      name: "Dr. Balakrishna G T",
      img: "Images/new-doctor-image/dr-balakrishna-sq.png",
      alt: "Best Gynecologist and Laparoscopic Surgeon in Bangalore | Dr. Balakrishna G T",
      // experience: "14+",
      // department: "Consultant - ENT",
      qualification: "MBBS | MD General Medicine, DM Cardiology",
      slug: "/dr-balakrishna-g-t"
    }
  ];

  isPopupOpen = false;

  openPopup(): void {
    this.isPopupOpen = true;
    document.body.style.overflow = 'hidden'; // disable background scroll
  }

  closePopup(): void {
    this.isPopupOpen = false;
    document.body.style.overflow = ''; // restore scroll
  }



  private popupInterval: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.openImagePopup();
    }, 5000);
    this.title.setTitle('CT Angiography Test in Bangalore | Advanced Diagnostic Imaging');
    this.meta.updateTag({ name: 'description', content: 'High-precision CT angiography for heart, brain & arteries. Quick, safe & insurance-covered diagnostic test.' })

    // this.popupInterval = setInterval(() => {
    //   this.openPopup();
    // }, 25000);
  }

  handleFormSubmit(data: { name: string; phoneNumber: string; otp: string }) {
    console.log('Form Data Received:', data);
    // ✅ You can send this data to backend or API here
    this.closePopup(); // close popup after success
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

  isPopupImageOpen = false;
  // selectedImage: string | null = null;

  openImagePopup() {
    this.isPopupImageOpen = true;
  }

  closeImagePopup() {
    this.isPopupImageOpen = false;
  }

  selectedPageName: string = 'CT-angiography';


  handleBookAppointment(doctor: any) {
    // console.log('Doctor clicked:', doctor);
    this.selectedPageName = `CT-angiography, Doctor Name: ${doctor.name}`;
    // console.log('Page Name:', this.selectedPageName);
    this.openPopup();
  }

}
