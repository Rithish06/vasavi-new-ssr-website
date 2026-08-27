import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { DoctorsSlide } from "../../doctors-slide/doctors-slide";

import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HealthPackageForm } from "../../health-package-form/health-package-form";

@Component({
  selector: 'app-health-check',
  imports: [CommonModule, FormsModule, DoctorsSlide, ReactiveFormsModule, HealthPackageForm],
  templateUrl: './health-check.html',
  styleUrl: './health-check.css'
})
export class HealthCheck {
  // apiUrl = 'https://vasavi-hospitals-812956739285.us-east4.run.app/api';
  // apiUrl = 'http://localhost:3000/api';


  openedIndex: number | null = null;

  toggle(index: number) {
    this.openedIndex = this.openedIndex === index ? null : index;
  }

  scrollToForm() {
    document.getElementById('appointmentFormSection')?.scrollIntoView({
      behavior: 'smooth'
    });
  }



  // appointmentForm!: FormGroup;
  // otpSent = false;
  // otpVerified = false;
  // otpInvalid = false;
  // otpExpired = false;
  // generatedOtp!: string;
  // timeLeft = 0;
  // interval: any;
  // canSendOtp = false;
  // pageName = 'Health Checkup';
  // otp: any;
  // minDate: string = new Date().toISOString().split('T')[0];
  currentPackage: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private route: ActivatedRoute, private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      this.currentPackage = this.packages.find(p => p.slug === slug);

      if (this.currentPackage) {
        this.title.setTitle(this.currentPackage.metaTitle);

        this.meta.updateTag({
          name: 'description',
          content: this.currentPackage.metaDescription
        });
      }
    });

    // this.appointmentForm = this.fb.group({
    //   date: ['', Validators.required],
    //   name: ['', [Validators.required]],
    //   mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    //   otp: ['']
    // });

    // // Enable Send OTP button only when 3 fields are valid
    // this.appointmentForm.valueChanges.subscribe(() => {
    //   const dateValid = this.appointmentForm.get('date')?.valid;
    //   const nameValid = this.appointmentForm.get('name')?.valid;
    //   const mobileValid = this.appointmentForm.get('mobile')?.valid;

    //   this.canSendOtp = !!(dateValid && nameValid && mobileValid);
    // });


  }

  // sendOtp() {
  //   if (!this.canSendOtp) return;

  //   this.generateOtp();
  //   this.startOtpTimer();
  // }

  // generateOtp() {
  //   this.otpSent = true;
  //   this.otpVerified = false;
  //   this.otpInvalid = false;
  //   this.otpExpired = false;


  //   this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  //   console.log("OTP:", this.generatedOtp);
  //   this.http
  //     .post(`${this.apiUrl}/sms/send-otp-vasavi`, {
  //       patientName: this.appointmentForm.value.name,
  //       patientPhoneNumber: '91' + this.appointmentForm.value.mobile, // ensure with country code
  //       service: this.pageName,
  //       otp: this.generatedOtp,
  //     })
  //     .subscribe({
  //       next: () => {
  //         this.otpSent = true;
  //       },
  //       error: (err) => {
  //         console.error('❌ OTP send failed:', err);
  //         alert('❌ Failed to send OTP. Please try again.');
  //       },
  //     });
  // }

  // startOtpTimer() {
  //   this.timeLeft = 120;
  //   clearInterval(this.interval);

  //   this.interval = setInterval(() => {
  //     this.timeLeft--;

  //     if (this.timeLeft === 0) {
  //       clearInterval(this.interval);
  //       this.otpExpired = true;
  //       this.otpVerified = false;
  //       this.otpInvalid = false;
  //     }
  //   }, 1000);
  // }

  // resendOtp() {
  //   this.generateOtp();
  //   this.startOtpTimer();
  // }

  // verifyOtp() {
  //   if (this.otpExpired) return;

  //   const enteredOtp = String(this.appointmentForm.value.otp);

  //   if (enteredOtp === this.generatedOtp) {

  //     this.otpVerified = true;
  //     this.otpInvalid = false;
  //     this.otpExpired = false;
  //     this.bookAppointment();
  //   } else {
  //     this.otpVerified = false;
  //     this.otpInvalid = true;
  //   }
  // }

  // bookAppointment() {
  //   if (!this.otpVerified) return;
  //   console.log("Form Data:", this.appointmentForm.value);
  //   const appointmentDetails = {
  //     name: this.appointmentForm.value.name,
  //     phone: this.appointmentForm.value.mobile,
  //     date: this.appointmentForm.value.date,
  //     address: '',
  //     page: this.pageName,
  //   };

  //   const emailRequest = {
  //     // whatsappNumber:['919342287945'],
  //     whatsappNumber: ['919164840378'],
  //     to: ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com', 'Ceo@vasavihospitals.com'],
  //     // to:['inventionmindsblr@gmail.com'],
  //     status: 'Health Checkup Appointment Booking',
  //     appointmentDetails,
  //   };

  //   this.http.post(`${this.apiUrl}/email/send-pages-email`, emailRequest).subscribe({
  //     next: () => {
  //       this.router.navigate(['/thank-you']);
  //     },
  //     error: (err) => {
  //       console.error('❌ Email send failed:', err);
  //       alert('❌ Failed to send email. Please try again later.');
  //     },
  //   });


  //   this.appointmentForm.reset();
  //   this.otpSent = false;
  //   this.otpVerified = false;
  //   this.otpInvalid = false;
  //   this.otpExpired = false;
  //   clearInterval(this.interval);
  // }


  packages = [
    {
      slug: "diabetes-health-check",

      metaTitle: "Diabetes Health Check Package | Vasavi Hospital Bangalore",
      metaDescription: "Complete diabetes checkup package at Vasavi Hospital, Bangalore. Includes HbA1c, blood sugar tests, kidney screening & expert diabetology consultation.",

      // Banner section
      pageTitle: "Diabetes Health Check",
      pagePrice: "4000",
      pageSubtitle: "All-in-One Diabetes Care",
      pageDescription:
        "Track your blood sugar, heart, kidney, liver and overall health through a complete diabetes package.",

      // Banner Cards
      bannerCards: [
        { title: "39 tests", subtitle: "Complete diabetic evaluation" },
        { title: "Type 1 & Type 2", subtitle: "Suitable for all diabetics" },
        { title: "Complete Screening", subtitle: "Covers all major diabetes markers." }
      ],

      // About Section
      about: [
        {
          title: "Diabetes affects more than just your sugar.",
          subtitle:
            `<div>It can silently damage your <span>kidneys, eyes, nerves, heart, joints, and immunity</span> without showing symptoms</div> <br>

          <div>That’s why your check-up must be <span>full-body</span>, not just a sugar test. Our Master Diabetes Care Package covers <span>everything diabetes touches</span> - helping you catch problems early and stay in control.</div>`
        }
      ],
      aboutImage: "Images/health-package/diabetes.jpg",

      // Includes
      includesTitle: "What’s included in the package?",
      includesSubtitle:
        "Structured into investigations, imaging, cardiac care and specialist consultations.",
      includes: [
        {
          title: "Hematology",
          content: [
            "Complete Blood Count (CBC)",
            "ESR (Erythrocyte Sedimentation Rate)",
            "Peripheral Smear"
          ]
        },
        {
          title: "Biochemical Parameters",
          content: [
            "Fasting Blood Sugar & Post Prandial",
            "Urea",
            "Creatinine",
            "Uric Acid",
            "Glycosylated Hemoglobin (Hba1c)"
          ]
        },
        {
          title: "Cardiology",
          content: ["ECG (Resting)"]
        },
        {
          title: "Liver Function Test",
          content: [
            "Total Bilirubin",
            "Direct Bilirubin",
            "Indirect Bilirubin",
            "SGPT",
            "SGOT",
            "Alkaline Phosphatase",
            "Total Protein",
            "Albumin",
            "Globulin",
            "A/G Ratio"
          ]
        },
        {
          title: "Other Tests",
          content: [
            "Blood Grouping - Rh Typing",
            "Complete Urine Analysis",
            "Urine for Micro-albumin",
            "Stool Examination",
            "GGTP"
          ]
        },
        {
          title: "Lipid Profile Test",
          content: [
            "Total Cholesterol",
            "HDL Cholesterol",
            "LDL Cholesterol Triglycerides",
            "Total Cholesterol / HDL Ratio"
          ]
        },
        {
          title: "Radiology",
          content: ["Chest X-Ray", "Ultrasound - Abdomen", "Foot Scan"]
        },
        {
          title: "Consultations",
          content: [
            "Internal Medicine Consultation",
            "Surgical Consultation",
            "Diabetologist Consultation",
            "Ophthalmologist Consultation",
            "Dental Consultation",
            "One additional Consultation of customer’s choice (within 2 days)",
            "Dietitian Consultation"
          ]
        }
      ],



      // Why Choose
      whyChooseTitle: "Why choose this diabetes package?",
      whyChooseSubtitle:
        "Specially curated for long-term diabetes management, complication prevention and holistic lifestyle support.",
      whyChoose: [
        {
          icon: "fa-solid fa-check",
          content: "Integrated approach to diabetic care under one roof"
        },
        {
          icon: "fa-solid fa-check",
          content: "Designed by experienced diabetologists & physicians"
        },
        {
          icon: "fa-solid fa-check",
          content: "Prevention-focused: catch complications early"
        },
        {
          icon: "fa-solid fa-check",
          content: "Ideal for diabetics, prediabetics & high-risk individuals"
        }
      ],

      // Care With Us
      careTitle: "Your Care Journey With Us",
      careSubtitle:
        "Specially curated for long-term diabetes management, complication prevention and holistic lifestyle support.",
      careWith: [
        {
          img: "/Images/health-package/Ellipse 10.png",
          content: "Book your slot online or via call"
        },
        {
          img: "/Images/health-package/Ellipse 11.png",
          content: "Visit the center fasting, as advised by our team."
        },
        {
          img: "/Images/health-package/Ellipse 12.png",
          content: "Sample collection & scans as per package"
        },
        {
          img: "/Images/health-package/Ellipse 13.png",
          content: "Consultation with our specialist doctors"
        },
        {
          img: "/Images/health-package/Ellipse 14.png",
          content: "Personalised lifestyle & diet plan"
        }
      ],

      // Doctors Slide
      doctorSlide: [
        {
          name: "Dr. Vinay Hosadurga",
          img: "/Images/new-doctor-image/dr-vinay-hosadurga.png",
          alt: "Dr. Vinay Hosadurga | General Physician | Vasavi Hospitals Bangalore",
          experience: "14+",
          department: "General Medicine",
          slug: "/dr-vinay-hosadurga"
        },
        {
          name: "Dr. Sunil R",
          img: "/Images/new-doctor-image/dummy-male.png",
          alt: "Dr. Sunil R | Nephrologist | Vasavi Hospitals Bangalore",
          experience: "15+",
          department: "Nephrology",
          slug: "/dr-sunil-r"
        },
        // {
        //   name: "Dr. Gargi Das",
        //   img: "/Images/new-doctor-image/Dr Gargi Das.png",
        //   alt: "Dr Gargi Das - Consultant Ophthalmologist | Vasavi Hospitals Bangalore",
        //   experience: "6+",
        //   department: "Ophthalmology",
        //   slug: "/dr-gargi-das"
        // },
        {
          name: "Dr. Ramesh Hanumegowda",
          img: "Images/new-doctor-image/dr-ramesh-hanumegowda-urologist-transparent.png",
          alt: "Best General Surgeon in Bangalore | Dr. Ramesh T S",
          experience: "15+",
          department: "Urology",
          slug: "/dr-ramesh-hanumegowda"
        },
        {
          name: "Dr. Nisha Buchade",
          img: "Images/go/dr-nisha-buchade-sq.png",
          alt: "Best Gynecologic Oncologist | Dr. Nisha Buchade",
          experience: "15+",
          department: "Obstetrics and Gynaecology",
          slug: "/dr-nisha-buchade"
        },
        // {
        //   name: "Dr. Naneboena Sunitha",
        //   img: "/Images/new-doctor-image/dr-naneboena-sunitha-sq.png",
        //   alt: "Dr Naneboena Sunitha | Consultant Nutritionist",
        //   experience: "26+",
        //   department: "Nutrition & Dietetics",
        //   slug: "/dr-naneboena-sunitha"
        // }
      ],

      // CTA
      ctaTitle: "Ready to take charge of your diabetes?",
      ctaSubtitle:
        "Book your Master Diabetes Care package and start your journey towards better sugar control and a healthier life.",

      // FAQ
      faqs: [
        {
          title: "Who should opt for the Annual Master Diabetes Care Package?",
          content:
            "Anyone with diabetes, prediabetes, family history of diabetes, obesity, or lifestyle risk factors will benefit from this annual package."
        },
        {
          title: "How many visits are covered in a year?",
          content:
            "The package covers multiple lab visits, cardiac evaluations twice a year, radiology once a year and up to four specialist consultations depending on the service."
        },
        {
          title: "Do I need to come fasting?",
          content:
            "Yes, for accurate blood sugar and lipid profile results, you will be advised to come fasting for specific visits. Our team will guide you when you book."
        },
        {
          title: "Is this package suitable for elderly patients?",
          content:
            "Yes. Regular monitoring through this package is highly recommended for elderly patients with diabetes or multiple risk factors."
        }
      ],
    },

    //Cardiac Health Package

    {
      slug: "cardiac-wellness-package",
      metaTitle: "Cardiac Health Check Package | Vasavi Hospital Bangalore",
      metaDescription: "Comprehensive cardiac health check package at Vasavi Hospital, Bangalore. Includes ECG, echo, blood tests & cardiologist consultation for early detection.",


      // Banner section
      pageTitle: "Cardiac Health Package",
      pagePrice: "5999",
      pageSubtitle: "All-in-One Cardiac Care",
      pageDescription:
        "Monitor your heart health with a complete cardiac evaluation designed to detect risks early, prevent complications, and support long-term cardiac wellbeing. This package includes essential tests for your heart, blood, cholesterol, liver, thyroid, and overall body function - along with specialist consultations.",

      // Banner Cards
      bannerCards: [
        { title: "30+ Tests", subtitle: "Complete cardiac & general health evaluation" },
        { title: "Heart Risk Detection", subtitle: "Screens for cholesterol, BP, sugar & cardiac markers" },
        { title: "Advanced Cardiac Checks", subtitle: "Includes ECG, 2D Echo & TMT (Stress Test)" }
      ],

      // About Section
      about: [
        {
          title: "Heart disease affects more than just your heart.",
          subtitle:
            `<div>It can silently impact your blood vessels, brain, kidneys, lungs, and overall energy levels without showing obvious symptoms.</div> <br>

          <div>That’s why your heart check-up must be comprehensive, not just an ECG. Our Master Cardiac Health Package covers every major factor that influences your heart – helping you detect risks early, prevent complications, and stay heart-healthy for life.</div>`
        }
      ],
      aboutImage: "Images/health-package/Cardiology.png",

      // Includes
      includesTitle: "What’s included in the package?",
      includesSubtitle:
        "Structured into investigations, imaging, cardiac care and specialist consultations.",
      includes: [
        {
          title: "Hematology",
          content: [
            "Complete Blood Count(CBC)",
            "Peripheral Smear",
            "ESR (Erythrocyte Sedimentation Rate)"
          ]
        },
        {
          title: "Biochemical Parameters",
          content: [
            "Iron Profile",
            "Random Blood Sugar",
            "Electrolytes (Sodium,Potassium, Chloride)",
            "Blood Urea",
            "Serum Creatinine",
            "Uric Acid",
            "Glycosylated Hemoglobin (HbA1C)",
            "Vitamin B12",
            "Total 25 OH Vitamin D",
            "CPK"
          ]
        },
        {
          title: "Lipid Profile Test",
          content: ["Lipid Profile"]
        },
        {
          title: "Cardiology",
          content: [
            "ECG",
            "2D Echo Cardiograph",
            "Tread Mill Test (TMT)",
          ]
        },
        {
          title: "Liver Function Test",
          content: [
            "Liver Function Test(LFT)",
            "Gamma-Glutamyl Transferase (GGT)",
          ]
        },
        {
          title: "Other Tests",
          content: [
            "Urine Routine",
            "TSH (Thyroid Stimulating Hormone)",
            "Chest PA View (X-Ray)",
            "Abdomen & Pelvis (USG)"
          ]
        },
        {
          title: "Consultations",
          content: [
            "Cardiologist Consultation",
            "Ophthalmologist Consultation",
            "Dietitian Consultation"
          ]
        }
      ],



      // Why Choose
      whyChooseTitle: "Why choose this cardiac package?",
      whyChooseSubtitle:
        "Specially curated for long-term heart health, early risk detection, and complete cardiovascular wellness.",
      whyChoose: [
        {
          icon: "fa-solid fa-check",
          content: "Comprehensive approach to cardiac care under one roof"
        },
        {
          icon: "fa-solid fa-check",
          content: "Designed by expert cardiologists & senior physicians"
        },
        {
          icon: "fa-solid fa-check",
          content: "Focus on prevention: detect heart risks early"
        },
        {
          icon: "fa-solid fa-check",
          content: "Ideal for heart patients, high-risk individuals & family history cases"
        }
      ],

      // Care With Us
      careTitle: "Your Care Journey With Us",
      careSubtitle:
        "Specially curated for long-term heart health, early detection, and complete cardiac wellness.",
      careWith: [
        {
          img: "/Images/health-package/Ellipse 10.png",
          content: "Book your slot online or via call"
        },
        {
          img: "/Images/health-package/Ellipse 11.png",
          content: " Visit the center as per fasting / test instructions"
        },
        {
          img: "/Images/health-package/Ellipse 12.png",
          content: "Sample collection & cardiac scans as per package"
        },
        {
          img: "/Images/health-package/Ellipse 13.png",
          content: "Consultation with our expert cardiologists"
        },
        {
          img: "/Images/health-package/Ellipse 14.png",
          content: "Personalized lifestyle, cardiac risk & diet plan"
        }
      ],

      // Doctors Slide
      doctorSlide: [
        {
          name: "Dr. Krishna Kumar B R",
          img: "/Images/new-doctor-image/dr-krishna-kumar-b-r-sq.png",
          alt: "Dr. Krishna Kumar B R | Cardiologist | Vasavi Hospitals Bangalore",
          experience: "17+",
          qualification: "MBBS, Diploma Clinical Cardiology",
          department: "Cardiology",
          consultant: "Consultant Cardiologist",
          slug: "/dr-krishna-kumar-b-r"
        },
      ],

      // CTA
      ctaTitle: "Ready to take charge of your heart health?",
      ctaSubtitle:
        "Book your Master Cardiac Health Package and start your journey towards better heart care, early risk detection, and a healthier life.",

      // FAQ
      faqs: [
        {
          title: "Who should opt for the Cardiac Health Package?",
          content:
            "Anyone with chest discomfort, breathlessness, high BP, high cholesterol, diabetes, a sedentary lifestyle, or a family history of heart disease."
        },
        {
          title: "How many visits are included in the package?",
          content:
            "The package includes one complete evaluation visit with tests, scans, and a specialist cardiology consultation."
        },
        {
          title: "Do I need to come fasting for the tests?",
          content:
            "Yes, fasting is recommended for accurate cholesterol and blood sugar-related tests. Our team will guide you before your visit."
        },
        {
          title: "Is this package suitable for elderly patients?",
          content:
            "Absolutely. The package is ideal for seniors, as it checks heart function, rhythm, cholesterol, and overall cardiac risk factors."
        }
      ],
    },

    //Cardiac Annual Package
    {
      slug: "comprehensive-annual-heart-care-package",
      metaTitle: "Cardiac Health Check Package | Vasavi Hospital Bangalore",
      metaDescription: "Comprehensive cardiac health check package at Vasavi Hospital, Bangalore. Includes ECG, echo, blood tests & cardiologist consultation for early detection.",


      // Banner section
      pageTitle: "Comprehensive Annual Heart Care Package",
      pagePrice: "6999",
      pageSubtitle: "One Year Heart Care",
      pageDescription: "Track your heart health, blood pressure, cholesterol, and overall cardiac function through a complete annual heart care package.",
      // Banner Cards
      bannerCards: [
        { title: "40+ Tests", subtitle: "Comprehensive cardiac evaluation" },
        { title: "Preventive & Diagnostic", subtitle: "Suitable for all heart risk groups" },
        { title: "Complete Heart Screening", subtitle: "Covers all major cardiac markers" }
      ],

      // About Section
      about: [
        {
          title: "Heart health needs year-round care, not occasional check-ups.",
          subtitle:
            `<div>Heart problems often develop silently, affecting blood flow, blood pressure, and overall vitality long before warning signs appear.</div> <br>

          <div>That’s why Vasavi Hospitals Comprehensive Annual Cardiac Care Plan focuses on regular heart monitoring, timely diagnostics, and expert cardiology consultations throughout the year - helping you detect risks early, protect your heart, and live with confidence every day.</div>`
        }
      ],
      aboutImage: "Images/health-package/red-heart-with-word-human-middle.png",

      // Includes
      includesTitle: "What’s included in the package?",
      includesSubtitle:
        "Structured into investigations, imaging, cardiac care and specialist consultations.",
      includes: [
        {
          title: "Haematology",
          content: [
            "Complete Blood Count (CBC) (4 times / year)"
          ]
        },
        {
          title: "Biochemical Parameters",
          content: [
            "Fasting Blood Sugar (FBS) (4 times / year)",
            "Post Prandial Blood Sugar (PPBS) (4 times / year)",
            "HbA1c (3 times / year)",
            "Serum Creatinine (3 times / year)"
          ]
        },
        {
          title: "Lipid Profile Test",
          content: [
            "Lipid Profile (3 times / year)"
          ]
        },
        {
          title: "Cardiology",
          content: [
            "ECG (4 times / year)",
            "2D ECHO (2 times / year)",
            "TMT – Treadmill Test (Once / year)",
            "CPK (Once / year)",
            "CPK-MB (Once / year)"
          ]
        },
        {
          title: "Radiology",
          content: [
            "Chest X-Ray (2 times / year)"
          ]
        },
        {
          title: "Consultations",
          content: [
            "Cardiologist Consultation (4 times / year)",
            "General Physician Consultation (4 times / year)",
            "Dietician Consultation (4 times / year)"
          ]
        }
      ],

      // Why Choose
      whyChooseTitle: "Why choose this cardiac package?",
      whyChooseSubtitle:
        "Specially curated for long-term heart health, early risk detection, and complete cardiovascular wellness.",
      whyChoose: [
        {
          icon: "fa-solid fa-check",
          content: "One-year comprehensive heart care"
        },
        {
          icon: "fa-solid fa-check",
          content: "Expert cardiology supervision"
        },
        {
          icon: "fa-solid fa-check",
          content: "Preventive & diagnostic coverage"
        },
        {
          icon: "fa-solid fa-check",
          content: "Affordable annual package"
        }
      ],

      // Care With Us
      careTitle: "Your Care Journey With Us",
      careSubtitle:
        "Specially curated for long-term heart health, early detection, and complete cardiac wellness.",
      careWith: [
        {
          img: "/Images/health-package/Ellipse 10.png",
          content: "Book your slot online or via call"
        },
        {
          img: "/Images/health-package/Ellipse 11.png",
          content: " Visit the center as per fasting / test instructions"
        },
        {
          img: "/Images/health-package/Ellipse 12.png",
          content: "Sample collection & cardiac scans as per package"
        },
        {
          img: "/Images/health-package/Ellipse 13.png",
          content: "Consultation with our expert cardiologists"
        },
        {
          img: "/Images/health-package/Ellipse 14.png",
          content: "Personalized lifestyle, cardiac risk & diet plan"
        }
      ],

      // Doctors Slide
      doctorSlide: [

        {
          name: "Dr. Krishna Kumar B R",
          img: "/Images/new-doctor-image/dr-krishna-kumar-b-r-sq.png",
          alt: "Dr. Krishna Kumar B R | Cardiologist | Vasavi Hospitals Bangalore",
          experience: "17+",
          qualification: "MBBS, Diploma Clinical Cardiology",
          department: "Cardiology",
          consultant: "Consultant Cardiologist",
          slug: "/dr-krishna-kumar-b-r"
        },

      ],

      // CTA
      ctaTitle: "Ready to take charge of your heart health?",
      ctaSubtitle:
        `Book your Comprehensive Annual Heart Care Package and start your journey towards better heart care,
         early risk detection, and a healthier life.`,

      // FAQ
      faqs: [
        {
          title: "Who should take the Annual Cardiac Care Package?",
          content:
            "This package is ideal for individuals with heart disease, high blood pressure, diabetes, family history of heart problems, or those above 40 years of age."
        },
        {
          title: "Does this package help in early detection of heart disease?",
          content:
            "Yes. Regular monitoring helps detect heart risks early, even before symptoms appear."
        },
        {
          title: "How long is the package valid?",
          content:
            "The package is valid for one full year (365 days) from activation."
        },
        {
          title: "Are diet and lifestyle consultations included?",
          content:
            "Yes. The package includes dietician and lifestyle guidance to support heart health."
        },
        {
          title: "Is this package useful for patients without known heart disease?",
          content:
            "Yes. It is also suitable for preventive heart health screening, especially for high-risk individuals."
        }
      ],
    },



    //Comprehensive Annual Diabetes Care Package
    {
      slug: "comprehensive-annual-diabetes-care-package",
      metaTitle: "",
      metaDescription: "",


      // Banner section
      pageTitle: "Comprehensive Annual Diabetes Care Package",
      pagePrice: "9999",
      pageSubtitle: "One plan Full year",
      pageDescription: "Track your blood sugar, kidney, heart, liver, and overall health through a complete annual diabetes care package.",
      // Banner Cards
      bannerCards: [
        { title: "39+ Tests", subtitle: "Comprehensive diabetes evaluation" },
        { title: "Type 1 & Type 2", subtitle: "Suitable for all diabetics" },
        { title: "Complete Diabetes Screening", subtitle: "Covers all major diabetes markers" }
      ],

      // About Section
      about: [
        {
          title: "Diabetes needs year-round care, not occasional tests.",
          subtitle:
            `<div>Diabetes is a lifelong condition that can silently affect your heart, kidneys, eyes, nerves, and overall wellbeing if not monitored regularly.</div> <br>

          <div>That’s why Vasavi Hospitals Comprehensive Annual Diabetes Care Plan focuses on continuous monitoring, timely investigations, and expert consultations throughout the year - helping you stay in control, avoid complications, and live healthier every day.</div>`
        }
      ],
      aboutImage: "Images/health-package/doctor-use-digital-glucose-monitor-measure-test-stripe-check-diabetes-from-finger-blood-sugar-level.jpg",

      // Includes
      includesTitle: "What’s included in the package?",
      includesSubtitle:
        "Structured into investigations, imaging, Diabetes care and specialist consultations.",
      includes: [
        {
          title: "Haematology",
          content: [
            "Complete Blood Count (CBC) (2 times / year)"
          ]
        },
        {
          title: "Biochemical Parameters",
          content: [
            "Fasting Blood Sugar (FBS) (4 times / year)",
            "Post Prandial Blood Sugar (PPBS) (4 times / year)",
            "HbA1c (4 times / year)",
            "Urine Microalbumin (4 times / year)",
            "Renal Function Test (RFT) (3 times / year)",
            "Thyroid Stimulating Hormone (TSH) (2 times / year)"
          ]
        },
        {
          title: "Lipid Profile Test",
          content: [
            "Lipid Profile (2 times / year)"
          ]
        },
        {
          title: "Liver Function Test",
          content: [
            "Liver Function Test (LFT) (2 times / year)"
          ]
        },
        {
          title: "Cardiology",
          content: [
            "ECG (2 times / year)",
            "TMT – Treadmill Test (Once / year)",
            "2D ECHO (Once / year)"
          ]
        },
        {
          title: "Radiology",
          content: [
            "Chest X-Ray (Once / year)",
            "USG Abdomen & Pelvis (Once / year)"
          ]
        },
        {
          title: "Special Tests",
          content: [
            "CT Calcium Scoring (Once / year)"
          ]
        },
        {
          title: "Other Tests",
          content: [
            "Physiotherapy (if required) (Once / year)"
          ]
        },
        {
          title: "Consultations",
          content: [
            "Physician / Diabetologist Consultation (4 times / year)",
            "Lifestyle Management Consultation (4 times / year)",
            "Dietician Consultation (4 times / year)"
          ]
        }
      ],

      // Why Choose
      whyChooseTitle: "Why choose this Diabetes package?",
      whyChooseSubtitle:
        "Specially curated for long-term heart health, early risk detection, and complete cardiovascular wellness.",
      whyChoose: [
        {
          icon: "fa-solid fa-check",
          content: "Year-round diabetes care under one roof"
        },
        {
          icon: "fa-solid fa-check",
          content: " Expert-led by diabetologists & physicians"
        },
        {
          icon: "fa-solid fa-check",
          content: "Regular monitoring to prevent complications"
        },
        {
          icon: "fa-solid fa-check",
          content: "Covers heart, kidney & overall health"
        }
      ],

      // Care With Us
      careTitle: "Your Care Journey With Us",
      careSubtitle:
        "Specially curated for long-term heart health, early detection, and complete Diabetes wellness.",
      careWith: [
        {
          img: "/Images/health-package/Ellipse 10.png",
          content: "Book your slot online or via call"
        },
        {
          img: "/Images/health-package/Ellipse 11.png",
          content: " Visit the center as per fasting / test instructions"
        },
        {
          img: "/Images/health-package/Ellipse 12.png",
          content: "Sample collection & Diabetes scans as per package"
        },
        {
          img: "/Images/health-package/Ellipse 13.png",
          content: "Consultation with our expert cardiologists"
        },
        {
          img: "/Images/health-package/Ellipse 14.png",
          content: "Personalized lifestyle, Diabetes risk & diet plan"
        }
      ],

      // Doctors Slide
      doctorSlide: [
        {
          name: "Dr. Vinay Hosadurga",
          img: "/Images/new-doctor-image/dr-vinay-hosadurga.png",
          alt: "Dr. Vinay Hosadurga | General Physician | Vasavi Hospitals Bangalore",
          experience: "14+",
          department: "General Medicine",
          slug: "/dr-vinay-hosadurga"
        },
        {
          name: "Dr. Sunil R",
          img: "/Images/new-doctor-image/dummy-male.png",
          alt: "Dr. Sunil R | Nephrologist | Vasavi Hospitals Bangalore",
          experience: "15+",
          department: "Nephrology",
          slug: "/dr-sunil-r"
        },
        {
          name: "Dr. Gargi Das",
          img: "/Images/new-doctor-image/Dr Gargi Das.png",
          alt: "Dr Gargi Das - Consultant Ophthalmologist | Vasavi Hospitals Bangalore",
          experience: "6+",
          department: "Ophthalmology",
          slug: "/dr-gargi-das"
        },
        {
          name: "Dr. Ramesh Hanumegowda",
          img: "Images/new-doctor-image/dr-ramesh-hanumegowda-urologist-transparent.png",
          alt: "Best General Surgeon in Bangalore | Dr. Ramesh T S",
          experience: "15+",
          department: "Urology",
          slug: "/dr-ramesh-hanumegowda"
        },
        {
          name: "Dr. Nisha Buchade",
          img: "Images/go/dr-nisha-buchade-sq.png",
          alt: "Best Gynecologic Oncologist | Dr. Nisha Buchade",
          experience: "15+",
          department: "Obstetrics and Gynaecology",
          slug: "/dr-nisha-buchade"
        },
        {
          name: "Dr. Naneboena Sunitha",
          img: "/Images/new-doctor-image/dr-naneboena-sunitha-sq.png",
          alt: "Dr Naneboena Sunitha | Consultant Nutritionist",
          experience: "26+",
          department: "Nutrition & Dietetics",
          slug: "/dr-naneboena-sunitha"
        }
      ],

      // CTA
      ctaTitle: "Ready to take charge of your heart health?",
      ctaSubtitle:
        `Book your Comprehensive Annual Diabetes Care Plan and start your journey towards better heart care, 
        early risk detection, and a healthier life.`,

      // FAQ
      faqs: [
        {
          title: "Who should opt for the Annual Diabetes Care Plan?",
          content:
            "This plan is ideal for people with Type 1 or Type 2 diabetes, prediabetes, or those at high risk due to family history, obesity, or lifestyle factors."
        },
        {
          title: "How is this plan different from a regular diabetes check-up?",
          content:
            "Unlike one-time tests, this plan offers year-round monitoring, repeated investigations, and regular doctor consultations to help manage diabetes continuously."
        },
        {
          title: "Does the package include doctor consultations?",
          content:
            "Yes. The plan includes Physician/Diabetologist, Lifestyle Management, and Dietician consultations multiple times a year."
        },
        {
          title: "Is this package suitable for newly diagnosed diabetics?",
          content:
            "Absolutely. It helps newly diagnosed patients understand their condition early and start structured treatment and monitoring."
        }
      ],
    },

    //Basic Health Check Package
    {
      slug: "basic-health-check-package",
      metaTitle: "",
      metaDescription: "",


      // Banner section
      pageTitle: "Basic Health Check Package",
      pagePrice: "1700",
      pageSubtitle: "Essential Preventive Care",
      pageDescription: "Track your blood sugar, cholesterol, heart health, kidneys and overall wellness with a simple yet complete health screening.",
      // Banner Cards
      bannerCards: [
        { title: "Essential Tests", subtitle: "Covers key health markers" },
        { title: "Early Detection", subtitle: "Identify health risks early" },
        { title: "Annual Screening", subtitle: "Ideal for routine check-ups" }
      ],

      // About Section
      about: [
        {
          title: "A simple check today can prevent serious problems tomorrow",
          subtitle:
            `<div>Many health conditions begin silently - without pain or visible symptoms. A basic health screening helps identify early warning signs related to blood sugar, cholesterol, heart health, liver, kidneys, and general well-being.</div> <br>

          <div>Our Basic Health Check Package is ideal for anyone looking to stay proactive about their health with essential tests and expert consultations - all at an affordable cost.</div>`
        }
      ],
      aboutImage: "/Images/health-package/basic-health-check-package.jpg",

      // Includes
      includesTitle: "What’s Included in the Package?",
      includesSubtitle:
        "The package is thoughtfully structured into laboratory tests, cardiac evaluation, imaging, and specialist consultations.",
      includes: [
        {
          title: "Haematology",
          content: [
            "Complete Blood Count (CBC)",
            "ESR (Erythrocyte Sedimentation Rate)"
          ]
        },
        {
          title: "Biochemical Parameters",
          content: [
            "Fasting Blood Sugar (FBS)",
            "Post Prandial Blood Sugar (PPBS)",
            "Creatinine"
          ]
        },
        {
          title: "Lipid Profile Test",
          content: [
            "Total Cholesterol",
            "HDL Cholesterol",
            "LDL Cholesterol",
            "Triglycerides",
            "Total Cholesterol / HDL Ratio",
          ]
        },
        {
          title: "Cardiology",
          content: [
            "ECG (Resting)"
          ]
        },
        {
          title: "Radiology",
          content: [
            "Chest X-Ray",
            "Ultrasound - Abdomen"
          ]
        },
        {
          title: "Other Tests",
          content: [
            "Blood Grouping - Rh Typing",
            "Complete Urine Analysis",
            "Stool Test - Occult Blood"
          ]
        },
        {
          title: "Consultations",
          content: [
            "Internal Medicine Consultation",
            "Dental Consultation",
            "Dietitian Consultation"
          ]
        }
      ],

      // Why Choose
      whyChooseTitle: "Why Choose This Basic Health Check Package?",
      whyChooseSubtitle: "",
      whyChoose: [
        {
          icon: "fa-solid fa-check",
          content: "Covers key health indicators in one visit"
        },
        {
          icon: "fa-solid fa-check",
          content: "Helps detect early signs of diabetes, cholesterol issues, kidney problems & heart risks"
        },
        {
          icon: "fa-solid fa-check",
          content: "Ideal for annual preventive health screening"
        },
        {
          icon: "fa-solid fa-check",
          content: "Expert consultations included for better clarity and guidance"
        },
        {
          icon: "fa-solid fa-check",
          content: "Affordable, reliable, and time-efficient"
        }
      ],

      // Care With Us
      careTitle: "Your Health Check Journey With Us",
      careSubtitle:
        "",
      careWith: [
        {
          img: "/Images/health-package/Ellipse 10.png",
          content: "Book your appointment online or via call"
        },
        {
          img: "/Images/health-package/Ellipse 11.png",
          content: "Visit the center fasting, as advised by our team"
        },
        {
          img: "/Images/health-package/Ellipse 12.png",
          content: "Sample collection, scans, and ECG"
        },
        {
          img: "/Images/health-package/Ellipse 13.png",
          content: "Consultation with doctors and specialists"
        },
        {
          img: "/Images/health-package/Ellipse 14.png",
          content: "Basic dietary and lifestyle guidance"
        }
      ],

      // Doctors Slide
      doctorSlide: [
        {
          name: "Dr. Vinay Hosadurga",
          img: "/Images/doctor-page/dr-vinay-hosadurga.png",
          alt: "Dr. Vinay Hosadurga | General Physician | Vasavi Hospitals Bangalore",
          experience: "14+",
          qualification: "MBBS, MD (General Medicine)",
          department: "General Medicine",
          consultant: "Consultant Physician",
          slug: "/dr-vinay-hosadurga"
        },
        {
          name: "Dr. Revathi Natesan",
          img: "/Images/new-doctor-image/dr-revathi-natesan.png",
          alt: "Dr. Revathi Natesan | Endodontist | Vasavi Hospitals Bangalore",
          experience: "15+",
          qualification: "MDS Conservative Dentistry & Endodontics",
          department: "Dentistry",
          consultant: "Consultant Endodontist",
          slug: "/dr-revathi-natesan"
        },
        // {
        //   name: "Dr. Sneha Sundaram",
        //   img: "/Images/new-doctor-image/dummy-female.png",
        //   alt: "Dr. Sneha Sundaram | Endodontist | Vasavi Hospitals Bangalore",
        //   experience: "13+",
        //   qualification: "BDS, MDS",
        //   department: "Dentistry",
        //   consultant: "Consultant Endodontist",
        //   slug: "/dr-sneha-sundaram"
        // },
        // {
        //   name: "Dr. Naneboena Sunitha",
        //   img: "/Images/new-doctor-image/dr-naneboena-sunitha.png",
        //   alt: "Dr. Naneboena Sunitha | Nutritionist | Vasavi Hospitals Bangalore",
        //   experience: "26+",
        //   qualification: "PhD Food & Nutrition",
        //   department: "Nutrition",
        //   consultant: "Consultant Nutritionist & Dietitian",
        //   slug: "/dr-naneboena-sunitha"
        // },
      ],

      // CTA
      ctaTitle: "Take the First Step Toward Better Health",
      ctaSubtitle:
        `Regular health checks help you stay informed, confident, and in control.
 Book your Basic Health Check Package today and invest in your well-being.`,

      // FAQ
      faqs: [
        {
          title: "Do I need to come fasting for this package?",
          content:
            "Yes. Fasting is required for accurate blood sugar and lipid profile results. Our team will guide you during booking."
        },
        {
          title: "How long will the health check take?",
          content:
            "Most tests and consultations are completed within a single visit."
        },
        {
          title: "Is this package suitable for first-time health check-ups?",
          content:
            "Absolutely. This package is ideal for individuals starting their preventive health journey."
        },
        {
          title: "Can elderly patients opt for this package?",
          content:
            "Yes. However, based on medical history, doctors may recommend additional tests if needed."
        }
      ],
    },


    //Well Women Health Check-Up
    {
      slug: "well-women-health-check-up",
      metaTitle: "",
      metaDescription: "",


      // Banner section
      pageTitle: "Well Women Health Check-Up",
      pagePrice: "1999",
      pageSubtitle: "Complete Women’s Wellness Care",
      pageDescription: "A comprehensive health check designed to support hormonal balance, breast health, thyroid function, and overall well-being in women.",
      // Banner Cards
      bannerCards: [
        { title: "Women-Specific Tests", subtitle: "Breast & cervical screening" },
        { title: "Hormonal Health", subtitle: "Thyroid & metabolic checks" },
        { title: "Preventive Care", subtitle: "Early detection & guidance" }
      ],

      // About Section
      about: [
        {
          title: "Because a woman’s health needs special attention at every stage of life",
          subtitle:
            `<div>Women experience unique health changes across different life stages - from hormonal shifts and nutritional needs to reproductive and breast health. Many of these conditions develop silently and are best managed when detected early.</div> <br>

          <div>The Vasavi Well Women Health Check-Up is specially designed to support preventive care, early detection, and long-term wellness for women of all ages.</div>`
        }
      ],
      aboutImage: "Images/health-package/well-women-health-check-up.png",

      // Includes
      includesTitle: "What’s Included in the Package?",
      includesSubtitle:
        "The package is thoughtfully structured into laboratory investigations, imaging, and specialist consultations.",
      includes: [
        {
          title: "Haematology",
          content: [
            "Complete Blood Count (CBC)",
            "ESR (Erythrocyte Sedimentation Rate)"
          ]
        },
        {
          title: "Biochemical Parameters",
          content: [
            "Fasting Blood Sugar (FBS)",
            "Post Prandial Blood Sugar (PPBS)",

          ]
        },
        {
          title: "Radiology",
          content: [
            "Mammography - Both Breasts (X-ray)",
            "Ultrasound - Abdomen"
          ]
        },
        {
          title: "Other Tests",
          content: [
            "Pap Smear Test",
            "Breast Examination (Clinical)",
            "Thyroid Profile - T3, T4, TSH",
            "Blood Grouping - Rh Typing",
            "Total Cholesterol",
            "Serum Calcium",
            "Complete Urine Routine"
          ]
        },
        {
          title: "Consultations",
          content: [
            "Gynaecology Consultation",
            "Dental Consultation",
            "Dietitian Consultation"
          ]
        }
      ],

      // Why Choose
      whyChooseTitle: "Why Choose the Vasavi Well Women Health Check-Up?",
      whyChooseSubtitle: "",
      whyChoose: [
        {
          icon: "fa-solid fa-check",
          content: "Designed specifically for women’s preventive healthcare"
        },
        {
          icon: "fa-solid fa-check",
          content: "Focuses on breast, cervical, hormonal, and metabolic health"
        },
        {
          icon: "fa-solid fa-check",
          content: "Helps in early detection of thyroid disorders, diabetes & cholesterol issues"
        },
        {
          icon: "fa-solid fa-check",
          content: "Comprehensive evaluation under one roof"
        },
        {
          icon: "fa-solid fa-check",
          content: "Guidance from experienced specialists"
        }
      ],

      // Care With Us
      careTitle: "Your Wellness Journey With Us",
      careSubtitle:
        "",
      careWith: [
        {
          img: "/Images/health-package/Ellipse 10.png",
          content: "Book your appointment online or via call"
        },
        {
          img: "/Images/health-package/Ellipse 11.png",
          content: "Visit the center fasting, as advised"
        },
        {
          img: "/Images/health-package/Ellipse 12.png",
          content: "Sample collection, imaging, and screenings"
        },
        {
          img: "/Images/health-package/Ellipse 13.png",
          content: "Consultation with specialists"
        },
        {
          img: "/Images/health-package/Ellipse 14.png",
          content: "Personalised diet and lifestyle guidance"
        }
      ],

      // Doctors Slide
      doctorSlide: [
        {
          name: "Dr. Nisha Buchade",
          img: "Images/go/dr-nisha-buchade-sq.png",
          alt: "Best Gynecologic Oncologist | Dr. Nisha Buchade",
          experience: "15+",
          department: "Obstetrics and Gynaecology",
          slug: "/dr-nisha-buchade"
        },
        // {
        //   name: "Dr. Sowmya Sangamesh",
        //   img: "/Images/new-doctor-image/dr-sowmya-sangmesh.png",
        //   alt: "Dr. Sowmya Sangamesh | Gynecologist | Vasavi Hospitals Bangalore",
        //   experience: "14+",
        //   qualification: "MBBS, MS (OBG)",
        //   department: "Gynecology",
        //   consultant: "Consultant Gynec Laparoscopic Surgeon",
        //   slug: "/dr-sowmya-sangamesh"
        // },
        {
          name: "Dr. Revathi Natesan",
          img: "/Images/new-doctor-image/dr-revathi-natesan.png",
          alt: "Dr. Revathi Natesan | Endodontist | Vasavi Hospitals Bangalore",
          experience: "15+",
          qualification: "MDS Conservative Dentistry & Endodontics",
          department: "Dentistry",
          consultant: "Consultant Endodontist",
          slug: "/dr-revathi-natesan"
        },
        // {
        //   name: "Dr. Sneha Sundaram",
        //   img: "/Images/new-doctor-image/dummy-female.png",
        //   alt: "Dr. Sneha Sundaram | Endodontist | Vasavi Hospitals Bangalore",
        //   experience: "13+",
        //   qualification: "BDS, MDS",
        //   department: "Dentistry",
        //   consultant: "Consultant Endodontist",
        //   slug: "/dr-sneha-sundaram"
        // },
        // {
        //   name: "Dr. Naneboena Sunitha",
        //   img: "/Images/new-doctor-image/dr-naneboena-sunitha.png",
        //   alt: "Dr. Naneboena Sunitha | Nutritionist | Vasavi Hospitals Bangalore",
        //   experience: "26+",
        //   qualification: "PhD Food & Nutrition",
        //   department: "Nutrition",
        //   consultant: "Consultant Nutritionist & Dietitian",
        //   slug: "/dr-naneboena-sunitha"
        // },

      ],

      // CTA
      ctaTitle: "Take Charge of Your Health Today",
      ctaSubtitle:
        `Regular health screenings empower women to stay confident, healthy, and informed.
Book the Vasavi Well Women Health Check-Up and prioritize your well-being.`,

      // FAQ
      faqs: [
        {
          title: "Do I need to come fasting for this package?",
          content:
            "Yes. Fasting is required for accurate blood sugar evaluation. Our team will guide you during booking."
        },
        {
          title: "Is this package safe and comfortable?",
          content:
            "Yes. All tests are conducted in a safe, private, and patient-friendly environment."
        },
        {
          title: "Is mammography mandatory for all age groups?",
          content:
            "Mammography is generally recommended for women above a certain age or based on medical advice. Our doctors will guide you appropriately."
        },
        {
          title: "Can this package be done annually?",
          content:
            "Yes. An annual well-woman check-up is highly recommended for preventive health and early detection."
        }
      ],
    },

    //Vasavi Master Health Check – Men
    {
      slug: "vasavi-master-health-check-men",
      metaTitle: "",
      metaDescription: "",


      // Banner section
      pageTitle: "Master Health Check – Men",
      pagePrice: "4000",
      pageSubtitle: "Comprehensive Men’s Health Assessment",
      pageDescription: "An all-inclusive health evaluation covering heart, liver, lungs, metabolism, and nutritional status for long-term wellness.",
      // Banner Cards
      bannerCards: [
        { title: "Advanced Screening", subtitle: "40+ essential health checks" },
        { title: "Heart & Lung Care", subtitle: "ECG, Echo & PFT included" },
        { title: "Lifestyle Risk Control", subtitle: "Detect issues before symptoms" }
      ],

      // About Section
      about: [
        {
          title: "A complete health assessment for today’s lifestyle challenges",
          subtitle:
            `<div>Men often delay health check-ups until symptoms appear. However, lifestyle-related conditions such as diabetes, heart disease, liver disorders, vitamin deficiencies, and respiratory issues can develop silently over time.</div> <br>

          <div>The Vasavi Master Health Check – Men is a comprehensive preventive screening package designed to evaluate overall health, detect risks early, and support long-term well-being.</div>`
        }
      ],
      aboutImage: "/Images/health-package/master-health-check–men.jpg",

      // Includes
      includesTitle: "What’s Included in the Package?",
      includesSubtitle:
        "This master package is structured into advanced laboratory investigations, cardiac evaluation, imaging, special tests and expert consultations.",
      includes: [
        {
          title: "Haematology",
          content: [
            "Complete Blood Count (CBC)",
            "ESR (Erythrocyte Sedimentation Rate)",
            "Peripheral Smear"
          ]
        },
        {
          title: "Biochemical Parameters",
          content: [
            "Fasting Blood Sugar (FBS)",
            "Post Prandial Blood Sugar (PPBS)",
            "Urea",
            "Creatinine",
            "Uric Acid",
            "Glycosylated Hemoglobin (HbA1c)",
            "Vitamin B12",
            "Vitamin D"
          ]
        },
        {
          title: "Lipid Profile Test",
          content: [
            "Total Cholesterol",
            "HDL Cholesterol",
            "LDL Cholesterol",
            "Triglycerides",
            "Total Cholesterol / HDL Ratio",
          ]
        },
        {
          title: " Liver Function Test",
          content: [
            "Total Bilirubin",
            "Direct Bilirubin",
            "Indirect Bilirubin",
            "SGPT",
            "SGOT",
            "Alkaline Phosphatase",
            "Total Protein",
            "Albumin",
            "Globulin",
            "A / G Ratio",
          ]
        },
        {
          title: "Cardiology",
          content: [
            "ECG (Resting)"
          ]
        },
        {
          title: "Radiology",
          content: [
            "Chest X-Ray",
            "Ultrasound - Abdomen",
            "2D ECHO (Echocardiography)",
            "*TMT - On doctor’s advice",
          ]
        },
        {
          title: "Other Tests",
          content: [
            "Blood Grouping - Rh Typing",
            "Complete Urine Analysis",
            "Thyroid Stimulating Hormone (TSH)",
            "GGTP"
          ]
        },
        {
          title: "Special Tests",
          content: [
            "Pulmonary Function Test (PFT)"
          ]
        },
        {
          title: "Consultations",
          content: [
            "Internal Medicine Consultation",
            "Surgical Consultation",
            "Dental Consultation",
            "Ophthalmologist Consultation",
            "One additional consultation of the patient’s choice (within 2 days)",
            "Dietitian Consultation"
          ]
        }
      ],

      // Why Choose
      whyChooseTitle: "Why Choose Vasavi Master Health Check - Men?",
      whyChooseSubtitle: "",
      whyChoose: [
        {
          icon: "fa-solid fa-check",
          content: "Comprehensive screening for metabolic, cardiac, liver, lung & nutritional health"
        },
        {
          icon: "fa-solid fa-check",
          content: "Early detection of lifestyle-related diseases"
        },
        {
          icon: "fa-solid fa-check",
          content: "Advanced heart and respiratory evaluations included"
        },
        {
          icon: "fa-solid fa-check",
          content: "Expert-led care by experienced physicians and specialists"
        },
        {
          icon: "fa-solid fa-check",
          content: "Complete health assessment under one roof"
        },
        {
          icon: "fa-solid fa-check",
          content: "Ideal for proactive and preventive healthcare"
        }
      ],

      // Care With Us
      careTitle: "Your Health Check Journey With Us",
      careSubtitle:
        "",
      careWith: [
        {
          img: "/Images/health-package/Ellipse 10.png",
          content: "Book your appointment online or via call"
        },
        {
          img: "/Images/health-package/Ellipse 11.png",
          content: "Visit the center fasting, as advised by our team"
        },
        {
          img: "/Images/health-package/Ellipse 12.png",
          content: "Sample collection, imaging, cardiac & special tests"
        },
        {
          img: "/Images/health-package/Ellipse 13.png",
          content: "Consultations with specialists"
        },
        {
          img: "/Images/health-package/Ellipse 14.png",
          content: "Personalised diet and lifestyle guidance"
        }
      ],

      // Doctors Slide
      doctorSlide: [
        {
          name: "Dr. Revathi Natesan",
          img: "/Images/new-doctor-image/dr-revathi-natesan.png",
          alt: "Dr. Revathi Natesan | Endodontist | Vasavi Hospitals Bangalore",
          experience: "15+",
          qualification: "MDS Conservative Dentistry & Endodontics",
          department: "Dentistry",
          consultant: "Consultant Endodontist",
          slug: "/dr-revathi-natesan"
        },
        // {
        //   name: "Dr. Sneha Sundaram",
        //   img: "/Images/new-doctor-image/dummy-female.png",
        //   alt: "Dr. Sneha Sundaram | Endodontist | Vasavi Hospitals Bangalore",
        //   experience: "13+",
        //   qualification: "BDS, MDS",
        //   department: "Dentistry",
        //   consultant: "Consultant Endodontist",
        //   slug: "/dr-sneha-sundaram"
        // },
        // {
        //   name: "Dr. Naneboena Sunitha",
        //   img: "/Images/new-doctor-image/dr-naneboena-sunitha.png",
        //   alt: "Dr. Naneboena Sunitha | Nutritionist | Vasavi Hospitals Bangalore",
        //   experience: "26+",
        //   qualification: "PhD Food & Nutrition",
        //   department: "Nutrition",
        //   consultant: "Consultant Nutritionist & Dietitian",
        //   slug: "/dr-naneboena-sunitha"
        // },
        {
          name: "Dr. Vinay Hosadurga",
          img: "/Images/doctor-page/dr-vinay-hosadurga.png",
          alt: "Dr. Vinay Hosadurga | General Physician | Vasavi Hospitals Bangalore",
          experience: "14+",
          qualification: "MBBS, MD (General Medicine)",
          department: "General Medicine",
          consultant: "Consultant Physician",
          slug: "/dr-vinay-hosadurga"
        },

        {
          name: "Dr. Ramesh T. S",
          img: "/Images/new-doctor-image/dr-ramesh-t-s.png",
          alt: "Dr. Ramesh T. S | General Surgeon | Vasavi Hospitals Bangalore",
          experience: "30+",
          qualification: "MBBS, DNB, MRCS (UK)",
          department: "General Surgery",
          consultant: "Sr. Consultant – Minimally Invasive Surgery",
          slug: "/dr-ramesh-t-s"
        },

        // {
        //   name: "Dr. Gargi Das",
        //   img: "/Images/new-doctor-image/Dr Gargi Das.png",
        //   alt: "Dr. Gargi Das | Ophthalmologist | Vasavi Hospitals Bangalore",
        //   experience: "6+",
        //   qualification: "MBBS, MD, FPRS",
        //   department: "Ophthalmology",
        //   consultant: "Consultant Ophthalmologist",
        //   slug: "/dr-gargi-das"
        // },

      ],

      // CTA
      ctaTitle: "Take a Proactive Step Toward Better Health",
      ctaSubtitle:
        `Your health is your strongest asset. Early screening helps you stay ahead of potential risks.
Book the Vasavi Master Health Check - Men and invest in long-term well-being.`,

      // FAQ
      faqs: [
        {
          title: "Do I need to come fasting for this package?",
          content:
            "Yes. Fasting is required for accurate blood sugar, lipid, and biochemical evaluations. Our team will guide you during booking.",
        },
        {
          title: "Is the TMT mandatory?",
          content:
            "No. TMT is performed only if advised by the doctor based on clinical assessment."
        },
        {
          title: "How long does the health check take?",
          content:
            "Most tests and consultations are completed within a day."
        },
        {
          title: "Is this package suitable for annual screening?",
          content:
            "Yes. This master package is ideal for annual comprehensive health evaluation for men."
        }
      ],
    },

    //Vasavi Master Health Check – Women
    {
      slug: "vasavi-master-health-check-women",
      metaTitle: "",
      metaDescription: "",


      // Banner section
      pageTitle: "Master Health Check – Women",
      pagePrice: "4500",
      pageSubtitle: "Advanced Total Women’s Health Care",
      pageDescription: "A premium preventive package addressing metabolic health, heart function, nutrition, reproductive health, and immunity.",
      // Banner Cards
      bannerCards: [
        { title: "Women-Focused Screening", subtitle: "Pap smear & breast exam" },
        { title: "Complete Cardiac Care", subtitle: "ECG, Echo & TMT*" },
        { title: "Holistic Wellness", subtitle: "Nutrition, vision & lifestyle" }
      ],

      // About Section
      about: [
        {
          title: "A comprehensive health evaluation designed for complete women’s wellness",
          subtitle:
            `<div>A woman’s health evolves with age, lifestyle, and hormonal changes. Conditions related to heart health, metabolism, nutrition, reproductive health, lungs and bones can progress silently if not monitored regularly.</div> <br>

          <div>The Vasavi Master Health Check - Women is a detailed preventive screening package that evaluates all major health systems, enabling early detection, timely intervention and confident long-term health planning.</div>`
        }
      ],
      aboutImage: "/Images/health-package/master-health-check–women.png",

      // Includes
      includesTitle: "What’s Included in the Package?",
      includesSubtitle:
        "This master package is structured into advanced laboratory investigations, cardiac assessment, imaging, special tests, and multi-specialty consultations..",
      includes: [
        {
          title: "Haematology",
          content: [
            "Complete Blood Count (CBC)",
            "ESR (Erythrocyte Sedimentation Rate)",
            "Peripheral Smear"
          ]
        },
        {
          title: "Biochemical Parameters",
          content: [
            "Fasting Blood Sugar (FBS)",
            "Post Prandial Blood Sugar (PPBS)",
            "Urea",
            "Creatinine",
            "Uric Acid",
            "Glycosylated Hemoglobin (HbA1c)",
            "Vitamin B12",
            "Vitamin D"
          ]
        },
        {
          title: "Lipid Profile Test",
          content: [
            "Total Cholesterol",
            "HDL Cholesterol",
            "LDL Cholesterol",
            "Triglycerides",
            "Total Cholesterol / HDL Ratio",
          ]
        },
        {
          title: " Liver Function Test",
          content: [
            "Total Bilirubin",
            "Direct Bilirubin",
            "Indirect Bilirubin",
            "SGPT",
            "SGOT",
            "Alkaline Phosphatase",
            "Total Protein",
            "Albumin",
            "Globulin",
            "A / G Ratio",
          ]
        },
        {
          title: "Cardiology",
          content: [
            "ECG (Resting)"
          ]
        },
        {
          title: "Radiology",
          content: [
            "Chest X-Ray",
            "Ultrasound - Abdomen",
            "2D ECHO (Echocardiography)",
            "*TMT - On doctor’s advice",
          ]
        },
        {
          title: "Other Tests",
          content: [
            "Blood Grouping - Rh Typing",
            "Complete Urine Analysis",
            "Pap Smear Test",
            "Clinical Breast Examination",
            "Thyroid Stimulating Hormone (TSH)",
            "GGTP"
          ]
        },
        {
          title: "Special Tests",
          content: [
            "Pulmonary Function Test (PFT)"
          ]
        },
        {
          title: "Consultations",
          content: [
            "Internal Medicine Consultation",
            "Gynaecology Consultation",
            "Ophthalmologist Consultation",
            "Dental Consultation",
            "One additional consultation of the patient’s choice (within 2 days)",
            "Dietitian Consultation"
          ]
        }
      ],

      // Why Choose
      whyChooseTitle: "Why Choose Vasavi Master Health Check - Women?",
      whyChooseSubtitle: "",
      whyChoose: [
        {
          icon: "fa-solid fa-check",
          content: "Complete evaluation of metabolic, cardiac, hormonal & reproductive health"
        },
        {
          icon: "fa-solid fa-check",
          content: "Focus on early detection of lifestyle and women-specific conditions"
        },
        {
          icon: "fa-solid fa-check",
          content: "Includes advanced heart and lung assessments"
        },
        {
          icon: "fa-solid fa-check",
          content: "Designed by experienced physicians and specialists"
        },
        {
          icon: "fa-solid fa-check",
          content: "Comprehensive care under one roof"
        },
        {
          icon: "fa-solid fa-check",
          content: "Ideal for long-term preventive health planning"
        }
      ],

      // Care With Us
      careTitle: "Your Health Check Journey With Us",
      careSubtitle:
        "",
      careWith: [
        {
          img: "/Images/health-package/Ellipse 10.png",
          content: "Book your appointment online or via call"
        },
        {
          img: "/Images/health-package/Ellipse 11.png",
          content: "Visit the center fasting, as advised"
        },
        {
          img: "/Images/health-package/Ellipse 12.png",
          content: "Sample collection, imaging, cardiac & special tests"
        },
        {
          img: "/Images/health-package/Ellipse 13.png",
          content: "Consultations with specialist doctors"
        },
        {
          img: "/Images/health-package/Ellipse 14.png",
          content: "Personalised diet and lifestyle guidance"
        }
      ],

      // Doctors Slide
      doctorSlide: [
        {
          name: "Dr. Vinay Hosadurga",
          img: "/Images/new-doctor-image/dr-vinay-hosadurga.png",
          alt: "Dr. Vinay Hosadurga | General Physician | Vasavi Hospitals Bangalore",
          experience: "14+",
          department: "General Medicine",
          slug: "/dr-vinay-hosadurga"
        },

        // {
        //   name: "Dr. Sowmya Sangamesh",
        //   img: "/Images/new-doctor-image/dr-sowmya-sangmesh.png",
        //   alt: "Dr. Sowmya Sangamesh | Gynecologist | Vasavi Hospitals Bangalore",
        //   experience: "14+",
        //   qualification: "MBBS, MS (OBG)",
        //   department: "Gynecology",
        //   consultant: "Consultant Gynec Laparoscopic Surgeon",
        //   slug: "/dr-sowmya-sangamesh"
        // },

        {
          name: "Dr. Gargi Das",
          img: "/Images/new-doctor-image/Dr Gargi Das.png",
          alt: "Dr Gargi Das - Consultant Ophthalmologist | Vasavi Hospitals Bangalore",
          experience: "6+",
          department: "Ophthalmology",
          slug: "/dr-gargi-das"
        },
        {
          name: "Dr. Nisha Buchade",
          img: "Images/go/dr-nisha-buchade-sq.png",
          alt: "Best Gynecologic Oncologist | Dr. Nisha Buchade",
          experience: "15+",
          department: "Obstetrics and Gynaecology",
          slug: "/dr-nisha-buchade"
        },

        {
          name: "Dr. Revathi Natesan",
          img: "/Images/new-doctor-image/dr-revathi-natesan.png",
          alt: "Dr. Revathi Natesan | Endodontist | Vasavi Hospitals Bangalore",
          experience: "15+",
          qualification: "MDS Conservative Dentistry & Endodontics",
          department: "Dentistry",
          consultant: "Consultant Endodontist",
          slug: "/dr-revathi-natesan"
        },

        // {
        //   name: "Dr. Sneha Sundaram",
        //   img: "/Images/new-doctor-image/dummy-female.png",
        //   alt: "Dr. Sneha Sundaram | Endodontist | Vasavi Hospitals Bangalore",
        //   experience: "13+",
        //   qualification: "BDS, MDS",
        //   department: "Dentistry",
        //   consultant: "Consultant Endodontist",
        //   slug: "/dr-sneha-sundaram"
        // },

        // {
        //   name: "Dr. Naneboena Sunitha",
        //   img: "/Images/new-doctor-image/dr-naneboena-sunitha.png",
        //   alt: "Dr. Naneboena Sunitha | Nutritionist | Vasavi Hospitals Bangalore",
        //   experience: "26+",
        //   qualification: "PhD Food & Nutrition",
        //   department: "Nutrition",
        //   consultant: "Consultant Nutritionist & Dietitian",
        //   slug: "/dr-naneboena-sunitha"
        // },
      ],

      // CTA
      ctaTitle: "Take a Proactive Step Toward Better Health",
      ctaSubtitle:
        `Your health deserves timely attention and expert care.
Book the Vasavi Master Health Check - Women today and stay confident, informed and in control of your well-being.`,

      // FAQ
      faqs: [
        {
          title: "Do I need to come fasting for this package?",
          content:
            "Yes. Fasting is required for accurate blood sugar, lipid, and biochemical test results. Our team will guide you during booking.",
        },
        {
          title: "Is Pap smear included for all women?",
          content:
            "Pap smear is included and performed based on medical advice and age guidelines after consultation."
        },
        {
          title: "Is TMT compulsory?",
          content:
            "No. TMT is done only if advised by the doctor after initial evaluation."
        },
        {
          title: "Is this suitable for annual screening?",
          content:
            "Yes. This package is ideal for annual comprehensive health evaluation for women."
        }
      ],
    },




  ];


}
