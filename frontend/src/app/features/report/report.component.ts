import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ItemService } from '../../core/services/item.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { UiTextService } from '../../core/services/ui-text.service';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ItemType, ImageFile } from './models/item.model';
import { contactInfoValidator } from './utils/validators';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-repost',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageUploadComponent
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div class="container-responsive-md py-6 sm:py-8 lg:py-12">
        <!-- Header -->
        <div class="text-center mb-6 sm:mb-8 lg:mb-12">
          <button
            (click)="goBack()"
            class="mb-4 sm:mb-6 inline-flex items-center px-3 sm:px-4 py-2 text-orange-700 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-colors text-sm sm:text-base"
          >
            <svg
              class="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 12H5m0 0l7 7m-7-7l7-7"
              />
            </svg>
            Back
          </button>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-900 mb-3 sm:mb-4">
            {{ uiText.getPageTitle(itemType) }}
          </h1>
          <p class="text-sm sm:text-base lg:text-lg text-orange-700 max-w-2xl mx-auto leading-relaxed">
            {{ uiText.getPageDescription(itemType) }}
          </p>
        </div>

        <!-- Main Form Container -->
        <div class="flex justify-center">
          <div class="w-full max-w-2xl lg:max-w-4xl">
            <div class="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
              <!-- Form Header -->
              <div class="bg-gradient-to-r from-orange-100 to-orange-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-orange-200">
                <h2 class="text-xl sm:text-2xl font-semibold text-orange-900">
                  {{ uiText.getFormTitle(itemType) }}
                </h2>
                <p class="text-sm sm:text-base text-orange-700 mt-2">
                  {{ uiText.getFormDescription(itemType) }}
                </p>
              </div>

              <!-- Form Content -->
              <div class="p-4 sm:p-6 lg:p-8">
                <form
                  [formGroup]="itemForm"
                  (ngSubmit)="onSubmitForm()"
                  class="space-y-4 sm:space-y-6"
                >
                  <!-- Title and Category Row -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div class="space-y-2">
                      <label
                        for="title"
                        class="block text-sm sm:text-base font-medium text-orange-800"
                      >
                        Item Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        formControlName="title"
                        [placeholder]="itemType === 'lost' ? 'What did you lose?' : 'What did you find?'"
                        class="input-responsive w-full focus:ring-orange-500 focus:border-orange-500"
                        [class.border-red-400]="isFieldInvalid('title')"
                        [class.border-orange-200]="!isFieldInvalid('title')"
                      />
                      <div
                        *ngIf="isFieldInvalid('title')"
                        class="text-sm text-red-600 flex items-start gap-1"
                      >
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Please enter a title for your item</span>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="category"
                        class="block text-sm sm:text-base font-medium text-orange-800"
                      >
                        Category *
                      </label>
                      <select
                        id="category"
                        formControlName="category"
                        class="input-responsive w-full focus:ring-orange-500 focus:border-orange-500"
                        [class.border-red-400]="isFieldInvalid('category')"
                        [class.border-orange-200]="!isFieldInvalid('category')"
                      >
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="personal">Personal Items</option>
                        <option value="documents">Documents</option>
                        <option value="other">Other</option>
                      </select>
                      <div
                        *ngIf="isFieldInvalid('category')"
                        class="text-sm text-red-600 flex items-start gap-1"
                      >
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Please select a category</span>
                      </div>
                    </div>
                  </div>

                  <!-- Description -->
                  <div class="space-y-2">
                    <label
                      for="description"
                      class="block text-sm sm:text-base font-medium text-orange-800"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      formControlName="description"
                      rows="4"
                      placeholder="Provide detailed description of the item..."
                      class="textarea-responsive w-full focus:ring-orange-500 focus:border-orange-500"
                      [class.border-red-400]="isFieldInvalid('description')"
                      [class.border-orange-200]="!isFieldInvalid('description')"
                    ></textarea>
                    <div
                      *ngIf="isFieldInvalid('description')"
                      class="text-sm text-red-600 flex items-start gap-1"
                    >
                      <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Please provide a description</span>
                    </div>
                  </div>

                  <!-- Location and Date Row -->
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div class="space-y-2">
                      <label
                        for="location"
                        class="block text-sm sm:text-base font-medium text-orange-800"
                      >
                        Location *
                      </label>
                      <select
                        id="location"
                        formControlName="location"
                        class="input-responsive w-full focus:ring-orange-500 focus:border-orange-500"
                        [class.border-red-400]="isFieldInvalid('location')"
                        [class.border-orange-200]="!isFieldInvalid('location')"
                      >
                        <option value="">Select location</option>
                        <option value="downtown">Downtown</option>
                        <option value="coffee shop">Coffee Shop</option>
                        <option value="central park">Central Park</option>
                        <option value="bus station">Bus Station</option>
                        <option value="library">Library</option>
                        <option value="park">Park</option>
                      </select>
                      <div
                        *ngIf="isFieldInvalid('location')"
                        class="text-sm text-red-600 flex items-start gap-1"
                      >
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Please select a location</span>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <label
                        for="date"
                        class="block text-sm sm:text-base font-medium text-orange-800"
                      >
                        Date *
                      </label>
                      <input
                        id="date"
                        type="date"
                        formControlName="date"
                        class="input-responsive w-full focus:ring-orange-500 focus:border-orange-500"
                        [class.border-red-400]="isFieldInvalid('date')"
                        [class.border-orange-200]="!isFieldInvalid('date')"
                      />
                      <div
                        *ngIf="isFieldInvalid('date')"
                        class="text-sm text-red-600 flex items-start gap-1"
                      >
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span>Please select a date</span>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="space-y-2">
                    <label
                      for="contactInfo"
                      class="block text-sm sm:text-base font-medium text-orange-800"
                    >
                      Contact Information *
                    </label>
                    <textarea
                      id="contactInfo"
                      formControlName="contactInfo"
                      rows="3"
                      placeholder="Enter your contact information (email, phone, etc.)"
                      class="textarea-responsive w-full focus:ring-orange-500 focus:border-orange-500"
                      [class.border-red-400]="isFieldInvalid('contactInfo')"
                      [class.border-orange-200]="!isFieldInvalid('contactInfo')"
                    ></textarea>
                    <div
                      *ngIf="isFieldInvalid('contactInfo')"
                      class="text-sm text-red-600 flex items-start gap-1"
                    >
                      <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Please provide contact information</span>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-500">
                      Include your email, phone number, or preferred contact method
                    </p>
                  </div>

                  <!-- Image Upload -->
                  <div class="space-y-2">
                    <label for="item-image" class="block text-sm sm:text-base font-medium text-orange-800">
                      Item Image (Optional)
                    </label>
                                         <app-image-upload
                       [selectedImage]="selectedImages[0] || null"
                       [uploadedImageUrl]="uploadedImageUrl"
                       [isUploading]="isUploading()"
                       (imageSelected)="onImageSelected($event)"
                       (imageRemoved)="onImageRemoved()"
                       (uploadedImageRemoved)="onUploadedImageRemoved()"
                     />
                    <p class="text-xs sm:text-sm text-gray-500">
                      Upload a photo to help identify the item. Maximum 5 images, 5MB each.
                    </p>
                  </div>

                  <!-- Submit Button -->
                  <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <button
                      type="submit"
                      [disabled]="itemForm.invalid || isSubmitting()"
                      class="flex-1 btn-responsive-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg *ngIf="isSubmitting()" class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg *ngIf="!isSubmitting()" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>{{ isSubmitting() ? 'Submitting...' : 'Submit Report' }}</span>
                    </button>

                    <button
                      type="button"
                      (click)="goBack()"
                      class="flex-1 btn-responsive-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ReportComponent implements OnInit {
  itemType: ItemType = 'lost';
  itemForm: FormGroup;
  selectedImages: ImageFile[] = [];
  uploadedImageUrl = '';
  isSubmitting = signal(false);
  isUploading = signal(false);

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);
  private itemService = inject(ItemService);
  private cloudinaryService = inject(CloudinaryService);
  protected uiText = inject(UiTextService);

  constructor() {
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      contactInfo: ['', [Validators.required, contactInfoValidator]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.itemType = params['type'] as ItemType;
      if (!['lost', 'found'].includes(this.itemType)) {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.itemForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  onImagesSelected(images: ImageFile[]) {
    this.selectedImages = images;
  }

  onImagesRemoved(images: ImageFile[]) {
    this.selectedImages = images;
  }

  onImageSelected(image: ImageFile) {
    this.selectedImages = [image];
  }

  onImageRemoved() {
    this.selectedImages = [];
  }

  onUploadedImageRemoved() {
    this.uploadedImageUrl = '';
  }

  async onSubmitForm() {
    if (this.itemForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      // Upload images first
      const imageUrls: string[] = [];
      for (const image of this.selectedImages) {
        const result = await firstValueFrom(
          this.cloudinaryService.uploadImage(image.file)
        );
        imageUrls.push(result.secure_url);
      }

      // Prepare form data
      const formData = {
        ...this.itemForm.value,
        type: this.itemType,
        images: imageUrls
      } as { [key: string]: unknown };

      // Submit to API
      const response = await firstValueFrom(
        this.itemService.submitItem(formData as any)
      );

      if (response.success) {
        this.toastr.success(
          `${this.itemType === 'lost' ? 'Lost' : 'Found'} item reported successfully!`,
          'Success'
        );
        this.router.navigate(['/dashboard']);
      } else {
        throw new Error(response.message || 'Failed to submit report');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit report. Please try again.';
      this.toastr.error(errorMessage, 'Error');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.itemForm.controls).forEach(key => {
      const control = this.itemForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}