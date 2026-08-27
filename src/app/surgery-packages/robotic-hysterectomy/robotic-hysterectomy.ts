import { Component, ElementRef, ViewChild } from '@angular/core';
import { CallbackForm } from '../../ads-pages/callback-form/callback-form';
import { CommonModule } from '@angular/common';
import { DoctorsCard } from "../../doctors-card/doctors-card";
import { PopUpFormAds } from '../../pop-up-form-ads/pop-up-form-ads';
import { Cta } from "../../cta/cta";
import { Meta, Title } from '@angular/platform-browser';

interface HerniaType {
  cssClass: string;
  badgeText: string;
  title: string;
  description: string;
  tag?: string;
  location?: string;
  recoverytime?: string;
  hospitalStay?: string
}
@Component({
  selector: 'app-robotic-hysterectomy',
  imports: [CallbackForm, CommonModule, DoctorsCard, Cta, PopUpFormAds],
  templateUrl: './robotic-hysterectomy.html',
  styleUrl: './robotic-hysterectomy.css'
})
export class RoboticHysterectomy {

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
    { name: 'Surgery Options', id: 'surgery' },
    { name: 'Types', id: 'types' },
    { name: 'Procedures', id: 'procedures' }
  ];

  doctorHeader: any = {
    title: "Meet Our Surgery Specialist",
    description: ""
  }

  doctors: any = [
    {
      name: "Dr. Nisha Buchade",
      img: "Images/go/dr-nisha-buchade-sq.png",
      alt: "Best Gynecologic Oncologist and Robotic Hysterectomy Surgeon in Bangalore | Dr. Nisha Buchade",
      experience: "15+",
      department: "Gynecology, Robotic & Laparoscopic Surgery",
      // qualification: "MBBS, MS, Fellowship in Gynec-Oncology, Fellowship in Advanced Infertility",
      slug: "/dr-nisha-buchade"
    },
    // {
    //   name: "Dr. Sowmya Sangamesh",
    //   img: "Images/new-doctor-image/dr-sowmya-sangmesh-sq.png",
    //   alt: "Best Gynecologist and Laparoscopic Surgeon in Bangalore | Dr. Sowmya Sangamesh",
    //   experience: "14+",
    //   department: "Obstetrics & Gynecology, Minimal Access & Reproductive Surgery",
    //   // qualification: "MBBS, MS (OBG), Fellowship in Minimal Access Surgery, Advanced Diploma in Reproductive Medicine",
    //   slug: "/dr-sowmya-sangamesh"
    // }
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

  herniaTypes: HerniaType[] = [
    {
      cssClass: 'inguinal',
      badgeText: 'Most Common',
      title: 'Total Hysterectomy',
      description:
        'Removes the entire uterus along with the cervix. It’s the most common type, often done for fibroids, heavy bleeding, or uterine growths.',
      location: '2–4 weeks',
      hospitalStay: '1–2 days',
      recoverytime: 'Laparoscopic / Robotic',
    },
    // {
    //   cssClass: 'femoral',
    //   badgeText: 'More Common in Women',
    //   title: 'Supracervical Hysterectomy',
    //   description:
    //     'Removes the upper part of the uterus but keeps the cervix intact. This is usually recommended when there’s no cervical disease and the goal is to preserve pelvic support.',
    //   location: '3–5 weeks',
    //   hospitalStay: '1 day',
    //   recoverytime: 'Laparoscopic / Abdominal',
    // },
    {
      cssClass: 'umbilical',
      badgeText: 'Often in Adults',
      title: 'Hysterectomy with Oophorectomy',
      description:
        'Involves removing the uterus along with one or both ovaries. It’s done when there’s a risk of ovarian cysts, endometriosis, or hormone-related problems.',
      location: '4–6 weeks',
      hospitalStay: '1–2 days',
      recoverytime: 'Laparoscopic / Robotic',
    },
    {
      cssClass: 'ventral',
      badgeText: 'Abdominal Wall',
      title: 'Radical Hysterectomy',
      description:
        'Removes the uterus, cervix, part of the vagina, and surrounding tissues. This is usually advised for early-stage cervical or uterine cancer.',
      location: '4–6 weeks',
      hospitalStay: '2–3 days',
      recoverytime: 'Robotic / Open',
    },

  ];


  private popupInterval: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.openImagePopup();
    }, 5000);

    // this.popupInterval = setInterval(() => {
    //   this.openPopup();
    // }, 25000);
    this.title.setTitle(' Affordable Hysterectomy Surgery in Bangalore | Vasavi Hospitals');
    this.meta.updateTag({ name: 'description', content: 'Get expert laparoscopic & robotic hysterectomy in Bangalore for fibroids, bleeding & uterine issues. Safe, precise & quick recovery.' })
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

     selectedPageName: string = 'Hysterectomy';


  handleBookAppointment(doctor: any) {
    // console.log('Doctor clicked:', doctor);
    this.selectedPageName = `Hysterectomy, Doctor Name: ${doctor.name}`;
    // console.log('Page Name:', this.selectedPageName);
    this.openPopup();
  }

}
