import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-health-package-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgHcaptchaModule],
  templateUrl: './health-package-form.html',
  styleUrl: './health-package-form.css',
})
export class HealthPackageForm {
  @Input() page: any;
  @Input() doctor: any;

  apiUrl = 'https://vasavi-hospitals-812956739285.us-east4.run.app/api';
  // apiUrl = 'http://localhost:3000/api';

  appointmentForm!: FormGroup;

  showInitialForm = true;
  showCaptcha = false;
  captchaVerified = false;
  otpSent = false;

  siteKey = environment.hcaptchaSiteKey;

  captchaToken: string | null = null;

  generatedOtp!: string;
  otpVerified = false;
  otpInvalid = false;
  otpExpired = false;
  timeLeft = 0;
  interval: any;

  pageName = 'Health Checkup';

  minDate: string = new Date().toISOString().split('T')[0];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.appointmentForm = this.fb.group({
      date: ['', Validators.required],
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      otp: [''],
    });
  }

  onInitialSubmit() {
    if (!this.appointmentForm.valid) return;

    this.showInitialForm = false;
    this.showCaptcha = true;
  }

  captchaSession: string | null = null;

  onCaptchaVerify(token: string | any) {
    // Extract token if it's an object
    const captchaToken = typeof token === 'string' ? token : token?.token || token;
    console.log('hCaptcha token:', captchaToken);

    this.http
      .post<any>(`${this.apiUrl}/email/captcha/verify`, {
        captchaToken: captchaToken,
      })
      .subscribe({
        next: (res) => {
          this.captchaVerified = true;
          this.captchaSession = res.captchaSession;
          console.log('✅ Captcha verified successfully');
        },
        error: (err) => {
          console.error('❌ Captcha verification error:', err);
          this.captchaVerified = false;
          alert('Captcha verification failed. Please try again.');
        },
      });
  }

  onCaptchaExpire() {
    this.captchaVerified = false;
    this.captchaSession = null;
  }

  onCaptchaError(error: any) {
  console.error('hCaptcha error:', error);
  this.captchaVerified = false;
  this.captchaSession = null;
  alert('Captcha failed to load. Please refresh the page.');
}

  onCaptchaSubmit() {
    if (!this.captchaVerified) return;

    this.showCaptcha = false;
    this.sendOtp();
  }

  sendOtp() {
    this.generateOtp();
    this.startOtpTimer();
  }

  generateOtp() {
    this.otpSent = true;
    this.otpVerified = false;
    this.otpInvalid = false;
    this.otpExpired = false;

    this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('OTP:', this.generatedOtp);

    this.http
      .post(`${this.apiUrl}/sms/send-otp-vasavi`, {
        patientName: this.appointmentForm.value.name,
        patientPhoneNumber: '91' + this.appointmentForm.value.mobile,
        service: this.pageName,
        otp: this.generatedOtp,
      })
      .subscribe({
        next: () => {
          this.otpSent = true;
        },
        error: (err) => {
          console.error('❌ OTP send failed:', err);
          alert('❌ Failed to send OTP. Please try again.');
        },
      });
  }

  startOtpTimer() {
    this.timeLeft = 120;
    clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.timeLeft--;

      if (this.timeLeft === 0) {
        clearInterval(this.interval);
        this.otpExpired = true;
        this.otpVerified = false;
        this.otpInvalid = false;
      }
    }, 1000);
  }

  resendOtp() {
    this.generateOtp();
    this.startOtpTimer();
  }

  verifyOtp() {
    if (this.otpExpired) return;

    const enteredOtp = String(this.appointmentForm.value.otp);

    if (enteredOtp === this.generatedOtp) {
      this.otpVerified = true;
      this.otpInvalid = false;
      this.otpExpired = false;
      this.bookAppointment();
    } else {
      this.otpVerified = false;
      this.otpInvalid = true;
    }
  }

  bookAppointment() {
    if (!this.otpVerified) return;

    const appointmentDetails = {
      name: this.appointmentForm.value.name,
      phone: this.appointmentForm.value.mobile,
      date: this.appointmentForm.value.date,
      address: '',
      page: this.pageName,
    };

    const emailRequest = {
      whatsappNumber: ['919164840378'],
      to: ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com', 'Ceo@vasavihospitals.com'],
      // whatsappNumber:['919342287945'],
      // to:['inventionmindsblr@gmail.com'],
      status: 'Health Checkup Appointment Booking',
      appointmentDetails,
    };

    this.http.post(`${this.apiUrl}/email/send-pages-email`, emailRequest).subscribe({
      next: () => {
        this.router.navigate(['/thank-you']);
      },
      error: (err) => {
        console.error('❌ Email send failed:', err);
        alert('❌ Failed to send email. Please try again later.');
      },
    });

    this.appointmentForm.reset();
    this.otpSent = false;
    this.otpVerified = false;
    this.otpInvalid = false;
    this.otpExpired = false;
    clearInterval(this.interval);
  }
}
