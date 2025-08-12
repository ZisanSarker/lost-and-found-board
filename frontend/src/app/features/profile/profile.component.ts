import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { UserProfile } from './models/user-profile.model';
import { ProfileService } from '../../core/services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { BioComponent } from './components/bio/bio.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileHeaderComponent,
    ContactInfoComponent,
    BioComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div class="container-responsive py-6 sm:py-8 lg:py-12">
        <!-- Back Navigation -->
        <div class="mb-6 sm:mb-8">
          <button
            (click)="goBack()"
            class="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200 text-sm sm:text-base"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <!-- Loading State -->
        <app-loading-state
          *ngIf="loading()"
          [style]="'spinner'"
          [size]="'lg'"
          [variant]="'primary'"
          [text]="'Loading your profile...'"
          [fullscreen]="false"
          [overlay]="false"
        />

        <!-- Error State -->
        <app-error-state
          *ngIf="error()"
          [title]="getErrorTitle()"
          [errorMessage]="error()"
          [variant]="getErrorVariant()"
          [layout]="'centered'"
          [size]="'lg'"
          [showRetryButton]="true"
          [retryButtonText]="'Try Again'"
          [showDismissButton]="shouldShowDismissButton()"
          [dismissButtonText]="'Log In'"
          (retry)="loadProfile()"
          (dismiss)="handleAuthError()"
        />

        <!-- Empty State -->
        <app-empty-state
          *ngIf="!loading() && !error() && !userProfile()"
          [title]="'Profile Not Found'"
          [message]="'Unable to load your profile information'"
          [variant]="'error'"
          [size]="'lg'"
          [layout]="'centered'"
          [showActionButton]="true"
          [actionButtonText]="'Try Again'"
          [timestamp]="currentTimestamp"
          [username]="currentUsername"
          (action)="loadProfile()"
        >
          <span message-suffix class="block mt-2 text-sm text-gray-400">
            Try refreshing the page or contact support if the issue persists.
          </span>
        </app-empty-state>

        <!-- Profile Content -->
        <div
          *ngIf="!loading() && !error() && userProfile()"
          class="max-w-4xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12"
        >
          <!-- Profile Header -->
          <app-profile-header
            [profile]="userProfile()!"
            [isEditing]="isEditing()"
            [editForm]="editForm"
          >
            <ng-container avatarSection>
              <div class="relative group">
                <div class="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 p-1 backdrop-blur-sm">
                  <img
                    [src]="selectedAvatar?.preview || editForm.avatar || userProfile()!.avatar"
                    [alt]="userProfile()!.username"
                    class="w-full h-full rounded-full object-cover border-4 border-white/30 shadow-2xl"
                  />
                </div>

                <div
                  *ngIf="isEditing()"
                  class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  (click)="fileInput.click()"
                >
                  <div *ngIf="!isUploadingAvatar()" class="text-center">
                    <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs sm:text-sm text-white">Change Photo</span>
                  </div>
                  <div *ngIf="isUploadingAvatar()" class="text-center">
                    <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white mx-auto mb-1"></div>
                    <span class="text-xs sm:text-sm text-white">Uploading...</span>
                  </div>
                </div>
              </div>

              <input
                #fileInput
                type="file"
                accept="image/*"
                class="hidden"
                                 (change)="onAvatarSelected($event)"
              />
            </ng-container>
          </app-profile-header>

          <!-- Profile Sections Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <!-- Contact Information -->
            <div class="card-responsive bg-white/80 backdrop-blur-sm border border-orange-200">
              <app-contact-info
                [profile]="userProfile()!"
                [isEditing]="isEditing()"
                [editForm]="editForm"
              />
            </div>

            <!-- Bio Section -->
            <div class="card-responsive bg-white/80 backdrop-blur-sm border border-orange-200">
              <app-bio
                [profile]="userProfile()!"
                [isEditing]="isEditing()"
                [editForm]="editForm"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              *ngIf="!isEditing()"
              (click)="startEditing()"
              class="btn-responsive-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>

            <button
              *ngIf="isEditing()"
              (click)="saveProfile()"
                             [disabled]="saving()"
               class="btn-responsive-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               <svg *ngIf="saving()" class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                 <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               <svg *ngIf="!saving()" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
               </svg>
               <span>{{ saving() ? 'Saving...' : 'Save Changes' }}</span>
            </button>

            <button
              *ngIf="isEditing()"
              (click)="cancelEditing()"
              class="btn-responsive-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private toastr = inject(ToastrService);
  private cloudinaryService = inject(CloudinaryService);

  loading = signal(false);
  error = signal('');
  saving = signal(false);
  isEditing = signal(false);
  userProfile = signal<UserProfile | null>(null);
  showDeleteModal = signal(false);
  selectedAvatar: { file: File; preview: string } | null = null;
  isUploadingAvatar = signal(false);
  currentTimestamp = '2025-06-04 06:35:09';
  currentUsername = 'ZisanSarker';

  editForm: Partial<UserProfile & { avatar?: string }> = {};

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.error.set('');

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.handleError(err);
        this.loading.set(false);
      }
    });
  }

  getErrorTitle(): string {
    if (!this.error()) return '';
    
    if (this.error().includes('not authenticated')) {
      return 'Authentication Required';
    }
    if (this.error().includes('not found')) {
      return 'Profile Not Found';
    }
    if (this.error().includes('permission')) {
      return 'Access Denied';
    }
    return 'Error Loading Profile';
  }

  getErrorVariant(): 'danger' | 'warning' | 'info' {
    if (!this.error()) return 'danger';
    
    if (this.error().includes('not authenticated')) {
      return 'warning';
    }
    if (this.error().includes('permission')) {
      return 'danger';
    }
    return 'info';
  }

  shouldShowDismissButton(): boolean {
    return this.error().includes('not authenticated') || 
           this.error().includes('session expired');
  }

  async onAvatarSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.cloudinaryService.isValidImageFile(file)) {
      this.toastr.error(
        'Please select a valid image file (JPEG, PNG, GIF) under 5MB',
        'Invalid File'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.selectedAvatar = {
        file: file,
        preview: e.target.result,
      };
      this.uploadAvatar();
    };
    reader.readAsDataURL(file);
  }

  private async uploadAvatar(): Promise<void> {
    if (!this.selectedAvatar) return;

    this.isUploadingAvatar.set(true);

    try {
      const response = await firstValueFrom(
        this.cloudinaryService.uploadImage(this.selectedAvatar.file)
      );

      this.editForm.avatar = response.secure_url;
      this.toastr.success('Avatar uploaded successfully!', 'Success');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      this.toastr.error(
        'Failed to upload avatar. Please try again.',
        'Upload Error'
      );
      this.removeAvatar();
    } finally {
      this.isUploadingAvatar.set(false);
    }
  }

  removeAvatar(): void {
    this.selectedAvatar = null;
    if (this.editForm.avatar) {
      delete this.editForm.avatar;
    }
  }

  startEditing() {
    if (this.userProfile()) {
      const profile = this.userProfile()!;
      this.editForm = {
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        avatar: profile.avatar,
      };
      this.isEditing.set(true);
    }
  }

  cancelEditing() {
    this.isEditing.set(false);
    this.editForm = {};
    this.selectedAvatar = null;
  }

  saveProfile() {
    if (!this.editForm.username?.trim()) {
      this.toastr.error('Username is required');
      return;
    }

    this.saving.set(true);

    const updateData = {
      username: this.editForm.username.trim(),
      phone: this.editForm.phone?.trim() || '',
      location: this.editForm.location?.trim() || '',
      bio: this.editForm.bio?.trim() || '',
      avatar: this.editForm.avatar || this.userProfile()!.avatar,
    };

    this.profileService.updateProfile(updateData).subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.isEditing.set(false);
        this.saving.set(false);
        this.editForm = {};
        this.toastr.success('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.handleError(err);
        this.saving.set(false);
      }
    });
  }

  deleteAccount() {
    this.showDeleteModal.set(true);
  }

  confirmDeleteAccount() {
    this.showDeleteModal.set(false);

    this.profileService.deleteAccount().subscribe({
      next: () => {
        this.toastr.success('Account deleted successfully');
        setTimeout(() => {
          this.logout();
        }, 2000);
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        this.handleError(err);
      }
    });
  }

  cancelDeleteAccount() {
    this.showDeleteModal.set(false);
  }

  logout() {
    this.authService.logout();
    this.toastr.success('Logged out successfully');
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      this.error.set('You are not authenticated. Please log in to continue.');
      this.handleAuthError();
    } else if (error.status === 403) {
      this.error.set('You do not have permission to access this profile.');
    } else if (error.status === 404) {
      this.error.set('Profile not found. The requested profile does not exist.');
    } else if (error.status === 0) {
      this.error.set('Unable to connect to the server. Please check your internet connection.');
    } else {
      this.error.set(error.message || 'An unexpected error occurred while loading your profile.');
    }
  }

  handleAuthError() {
    this.authService.logout();
    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: '/profile',
        message: this.error()
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}