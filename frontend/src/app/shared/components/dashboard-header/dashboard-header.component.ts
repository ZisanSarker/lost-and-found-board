import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent animate-pulse">
            Dashboard
          </h1>
          <p class="text-sm sm:text-base text-gray-600 mt-2">Manage your lost and found items</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            (click)="navigateTo('lost')"
            class="btn-responsive bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="hidden sm:inline">Report Lost Item</span>
            <span class="sm:hidden">Lost Item</span>
          </button>
          <button 
            (click)="navigateTo('found')"
            class="btn-responsive border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="hidden sm:inline">Report Found Item</span>
            <span class="sm:hidden">Found Item</span>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardHeaderComponent {
  private router = inject(Router);

  navigateTo(type: 'lost' | 'found') {
    this.router.navigate([`/repost/${type}`]);
  }
}
