import { Component, Input, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { LocationService } from '../../location-service';

import { NgHcaptchaModule } from 'ng-hcaptcha';

@Component({
  selector: 'app-callback-form',
  imports: [FormsModule, CommonModule, NgHcaptchaModule],
  templateUrl: './callback-form.html',
  styleUrl: './callback-form.css',
})
export class CallbackForm {
  @Input() pageName: string = 'Website'; // Pass page name dynamically (e.g. Hysterectomy Page)
  // apiUrl: string = 'http://localhost:3000/api';
  apiUrl = 'https://vasavi-hospitals-812956739285.us-east4.run.app/api';

  otpEnabled = false;

  formData = {
    name: '',
    mobile: '',
    otp: '',
  };
  userAddress: string = 'Fetching location...';

  showOTP = false;
  successMessage: string | null = null;
  userLocation: string = 'Unknown Location';
  detectedPincode: string = '';
  otpSent = false;
  otpVerified = false;
  isSending = false;
  isVerifying = false;
  resendTimer = 0;
  resendInterval: any;
  captchaResponse: string | null = null;
  siteKey = environment.recaptchaSiteKey;

  hsiteKey = environment.hcaptchaSiteKey_static;

  captchaVerified = false;
  captchaSession: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private locationService: LocationService
  ) {}

  // onSubmit(form: any) {
  //   if (form.valid) {
  //     console.log('Form submitted:', this.formData);
  //     this.showOTP = true; // simulate sending OTP
  //     // Here, you can call your API to send OTP to the user.
  //   }
  // }

  // verifyOTP() {
  //   if (this.formData.otp === '123456') {
  //     this.successMessage = 'Thank you! We will call you back shortly.';
  //     this.showOTP = false;
  //   } else {
  //     alert('Invalid OTP. Please try again.');
  //   }
  // }

  ngOnInit(): void {
    // this.fetchUserLocation();
    // console.log('CallbackForm initialized for page:', this.pageName);
  }

  onCaptchaVerify(token: string | any) {
    const captchaToken = typeof token === 'string' ? token : token?.token || token;

    this.http
      .post<any>(`${this.apiUrl}/email/captcha/verify`, {
        captchaToken,
      })
      .subscribe({
        next: (res) => {
          this.captchaVerified = true;
          this.captchaSession = res.captchaSession;
          console.log('✅ hCaptcha verified');
        },
        error: () => {
          this.captchaVerified = false;
          alert('Captcha verification failed. Please retry.');
        },
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

  onCaptchaResolved(token: any) {
    // console.log('Captcha verified, token:', token);
    this.captchaResponse = token; // ✅ set captcha response here

    // (your existing logic)
    if (!this.formData.name || !this.formData.mobile) {
      alert('Please fill name and mobile number first!');
      return;
    }

    // this.isSending = true;

    this.http
      .post(`${this.apiUrl}/email/verify`, {
        name: this.formData.name,
        mobile: this.formData.mobile,
        token: token,
      })
      .subscribe({
        next: (res: any) => {
          // this.isSending = false;
        },
        error: (err) => {
          // this.isSending = false;
          alert('Server error, please try again.');
          console.error(err);
        },
      });
  }

  fetchUserLocation(): void {
    if (!navigator.geolocation) {
      alert('❌ Geolocation is not supported by your browser.');
      this.userAddress = 'Location unavailable';
      return;
    }

    // this.isSending = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        console.log('📍 Coordinates:', latitude, longitude, 'Accuracy (m):', accuracy);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
        )
          .then((res) => res.json())
          .then((data) => {
            const addr = data.address || {};
            const area =
              addr.suburb ||
              addr.village ||
              addr.hamlet ||
              addr.neighbourhood ||
              addr.locality ||
              '';
            const city = addr.city || addr.town || addr.municipality || addr.county || '';
            const state = addr.state || '';
            const country = addr.country || '';
            const postal = addr.postcode || '';

            this.userAddress = `${area ? area + ', ' : ''}${city ? city + ', ' : ''}${
              state ? state + ', ' : ''
            }${country}${postal ? ' - ' + postal : ''}`;

            console.log('Precise Address:', this.userAddress);
            // this.isSending = false;
          })
          .catch((err) => {
            console.error('⚠️ Reverse geocoding failed:', err);
            this.userAddress = `Lat: ${latitude}, Lng: ${longitude}`;
          });
      },
      (err) => {
        console.warn('⚠️ Location error:', err);

        if (err.code === err.PERMISSION_DENIED) {
          console.log('🔁 Fallback: Using IP-based location...');
          this.fetchSecondaryLocation(); // ✅ fallback function call
        } else {
          switch (err.code) {
            case err.POSITION_UNAVAILABLE:
              alert('Location unavailable. Trying alternate detection...');
              break;
            case err.TIMEOUT:
              alert('Location request timed out. Trying alternate detection...');
              break;
            default:
              alert('Unable to fetch location. Trying alternate detection...');
          }
          this.fetchSecondaryLocation(); // ✅ fallback function call
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  }

  fetchSecondaryLocation(): void {
    this.http.get('https://ipapi.co/json/').subscribe({
      next: (data: any) => {
        const city = data.city || '';
        const state = data.region || '';
        const country = data.country_name || '';
        const postal = data.postal || '';

        // Build formatted address
        this.userAddress = `${city}${city && state ? ', ' : ''}${state}${
          state && country ? ', ' : ''
        }${country}${postal ? ' - ' + postal : ''}`.trim();
        console.log(this.userAddress);
      },
      error: () => {
        console.warn('⚠️ Could not fetch IP location.');
        this.userAddress = 'Unknown Location';
      },
    });
  }

  // // ✅ Form submission (no OTP)
  // onSubmit(form: any) {
  //   if (form.invalid) {
  //     alert('⚠️ Please enter valid details before submitting.');
  //     return;
  //   }
  //   const appointmentDetails = {
  //     name: this.formData.name,
  //     phone: this.formData.mobile,
  //     address: this.userAddress,
  //     page: this.pageName
  //   };
  //   const emailRequest = {
  //     to: ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com', 'Ceo@vasavihospitals.com'],
  //     // to:['inventionmindsblr@gmail.com'],
  //     status: 'Callback-Form',
  //     appointmentDetails
  //   };

  //   console.log('📤 Sending callback email:', emailRequest);

  //   this.http.post(`${this.apiUrl}/email/send-pages-email`, emailRequest).subscribe({
  //     next: (res: any) => {
  //       console.log('✅ Callback email sent:', res);
  //       this.successMessage = '✅ Thank you! We will call you back shortly.';
  //       form.reset();
  //       this.router.navigate(['/thank-you']);
  //     },
  //     error: (err: any) => {
  //       console.error('❌ Email send failed:', err);
  //       alert('❌ Failed to send. Please try again later.');
  //     }
  //   });
  // }

  // Step 1️⃣ Generate and send OTP

  sendOtp(form: any) {
    if (form.invalid) {
      alert('⚠️ Please enter valid details before sending OTP.');
      return;
    }

    this.fetchUserLocation();

    if (!this.otpEnabled) {
      // TEMPORARY: OTP disabled - submit the lead directly, skip SMS/verify.
      this.isSending = true;
      this.sendEmail();
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('callback_otp', otp);
    localStorage.setItem('callback_otp_expiry', (Date.now() + 2 * 60 * 1000).toString()); // 2 min expiry

    this.isSending = true;
    this.http
      .post(`${this.apiUrl}/sms/send-otp-vasavi`, {
        patientName: this.formData.name,
        patientPhoneNumber: '91' + this.formData.mobile, // ensure with country code
        service: this.pageName,
        otp,
      })
      .subscribe({
        next: () => {
          this.isSending = false;
          this.otpSent = true;
          this.showOTP = true;
          this.startResendTimer();
          alert('✅ OTP sent to your mobile number.');
        },
        error: (err) => {
          console.error('❌ OTP send failed:', err);
          this.isSending = false;
          alert('❌ Failed to send OTP. Please try again.');
        },
      });
  }

  // Step 2️⃣ Verify OTP locally
  verifyOtp() {
    const savedOtp = localStorage.getItem('callback_otp');
    const expiry = Number(localStorage.getItem('callback_otp_expiry'));

    if (!this.formData.otp) {
      alert('⚠️ Please enter OTP.');
      return;
    }

    if (!savedOtp || !expiry) {
      alert('⚠️ OTP expired or not found. Please resend.');
      return;
    }

    if (Date.now() > expiry) {
      alert('⚠️ OTP expired. Please resend.');
      return;
    }

    if (this.formData.otp === savedOtp) {
      this.otpVerified = true;
      this.showOTP = false;
      localStorage.removeItem('callback_otp');
      localStorage.removeItem('callback_otp_expiry');
      this.sendEmail();
    } else {
      alert('❌ Invalid OTP. Please try again.');
    }
  }

  // Step 3️⃣ Resend OTP
  resendOtp() {
    if (this.resendTimer > 0) return;
    this.sendOtp({ valid: true });
  }

  startResendTimer() {
    this.resendTimer = 120;
    clearInterval(this.resendInterval);
    this.resendInterval = setInterval(() => {
      this.resendTimer--;
      if (this.resendTimer <= 0) clearInterval(this.resendInterval);
    }, 1000);
  }
  get formattedResendTime(): string {
    const minutes = Math.floor(this.resendTimer / 60);
    const seconds = this.resendTimer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Step 4️⃣ Send callback email after OTP verified
  sendEmail() {
    this.successMessage = '✅ Thank you! We will call you back shortly.';
    const appointmentDetails = {
      name: this.formData.name,
      phone: this.formData.mobile,
      address: this.userAddress,
      page: this.pageName,
    };

    const emailRequest = {
      // whatsappNumber:['919342287945'],
      // whatsappNumber:['916382112241'],
      whatsappNumber: ['919164840378'],
      to: ['Vinay.d@vasavihospitals.com', 'digital@vasavihospitals.com', 'Ceo@vasavihospitals.com'],
      // to:['inventionmindsblr@gmail.com'],
      // to:['govindarajkg222@gmail.com'],
      status: 'Callback-Form',
      appointmentDetails,
    };

    this.http.post(`${this.apiUrl}/email/send-pages-email`, emailRequest).subscribe({
      next: () => {
        this.isSending = false;
        this.successMessage = '✅ Thank you! We will call you back shortly.';
        this.router.navigate(['/thank-you']);
      },
      error: (err) => {
        this.isSending = false;
        console.error('❌ Email send failed:', err);
        alert('❌ Failed to send email. Please try again later.');
      },
    });
  }
}
