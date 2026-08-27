import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NgHcaptchaComponent, NgHcaptchaModule } from 'ng-hcaptcha';

@Component({
  selector: 'app-contact-fom',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, ReactiveFormsModule, FormsModule, NgHcaptchaModule], // ✅ Add HttpClientModule
  templateUrl: './contact-fom.html',
  styleUrls: ['./contact-fom.css'] // ✅ Fixed name
})
export class ContactFom implements OnInit {
  appointmentForm!: FormGroup;
  submitted = false;
  successMsg = '';
  errorMsg = '';
  emailOtpSent = false;
  emailOtpVerified = false;

  mobileOtpSent = false;
  mobileOtpVerified = false;

  emailOtp = '';
  mobileOtp = '';

    hsiteKey = environment.hcaptchaSiteKey_static;
  
    captchaVerified = false;
    captchaSession: string | null = null;
  
    // ⏱ Timers
    emailOtpTimer = 120;
    mobileOtpTimer = 120;
  
    emailTimerInterval: any;
    mobileTimerInterval: any;
  
    canResendEmailOtp = false;
    canResendMobileOtp = false;
    statusMessage = '';
    statusType: 'info' | 'success' | 'error' = 'info';


  apiUrl = 'https://vasavi-hospitals-812956739285.us-east4.run.app/api';
  // apiUrl = 'http://localhost:3000/api';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/), Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      appointment_date: ['', Validators.required],
      service: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],

       // ✅ OTP fields
    emailOtp: [''],
    mobileOtp: ['']
    });
  }

  get f() {
    return this.appointmentForm.controls;
  }

  // submitForm(): void {
  //   this.submitted = true; // ✅ Make sure errors show after first submit
  //   this.successMsg = '';
  //   this.errorMsg = '';

  //   if (this.appointmentForm.invalid) {
  //     this.errorMsg = '⚠️ Please fill all required fields correctly.';
  //     return;
  //   }

  //   const formValues = this.appointmentForm.value;

  //   // ✅ Corrected: appointment_date instead of date
  //   const emailParams = {
  //     name: formValues.name,
  //     email: formValues.email,
  //     phone: formValues.phone,
  //     date: formValues.appointment_date,
  //     service: formValues.service,
  //     message: formValues.message,
  //   };

  //   const emailRequest = {
  //     // to: ['inventionmindsblr@gmail.com'],
  //     to: ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com'],
  //     whatsappNumber: ['918884466000'],
  //     status: 'Specialty-Page',
  //     appointmentDetails: emailParams,
  //   };

  //   console.log('📤 Sending email request:', emailRequest);

  //   this.http.post(`${this.apiUrl}/email/send-pages-email`, emailRequest).subscribe({
  //     next: (res: any) => {
  //       console.log('✅ Email sent successfully:', res);
  //       this.successMsg = '✅ Thank you! Your message has been sent successfully.';
  //       this.appointmentForm.reset();
  //       this.submitted = false;
  //       this.router.navigate(['/thank-you']);
  //     },
  //     error: (err: any) => {
  //       console.error('❌ Error sending email:', err);
  //       this.errorMsg = '❌ Failed to send message. Please try again later.';
  //     },
  //   });
  // }
 
submitForm(): void {
  this.submitted = true;

  if (!this.emailOtpVerified) {
    this.errorMsg = '⚠️ Please verify email first.';
    return;
  }

  if (!this.mobileOtpVerified) {
    this.errorMsg = '⚠️ Please verify mobile number.';
    return;
  }

  // ✅ SAME CODE YOU ALREADY HAVE
  const formValues = this.appointmentForm.value;

  const emailRequest = {
    to: ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com'],
    // to: ['inventionmindsblr@gmail.com'],
    whatsappNumber: ['918884466000'],
    // whatsappNumber: ['919342287945'],
    status: 'Specialty-Page',
    appointmentDetails: {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      date: formValues.appointment_date,
      service: formValues.service,
      message: formValues.message,
    }
  };

  this.http.post(`${this.apiUrl}/email/send-pages-email`, emailRequest).subscribe({
    next: () => {
      this.successMsg = '✅ Appointment booked successfully';
      this.appointmentForm.reset();
      this.router.navigate(['/thank-you']);
    },
    error: () => {
      this.errorMsg = '❌ Failed to submit';
    }
  });
}
 sendEmailOtp() {
    if (this.appointmentForm.invalid) {
      alert('⚠️ Fill all form details first');
      return;
    }

    if (!this.captchaVerified || !this.captchaSession) {
      alert('⚠️ Please complete captcha verification first');
      return;
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    localStorage.setItem('contact_email_otp', otp);
    localStorage.setItem('contact_email_otp_expiry', (Date.now() + 2 * 60 * 1000).toString());

    this.http.post(`${this.apiUrl}/email/send-email-otp`, {
      email: this.appointmentForm.value.email,
      name: this.appointmentForm.value.name,
      otp
    }).subscribe({
      next: () => {
        this.emailOtpSent = true;
        this.startEmailOtpTimer();
        // alert('✅ Email OTP sent');
        this.statusType = 'info';
        this.statusMessage =
          'An OTP has been sent to your email. Please enter it to continue.';
      },
      error: () => alert('❌ Failed to send Email OTP')
    });
  }
  verifyEmailOtp() {
    const enteredOtp = this.appointmentForm.value.emailOtp;
    const savedOtp = localStorage.getItem('contact_email_otp');
    const expiry = Number(localStorage.getItem('contact_email_otp_expiry'));

    if (!enteredOtp || !savedOtp || Date.now() > expiry) {
      alert('Email OTP expired or invalid');
      return;
    }

    if (enteredOtp === savedOtp) {
      this.emailOtpVerified = true;
      localStorage.removeItem('contact_email_otp');
      localStorage.removeItem('contact_email_otp_expiry');
      // alert('✅ Email verified');
      this.statusType = 'info';
      this.statusMessage = 'Email verified successfully. Sending Mobile OTP…';
      this.sendMobileOtp();
    } else {
      alert('❌ Wrong Email OTP');
    }
  }
  sendMobileOtp() {
    if (!this.emailOtpVerified) {
      alert('Verify email first');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    localStorage.setItem('contact_mobile_otp', otp);
    localStorage.setItem('contact_mobile_otp_expiry', (Date.now() + 2 * 60 * 1000).toString());

    this.http.post(`${this.apiUrl}/sms/send-otp-vasavi`, {
      patientName: this.appointmentForm.value.name,
      patientPhoneNumber: '91' + this.appointmentForm.value.phone,
      service: this.appointmentForm.value.service,
      otp
    }).subscribe({
      next: () => {
        this.mobileOtpSent = true;
        this.startMobileOtpTimer();
        // alert('✅ Mobile OTP sent');
        this.statusType = 'info';
        this.statusMessage = 'Mobile OTP sent successfully.';
      },
      error: () => {
        this.statusType = 'error';
        this.statusMessage = 'Failed to send Mobile OTP.';
      }
    });
  }
  verifyMobileOtp() {
    const enteredOtp = this.appointmentForm.value.mobileOtp;
    const savedOtp = localStorage.getItem('contact_mobile_otp');
    const expiry = Number(localStorage.getItem('contact_mobile_otp_expiry'));

    if (!enteredOtp || !savedOtp || Date.now() > expiry) {
      alert('Mobile OTP expired or invalid');
      return;
    }

    if (enteredOtp === savedOtp) {
      this.mobileOtpVerified = true;
      localStorage.removeItem('contact_mobile_otp');
      localStorage.removeItem('contact_mobile_otp_expiry');
      this.statusType = 'success';
      this.statusMessage =
        'Mobile verified successfully. You can now submit the form.';

      alert('✅ Mobile verified');
    } else {
      alert('❌ Wrong Mobile OTP');
    }
  }
  onCaptchaVerify(token: string | any) {
    const captchaToken = typeof token === 'string'
      ? token
      : token?.token || token;

    this.http.post<any>(`${this.apiUrl}/email/captcha/verify`, {
      captchaToken
    }).subscribe({
      next: (res) => {
        this.captchaVerified = true;
        this.captchaSession = res.captchaSession;
        this.sendEmailOtp();
        // console.log('✅ hCaptcha verified');
        this.statusType = 'info';
        this.statusMessage =
          'Captcha verified successfully. Sending Email OTP…';
      },
      error: () => {
        this.captchaVerified = false;
        // alert('Captcha verification failed. Please retry.');
        this.statusType = 'error';
        this.statusMessage =
          'Captcha verification failed. Please try again.';
      }
    });
  }

  onCaptchaExpire() {
    this.captchaVerified = false;
    this.captchaSession = null;
  }

  onCaptchaError(err: any) {
    console.error('hCaptcha error:', err);
    this.captchaVerified = false;
    this.captchaSession = null;
  }
  startEmailOtpTimer() {
    this.emailOtpTimer = 120;
    this.canResendEmailOtp = false;

    clearInterval(this.emailTimerInterval);
    this.emailTimerInterval = setInterval(() => {
      this.emailOtpTimer--;
      if (this.emailOtpTimer <= 0) {
        clearInterval(this.emailTimerInterval);
        this.canResendEmailOtp = true;
      }
    }, 1000);
  }

  startMobileOtpTimer() {
    this.mobileOtpTimer = 120;
    this.canResendMobileOtp = false;

    clearInterval(this.mobileTimerInterval);
    this.mobileTimerInterval = setInterval(() => {
      this.mobileOtpTimer--;
      if (this.mobileOtpTimer <= 0) {
        clearInterval(this.mobileTimerInterval);
        this.canResendMobileOtp = true;
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }





}
