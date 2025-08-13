import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Listing } from '../../models/listing.model';
import { ItemViewModalComponent } from '../../../../shared/components/item-view-modal/item-view-modal.component';
import { ConfirmationModalComponent, ConfirmationModalData } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule, ItemViewModalComponent, ConfirmationModalComponent],
  template: `
    <div class="card-container bg-white rounded-lg shadow-md overflow-visible hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <!-- Image Container with Responsive Size -->
      <div class="relative h-32 sm:h-40 md:h-48 w-full overflow-visible bg-gray-200">
        <img 
          [src]="listing.imageUrl || listing.image || 'assets/package_placeholder.jpg'" 
          [alt]="listing.title"
          (error)="onImageError($event)"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        <!-- Status Badge -->
        <div class="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span 
            [class]="listing.type === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'"
            class="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md"
          >
            {{ listing.type === 'lost' ? 'Lost' : 'Found' }}
          </span>
        </div>

        <!-- 3-dot Menu Button -->
        <div class="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
          <div class="relative">
            <button
              (click)="toggleDropdown($event)"
              class="p-1.5 sm:p-2 rounded-md shadow-md transition-colors duration-200 bg-orange-100 hover:bg-orange-200"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"></path>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div
              *ngIf="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
              style="z-index: 999999;"
            >
              <button
                (click)="onView()"
                class="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center text-sm text-gray-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Post
              </button>
              
              <button
                (click)="onEdit()"
                class="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center text-sm text-gray-700 transition-colors"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Post
              </button>

              <hr class="border-gray-200 my-1" />
              
              <button
                (click)="onDelete()"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center text-sm transition-colors"
              >
                <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete Post
              </button>
            </div>
          </div>
        </div>

        <!-- Image overlay for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <!-- Content -->
      <div class="card-content p-3 sm:p-4">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
          {{ listing.title }}
        </h3>
        
        <p class="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
          {{ listing.description }}
        </p>
        
        <!-- Location and Date -->
        <div class="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
          <div class="flex items-center text-xs sm:text-sm text-gray-500">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">{{ listing.location }}</span>
          </div>
          
          <div class="flex items-center text-xs sm:text-sm text-gray-500">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(listing.date) }}</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="card-actions flex flex-col sm:flex-row gap-2">
          <button 
            (click)="onView()"
            class="flex-1 bg-white hover:bg-orange-50 text-orange-500 border-2 border-orange-500 text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span class="hidden sm:inline">View Details</span>
            <span class="sm:hidden">Details</span>
          </button>
          
          <button 
            (click)="onEdit()"
            class="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span class="hidden sm:inline">Edit</span>
            <span class="sm:hidden">Edit</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Item View Modal -->
    <app-item-view-modal
      [isOpen]="isModalOpen"
      [item]="listing"
      (closeModal)="closeModal()"
      (edit)="onEdit()"
      (delete)="onDelete()"
    />

    <!-- Confirmation Modal -->
    <app-confirmation-modal
      [isOpen]="isDeleteModalOpen"
      [data]="deleteModalData"
      (confirm)="confirmDelete()"
      (cancel)="cancelDelete()"
      (closeModal)="cancelDelete()"
    />
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    
    .card-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .card-actions {
      margin-top: auto;
    }
  `]
})
export class ListingCardComponent {
  @Input() listing!: Listing;
  @Output() view = new EventEmitter<Listing>();
  @Output() edit = new EventEmitter<Listing>();
  @Output() delete = new EventEmitter<Listing>();

  isDropdownOpen = false;
  isModalOpen = false;
  isDeleteModalOpen = false;
  deleteModalData: ConfirmationModalData = {
    title: 'Delete Post',
    message: 'Are you sure you want to delete this post? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    confirmButtonClass: 'bg-red-600 hover:bg-red-700',
    icon: 'warning'
  };

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    console.log('Toggle dropdown clicked, current state:', this.isDropdownOpen);
    this.isDropdownOpen = !this.isDropdownOpen;
    console.log('New dropdown state:', this.isDropdownOpen);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }

  onView(): void {
    this.isDropdownOpen = false;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onEdit(): void {
    this.isDropdownOpen = false;
    this.edit.emit(this.listing);
  }

  onDelete(): void {
    this.isDropdownOpen = false;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    this.isDeleteModalOpen = false;
    this.delete.emit(this.listing);
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
  }

  getBadgeClass(type: string): string {
    if (type === 'lost') {
      return 'bg-gradient-to-r from-red-700 to-red-600 text-white px-2 py-1 rounded-md text-xs font-medium';
    }
    return 'bg-gradient-to-r from-green-700 to-green-600 text-white px-2 py-1 rounded-md text-xs font-medium';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/package_placeholder.jpg';
  }

  formatDate(date: string): string {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}