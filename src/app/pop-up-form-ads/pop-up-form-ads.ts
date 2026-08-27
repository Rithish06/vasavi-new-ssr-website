import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pop-up-form-ads',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pop-up-form-ads.html',
  styleUrl: './pop-up-form-ads.css'
})
export class PopUpFormAds {
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<{name: string, phoneNumber: string, otp: string}>();

  contactForm: FormGroup;
  otpForm: FormGroup;
  showOtpSection: boolean = false;
  otpSent: boolean = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  closePopup(): void {
    this.resetForm();
    this.onClose.emit();
  }

  submitContactForm(): void {
    if (this.contactForm.valid) {
      this.showOtpSection = true;
      this.otpSent = true;
    }
  }

  submitOtp(): void {
    if (this.otpForm.valid) {
      const formData = {
        name: this.contactForm.get('name')?.value,
        phoneNumber: this.contactForm.get('phoneNumber')?.value,
        otp: this.otpForm.get('otp')?.value
      };
      this.onSubmit.emit(formData);
      this.resetForm();
    }
  }

  resetForm(): void {
    this.contactForm.reset();
    this.otpForm.reset();
    this.showOtpSection = false;
    this.otpSent = false;
  }

  backToContactForm(): void {
    this.showOtpSection = false;
  }

  get nameError(): string {
    const control = this.contactForm.get('name');
    if (control?.hasError('required')) {
      return 'Name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Name must be at least 3 characters';
    }
    return '';
  }

  get phoneError(): string {
    const control = this.contactForm.get('phoneNumber');
    if (control?.hasError('required')) {
      return 'Phone number is required';
    }
    if (control?.hasError('pattern')) {
      return 'Enter a valid 10-digit Indian phone number';
    }
    return '';
  }

  get otpError(): string {
    const control = this.otpForm.get('otp');
    if (control?.hasError('required')) {
      return 'OTP is required';
    }
    if (control?.hasError('pattern')) {
      return 'OTP must be 6 digits';
    }
    return '';
  }
}