import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Listing } from '../../../features/my-listings/models/listing.model';

@Component({
  selector: 'app-item-view-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal Backdrop -->
    <div 
      *ngIf="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      (click)="onBackdropClick($event)"
    >
      <!-- Modal Content -->
      <div 
        class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        (click)="$event.stopPropagation()"
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-4 border-b border-orange-200 rounded-t-xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span 
                [class]="item?.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ item?.type === 'lost' ? 'Lost' : 'Found' }}
              </span>
              <span 
                [class]="item?.status === 'resolved' || item?.status === 'found' || item?.status === 'closed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ item?.status === 'resolved' ? 'Resolved' : item?.status === 'found' ? 'Found' : item?.status === 'closed' ? 'Closed' : 'Active' }}
              </span>
            </div>
            <button 
              (click)="close()"
              class="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <h2 class="text-xl font-bold text-orange-900 mt-2">{{ item?.title }}</h2>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Image Section -->
            <div class="w-full lg:w-1/2">
              <div class="relative group">
                <img
                  [src]="item?.imageUrl || item?.image || 'assets/package_placeholder.jpg'"
                  [alt]="item?.title"
                  class="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
              </div>
            </div>

            <!-- Details Section -->
            <div class="w-full lg:w-1/2 space-y-6">
              <!-- Description -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p class="text-gray-700 leading-relaxed">{{ item?.description }}</p>
              </div>

              <!-- Item Details -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-2">Category</h4>
                  <p class="text-gray-600">{{ item?.category }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-2">Location</h4>
                  <p class="text-gray-600">{{ item?.location }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-2">Date</h4>
                  <p class="text-gray-600">{{ formatDate(item?.date) }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-2">Posted</h4>
                  <p class="text-gray-600">{{ formatDate(item?.createdAt) }}</p>
                </div>
              </div>

              <!-- Contact Information -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p class="text-gray-700 whitespace-pre-wrap">{{ item?.contactInfo }}</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  (click)="onEdit()"
                  class="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Post
                </button>
                <button
                  (click)="onDelete()"
                  class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ItemViewModalComponent {
  @Input() isOpen = false;
  @Input() item: Listing | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Listing>();
  @Output() delete = new EventEmitter<Listing>();

  close(): void {
    this.closeModal.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onEdit(): void {
    if (this.item) {
      this.edit.emit(this.item);
    }
  }

  onDelete(): void {
    if (this.item) {
      this.delete.emit(this.item);
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
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
