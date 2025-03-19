// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/API/customer-profile/customer-profile.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports:[NgIf,ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userData: any;
  isLoading = true;
  isUpdating = false;
  languageOptions = ['en', 'fr', 'es', 'de'];
  paymentOptions = ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'];

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      basicInfo: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6)]]
      }),
      preferences: this.fb.group({
        preferredLanguage: ['en'],
        paymentMethods: [[]]
      })
    });
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  private loadProfileData(): void {
    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        this.userData = data;
        this.profileForm.patchValue({
          basicInfo: {
            name: data.name,
            email: data.email
          },
          preferences: {
            preferredLanguage: data.preferredLanguage || 'en',
            paymentMethods: data.paymentMethods || []
          }
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isUpdating = true;
    const basicInfo = this.profileForm.get('basicInfo')?.value;
    const preferences = this.profileForm.get('preferences')?.value;

    // Update user info
    this.profileService.updateUserInfo(basicInfo).subscribe({
      next: () => {
        // Update customer profile
        this.profileService.updateCustomerProfile(preferences).subscribe({
          next: () => {
            this.isUpdating = false;
            // Show success message
            this.loadProfileData(); // Refresh data
          },
          error: (err) => {
            console.error('Error updating preferences:', err);
            this.isUpdating = false;
          }
        });
      },
      error: (err) => {
        console.error('Error updating basic info:', err);
        this.isUpdating = false;
      }
    });
  }
  updatePaymentMethods(method: string, isChecked: boolean): void {
  const currentMethods = this.profileForm.get('preferences.paymentMethods')?.value;
  const updatedMethods = isChecked
    ? [...currentMethods, method]
    : currentMethods.filter((m: string) => m !== method);

  this.profileForm.get('preferences.paymentMethods')?.setValue(updatedMethods);
}
}
