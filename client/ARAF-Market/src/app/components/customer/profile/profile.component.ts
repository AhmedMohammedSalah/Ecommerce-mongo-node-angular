import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/API/customer-profile/customer-profile.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
    imports: [CommonModule, ReactiveFormsModule,NgIf],

  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  userData: any;
  isLoading = true;
  isUpdating = false;
  showSuccessMessage = false; // Add this property
  languageOptions = ['en', 'fr', 'es', 'de'];
  paymentOptions = ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'];

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      basicInfo: this.fb.group({
        name: [''],
        email: [{ value: '', disabled: true }],
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
    const user = this.profileService.getUserProfile(); // Call the synchronous method

    if (user) {
      this.userData = user;
      this.profileForm.patchValue({
        basicInfo: {
          name: user.name,
          email: user.email
        },
        preferences: {
          preferredLanguage: user.preferredLanguage || 'en', // Fallback to 'en' if not available
          paymentMethods: user.paymentMethods || [] // Fallback to an empty array if not available
        }
      });
    } else {
      console.error('No user data found in localStorage.');
    }

    this.isLoading = false; // Set loading to false
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.isUpdating = true;
    const basicInfo = this.profileForm.get('basicInfo')?.value;
    const preferences = this.profileForm.get('preferences')?.value;

    this.profileService.updateUserInfo(basicInfo).subscribe({
      next: () => {
        this.profileService.updateCustomerProfile(preferences).subscribe({
          next: () => {
            this.isUpdating = false;
            this.showSuccessMessage = true; // Show success message
            setTimeout(() => this.showSuccessMessage = false, 3000); // Hide after 3 seconds
            this.loadProfileData();
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