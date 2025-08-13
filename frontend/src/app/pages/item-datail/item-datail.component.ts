import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  contactInfo: string;
  userId: string;
  imageUrl?: string;
  image?: string;
  status?: 'active' | 'resolved';
  createdAt: string;
  updatedAt: string;
  posterName?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
}

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div class="container-responsive-md py-6 sm:py-8 lg:py-12">
        <!-- Back Button -->
        <div class="mb-6 sm:mb-8">
          <button
            (click)="goBack()"
            class="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200 text-sm sm:text-base"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Listings
          </button>
        </div>

        <!-- Toast Message -->
        <div *ngIf="showToast" 
             class="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out"
             [class.translate-x-0]="showToast"
             [class.translate-x-full]="!showToast">
          <div class="bg-white border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-center max-w-sm sm:max-w-md">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div class="flex-1">
              <p class="text-sm sm:text-base font-medium text-gray-900">Success!</p>
              <p class="text-xs sm:text-sm text-gray-600">{{ toastMessage }}</p>
            </div>
            <button (click)="hideToast()" class="ml-3 text-gray-400 hover:text-gray-600">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
          <div class="animate-pulse">
            <div class="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
              <div class="w-full lg:w-1/2 h-64 sm:h-80 lg:h-96 bg-gray-300 rounded-lg"></div>
              <div class="w-full lg:w-1/2 space-y-4 sm:space-y-6">
                <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                <div class="h-8 bg-gray-300 rounded w-3/4"></div>
                <div class="h-4 bg-gray-300 rounded w-full"></div>
                <div class="h-4 bg-gray-300 rounded w-5/6"></div>
                <div class="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage && !isLoading" class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 text-center">
          <div class="text-red-500 mb-6 sm:mb-8">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.186-.833-2.956 0L3.858 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="text-lg sm:text-xl font-semibold">{{ errorMessage }}</p>
          </div>
          <button
            (click)="loadItemDetails()"
            class="btn-responsive bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Item Details -->
        <div *ngIf="!isLoading && !errorMessage && item" class="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-orange-50 to-orange-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-orange-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div>
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <span 
                    [class]="item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                    class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
                  >
                    {{ item.type === 'lost' ? 'Lost' : 'Found' }}
                  </span>
                  <span 
                    [class]="item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
                  >
                    {{ item.status === 'resolved' ? 'Resolved' : 'Active' }}
                  </span>
                </div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-900">{{ item.title }}</h1>
              </div>
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  *ngIf="isOwner()"
                  (click)="editItem()"
                  class="btn-responsive-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span class="hidden sm:inline">Edit</span>
                  <span class="sm:hidden">Edit</span>
                </button>
                <button
                  *ngIf="isOwner()"
                  (click)="deleteItem()"
                  class="btn-responsive-sm bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span class="hidden sm:inline">Delete</span>
                  <span class="sm:hidden">Delete</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-6 lg:p-8">
            <div class="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
              <!-- Image Section -->
              <div class="w-full lg:w-1/2">
                <div class="relative group">
                  <img
                    [src]="item.imageUrl || item.image || 'assets/package_placeholder.jpg'"
                    [alt]="item.title"
                    class="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                </div>
              </div>

              <!-- Details Section -->
              <div class="w-full lg:w-1/2 space-y-6 sm:space-y-8">
                <!-- Description -->
                <div>
                  <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Description</h3>
                  <p class="text-sm sm:text-base text-gray-700 leading-relaxed">{{ item.description }}</p>
                </div>

                <!-- Item Details -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 class="text-sm sm:text-base font-semibold text-gray-900 mb-2">Category</h4>
                    <p class="text-sm sm:text-base text-gray-600">{{ item.category }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm sm:text-base font-semibold text-gray-900 mb-2">Location</h4>
                    <p class="text-sm sm:text-base text-gray-600">{{ item.location }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm sm:text-base font-semibold text-gray-900 mb-2">Date</h4>
                    <p class="text-sm sm:text-base text-gray-600">{{ formatDate(item.date) }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm sm:text-base font-semibold text-gray-900 mb-2">Posted</h4>
                    <p class="text-sm sm:text-base text-gray-600">{{ formatDate(item.createdAt) }}</p>
                  </div>
                </div>

                <!-- Contact Information -->
                <div>
                  <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Contact Information</h3>
                  <div class="bg-orange-50 rounded-lg p-4 sm:p-6 border border-orange-200">
                    <p class="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{{ item.contactInfo }}</p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <button
                    (click)="contactOwner()"
                    class="flex-1 btn-responsive-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="hidden sm:inline">Contact Owner</span>
                    <span class="sm:hidden">Contact</span>
                  </button>
                  <button
                    (click)="markAsResolved()"
                    *ngIf="isOwner() && item.status !== 'resolved'"
                    class="flex-1 btn-responsive-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="hidden sm:inline">Mark as Resolved</span>
                    <span class="sm:hidden">Resolved</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  item: Listing | null = null;
  isLoading = true;
  errorMessage = '';
  showToast = false;
  toastMessage = '';
  private subscription = new Subscription();

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadItemDetails();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadItemDetails() {
    this.isLoading = true;
    this.errorMessage = '';

    const itemId = this.route.snapshot.paramMap.get('id');
    console.log('Loading item details for ID:', itemId);
    
    if (!itemId) {
      this.errorMessage = 'Item ID not provided';
      this.isLoading = false;
      return;
    }

    // Check if user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Please log in to view item details';
      this.isLoading = false;
      return;
    }

    const token = this.authService.getToken();
    console.log('Auth token:', token ? 'Present' : 'Missing');

    this.subscription.add(
      this.http.get<{ success: boolean; data: Listing; message?: string }>(`${environment.apiBaseUrl}/api/item/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          if (response.success) {
            this.item = response.data;
          } else {
            this.errorMessage = response.message || 'Failed to load item details';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading item details:', error);
          this.errorMessage = error.error?.message || 'Failed to load item details';
          this.isLoading = false;
        }
      })
    );
  }

  isOwner(): boolean {
    if (!this.item || !this.authService.isLoggedIn()) return false;
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === this.item.userId;
  }

  goBack() {
    this.location.back();
  }

  editItem() {
    if (this.item) {
      this.router.navigate(['/edit-item', this.item.id]);
    }
  }

  deleteItem() {
    if (!this.item) return;

    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      const token = this.authService.getToken();
      this.subscription.add(
        this.http.delete<{ success: boolean; message?: string }>(`${environment.apiBaseUrl}/api/item/${this.item.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).subscribe({
          next: (response) => {
            if (response.success) {
              this.showToastMessage('Item deleted successfully');
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 2000);
            } else {
              this.showToastMessage(response.message || 'Failed to delete item');
            }
          },
          error: (error) => {
            console.error('Error deleting item:', error);
            this.showToastMessage('Failed to delete item');
          }
        })
      );
    }
  }

  contactOwner() {
    if (this.item) {
      // Copy contact info to clipboard
      navigator.clipboard.writeText(this.item.contactInfo).then(() => {
        this.showToastMessage('Contact information copied to clipboard');
      }).catch(() => {
        this.showToastMessage('Failed to copy contact information');
      });
    }
  }

  markAsResolved() {
    if (!this.item) return;

    const token = this.authService.getToken();
    this.subscription.add(
      this.http.patch<{ success: boolean; data: Listing; message?: string }>(`${environment.apiBaseUrl}/api/item/${this.item.id}`, {
        status: 'resolved'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: (response) => {
          if (response.success) {
            this.item = response.data;
            this.showToastMessage('Item marked as resolved');
          } else {
            this.showToastMessage(response.message || 'Failed to update item status');
          }
        },
        error: (error) => {
          console.error('Error updating item status:', error);
          this.showToastMessage('Failed to update item status');
        }
      })
    );
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.hideToast();
    }, 5000);
  }

  hideToast() {
    this.showToast = false;
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}