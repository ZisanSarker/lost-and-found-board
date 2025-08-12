import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <!-- Image Container with Responsive Size -->
      <div class="relative h-32 sm:h-40 md:h-48 w-full overflow-hidden bg-gray-200">
        <img 
          [src]="image || 'assets/package_placeholder.jpg'" 
          [alt]="title"
          (error)="onImageError($event)"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        <!-- Status Badge -->
        <div class="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span 
            [class]="isLost ? 'bg-red-500 text-white' : 'bg-green-500 text-white'"
            class="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md"
          >
            {{ isLost ? 'Lost' : 'Found' }}
          </span>
        </div>

        <!-- Image overlay for better text readability -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <!-- Content -->
      <div class="p-3 sm:p-4">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {{ title }}
        </h3>
        
        <p class="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
          {{ description }}
        </p>
        
        <!-- Location and Date -->
        <div class="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
          <div class="flex items-center text-xs sm:text-sm text-gray-500">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="truncate">{{ location }}</span>
          </div>
          
          <div class="flex items-center text-xs sm:text-sm text-gray-500">
            <svg class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ formatDate(date) }}</span>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2">
          <button 
            (click)="onViewDetails()"
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
            (click)="onContact()"
            [class]="isLost ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
            class="flex-1 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="hidden sm:inline">Contact</span>
            <span class="sm:hidden">Contact</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class ItemCardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() location!: string;
  @Input() date!: string;
  @Input() type!: 'lost' | 'found';
  @Input() image?: string;

  constructor(private router: Router) {}

  get isLost(): boolean {
    return this.type === 'lost';
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/package_placeholder.jpg';
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return 'Today';
      } else if (diffDays === 2) {
        return 'Yesterday';
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch {
      return dateString;
    }
  }

  onViewDetails() {
    if (this.id) {
      this.router.navigate(['/item-detail', this.id]);
    } else {
      console.warn('No ID provided for item card navigation');
    }
  }

  onContact() {
    if (this.id) {
      this.router.navigate(['/contact', this.id]);
    } else {
      console.warn('No ID provided for item card navigation');
    }
  }
}