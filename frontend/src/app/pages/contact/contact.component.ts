import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
const baseUrl = environment.apiBaseUrl;

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: string;
  contactInfo: string;
  userId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-contact-listing',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div class="container-responsive py-6 sm:py-8 lg:py-12">
        <div class="max-w-2xl lg:max-w-4xl mx-auto">
          <!-- Header -->
          <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border-t-4 border-orange-500">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">Contact Item Owner</h1>
                <p class="text-sm sm:text-base text-gray-600">Send a message about this item</p>
              </div>
              <button 
                (click)="goBack()"
                class="btn-responsive-sm bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span class="hidden sm:inline">Back to Item</span>
                <span class="sm:hidden">Back</span>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoadingItem" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div class="flex items-center space-x-4">
              <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500"></div>
              <p class="text-sm sm:text-base text-gray-600">Loading item details...</p>
            </div>
          </div>

          <!-- Item Info Card -->
          <div *ngIf="item && !isLoadingItem" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div class="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2"></path>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-2">{{ item.title }}</h3>
                <p class="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">{{ item.type | titlecase }} • {{ item.category | titlecase }}</p>
                <p class="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{{ item.description }}</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm sm:text-base">
                  <p class="text-gray-600">
                    <span class="font-medium">Location:</span> {{ item.location }}
                  </p>
                  <p class="text-gray-600">
                    <span class="font-medium">Date:</span> {{ item.date | date:'mediumDate' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Item Load Error -->
          <div *ngIf="itemLoadError" class="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div class="flex items-start">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="text-sm sm:text-base text-red-800 font-medium mb-1">Unable to Load Item</h3>
                <p class="text-xs sm:text-sm text-red-700">{{ itemLoadError }}</p>
              </div>
            </div>
          </div>

          <!-- Authentication Check -->
          <div *ngIf="!isLoggedIn" class="bg-yellow-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div class="flex items-start">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div class="flex-1">
                <h3 class="text-sm sm:text-base text-yellow-800 font-medium mb-1">Login Required</h3>
                <p class="text-xs sm:text-sm text-yellow-700 mb-3 sm:mb-4">You need to be logged in to send messages.</p>
                <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    (click)="login()"
                    class="btn-responsive-sm bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition-colors"
                  >
                    Log In
                  </button>
                  <button
                    (click)="signUp()"
                    class="btn-responsive-sm border border-yellow-600 text-yellow-700 hover:bg-yellow-50 font-semibold transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div *ngIf="isLoggedIn && item && !isLoadingItem" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send Message</h2>
            
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-4 sm:space-y-6">
              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  id="subject"
                  type="text"
                  formControlName="subject"
                  placeholder="Brief description of your message"
                  class="input-responsive w-full focus:ring-orange-500 focus:border-orange-500"
                  [class.border-red-300]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched"
                />
                <div
                  *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched"
                  class="mt-1 text-sm text-red-600 flex items-start gap-1"
                >
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Subject is required</span>
                </div>
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  formControlName="message"
                  rows="6"
                  placeholder="Describe your inquiry or provide additional details..."
                  class="textarea-responsive w-full focus:ring-orange-500 focus:border-orange-500"
                  [class.border-red-300]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
                ></textarea>
                <div
                  *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
                  class="mt-1 text-sm text-red-600 flex items-start gap-1"
                >
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Message is required and must be at least 10 characters</span>
                </div>
              </div>

              <!-- Contact Preference -->
              <div>
                <label for="contact-preference" class="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="contactPreference"
                      value="email"
                      class="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm sm:text-base text-gray-700">Email</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="contactPreference"
                      value="phone"
                      class="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm sm:text-base text-gray-700">Phone</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      type="radio"
                      formControlName="contactPreference"
                      value="any"
                      class="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm sm:text-base text-gray-700">Any method</span>
                  </label>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  type="submit"
                  [disabled]="contactForm.invalid || isSubmitting"
                  class="flex-1 btn-responsive-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg *ngIf="isSubmitting" class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg *ngIf="!isSubmitting" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                </button>
                <button
                  type="button"
                  (click)="goBack()"
                  class="flex-1 btn-responsive-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <!-- Success Message -->
          <div *ngIf="showSuccess" class="bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div class="flex items-start">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 class="text-sm sm:text-base text-green-800 font-medium mb-1">Message Sent Successfully!</h3>
                <p class="text-xs sm:text-sm text-green-700 mb-3 sm:mb-4">
                  Your message has been sent to the item owner. They will get back to you soon.
                </p>
                <button
                  (click)="goBack()"
                  class="btn-responsive-sm bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                >
                  Back to Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  item: Item | null = null;
  isLoadingItem = true;
  isSubmitting = false;
  showSuccess = false;
  itemLoadError = '';
  isLoggedIn = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() {
    this.contactForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      contactPreference: ['email', Validators.required]
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.loadItem();
  }

  loadItem() {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (!itemId) {
      this.itemLoadError = 'Item ID not provided';
      this.isLoadingItem = false;
      return;
    }

    this.http.get<{ success: boolean; data: Item; message?: string }>(`${baseUrl}/api/item/${itemId}`).subscribe({
      next: (response) => {
        if (response.success) {
          this.item = response.data;
        } else {
          this.itemLoadError = response.message || 'Failed to load item';
        }
        this.isLoadingItem = false;
      },
      error: (error) => {
        this.itemLoadError = error.error?.message || 'Failed to load item';
        this.isLoadingItem = false;
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid && this.item) {
      this.isSubmitting = true;

      const formData = {
        ...this.contactForm.value,
        itemId: this.item.id,
        itemTitle: this.item.title
      };

      this.http.post(`${baseUrl}/api/email/contact`, formData).subscribe({
        next: (response: { success?: boolean; message?: string }) => {
          if (response.success) {
            this.showSuccess = true;
            this.contactForm.reset();
          } else {
            alert(response.message || 'Failed to send message');
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          alert(error.error?.message || 'Failed to send message');
          this.isSubmitting = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/item', this.item?.id]);
  }

  login() {
    this.router.navigate(['/auth/sign-in'], {
      queryParams: { returnUrl: this.router.url }
    });
  }

  signUp() {
    this.router.navigate(['/auth/sign-up'], {
      queryParams: { returnUrl: this.router.url }
    });
  }
}