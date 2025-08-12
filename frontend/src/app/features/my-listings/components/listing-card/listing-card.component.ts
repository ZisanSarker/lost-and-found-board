import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-orange-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div class="flex flex-col lg:flex-row">
        <div class="w-full lg:w-48 h-48 bg-gray-200 relative group">
          <img
            [src]="listing.imageUrl || listing.image || 'assets/package_placeholder.jpg'"
            [alt]="listing.title"
            width="300"
            height="200"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div class="flex-1 p-4 sm:p-6">
          <div class="flex justify-between items-start gap-3 sm:gap-4">
            <div class="flex-1 min-w-0">
              <span [class]="getBadgeClass(listing.type)" class="px-2 py-1 rounded-md text-xs font-medium">
                {{ listing.type === 'lost' ? 'Lost' : 'Found' }}
              </span>
              
              <h4 class="text-base sm:text-lg font-medium mt-2 text-gray-800 line-clamp-2">
                {{ listing.title }}
              </h4>
              
              <p class="text-sm sm:text-base text-gray-600 mt-1 line-clamp-2">
                {{ listing.description }}
              </p>
            </div>
            
            <div class="relative flex-shrink-0">
              <button
                (click)="toggleDropdown()"
                class="p-2 border-1 border-orange-500 bg-orange-200 hover:bg-orange-300 rounded-lg transition-colors duration-200"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"></path>
                </svg>
              </button>
              
              <div
                *ngIf="isDropdownOpen"
                class="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                <button
                  (click)="onView()"
                  class="w-full text-left px-3 sm:px-4 py-2 hover:bg-orange-400 flex items-center text-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  View
                </button>
                
                <button
                  (click)="onEdit()"
                  class="w-full text-left px-3 sm:px-4 py-2 hover:bg-orange-400 flex items-center text-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>

                <hr class="border-gray-200" />
                
                <button
                  (click)="onDelete()"
                  class="w-full text-left px-3 sm:px-4 py-2 text-red-600 hover:bg-red-600 flex items-center hover:text-white text-sm"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-3 sm:gap-4 mt-4 text-xs sm:text-sm text-gray-800">
            <div class="flex items-center">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="truncate">{{ listing.location }}</span>
            </div>
            
            <div class="flex items-center">
              <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z"></path>
              </svg>
              <span>{{ listing.date }}</span>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              (click)="onView()"
              class="btn-responsive-sm bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-md transition-all duration-300"
            >
              <span class="hidden sm:inline">View Details</span>
              <span class="sm:hidden">View</span>
            </button>
            
            <button
              (click)="onEdit()"
              class="btn-responsive-sm border border-gray-900 text-gray-800 hover:border-orange-600 hover:text-orange-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span class="hidden sm:inline">Edit</span>
              <span class="sm:hidden">Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ListingCardComponent {
  @Input() listing!: Listing;
  @Output() view = new EventEmitter<Listing>();
  @Output() edit = new EventEmitter<Listing>();
  @Output() delete = new EventEmitter<Listing>();

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onView(): void {
    this.isDropdownOpen = false;
    this.view.emit(this.listing);
  }

  onEdit(): void {
    this.isDropdownOpen = false;
    this.edit.emit(this.listing);
  }

  onDelete(): void {
    this.isDropdownOpen = false;
    this.delete.emit(this.listing);
  }

  getBadgeClass(type: string): string {
    if (type === 'lost') {
      return 'bg-gradient-to-r from-red-700 to-red-600 text-white px-2 py-1 rounded-md text-xs font-medium';
    }
    return 'bg-gradient-to-r from-green-700 to-green-600 text-white px-2 py-1 rounded-md text-xs font-medium';
  }
}