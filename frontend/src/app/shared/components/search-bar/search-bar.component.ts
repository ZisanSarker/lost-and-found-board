// search-bar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-4xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search input -->
        <div class="flex-1 relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 text-lg">🔍</span>
          <input
            type="text"
            [(ngModel)]="query"
            (input)="handleSearch()"
            (keydown.enter)="handleSearch()"
            placeholder="Search for items..."
            class="input-responsive pl-10 pr-4 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <!-- Filters (desktop) -->
        <div class="hidden lg:flex gap-3">
          <select 
            [(ngModel)]="category" 
            (change)="handleSearch()"
            class="px-3 py-2 sm:px-4 sm:py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base bg-white"
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="personal">Personal Items</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </select>

          <select 
            [(ngModel)]="location" 
            (change)="handleSearch()"
            class="px-3 py-2 sm:px-4 sm:py-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base bg-white"
          >
            <option value="all">All Locations</option>
            <option value="downtown">Downtown</option>
            <option value="coffee shop">Coffee Shop</option>
            <option value="central park">Central Park</option>
            <option value="bus station">Bus Station</option>
            <option value="library">Library</option>
            <option value="park">Park</option>
          </select>
        </div>

        <!-- Filter toggle (mobile/tablet) -->
        <button
          class="lg:hidden btn-responsive bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center gap-2"
          (click)="showFilters = !showFilters"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span class="hidden sm:inline">Filters</span>
          <span class="sm:hidden">Filter</span>
        </button>
      </div>

      <!-- Mobile/Tablet filters -->
      <div *ngIf="showFilters" class="mt-4 lg:hidden animate-slide-down">
        <div class="bg-orange-50 rounded-lg p-4 space-y-3">
          <div>
            <label class="block text-sm font-medium text-orange-800 mb-1">Category</label>
            <select 
              [(ngModel)]="category" 
              (change)="handleSearch()"
              class="input-responsive w-full"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="personal">Personal Items</option>
              <option value="documents">Documents</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-orange-800 mb-1">Location</label>
            <select 
              [(ngModel)]="location" 
              (change)="handleSearch()"
              class="input-responsive w-full"
            >
              <option value="all">All Locations</option>
              <option value="downtown">Downtown</option>
              <option value="coffee shop">Coffee Shop</option>
              <option value="central park">Central Park</option>
              <option value="bus station">Bus Station</option>
              <option value="library">Library</option>
              <option value="park">Park</option>
            </select>
          </div>

          <div class="flex gap-2 pt-2">
            <button
              (click)="clearFilters()"
              class="flex-1 btn-responsive-sm border border-orange-300 text-orange-700 hover:bg-orange-100 transition-colors"
            >
              Clear
            </button>
            <button
              (click)="showFilters = false"
              class="flex-1 btn-responsive-sm bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <!-- Active filters display -->
      <div *ngIf="hasActiveFilters()" class="mt-4 flex flex-wrap gap-2">
        <div 
          *ngIf="category !== 'all'"
          class="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs sm:text-sm"
        >
          <span>Category: {{ getCategoryLabel(category) }}</span>
          <button 
            (click)="clearCategory()"
            class="ml-1 hover:bg-orange-200 rounded-full p-0.5"
          >
            ×
          </button>
        </div>
        <div 
          *ngIf="location !== 'all'"
          class="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs sm:text-sm"
        >
          <span>Location: {{ getLocationLabel(location) }}</span>
          <button 
            (click)="clearLocation()"
            class="ml-1 hover:bg-orange-200 rounded-full p-0.5"
          >
            ×
          </button>
        </div>
        <div 
          *ngIf="query"
          class="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs sm:text-sm"
        >
          <span>Search: "{{ query }}"</span>
          <button 
            (click)="clearQuery()"
            class="ml-1 hover:bg-orange-200 rounded-full p-0.5"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  `
})
export class SearchBarComponent {
  query = '';
  category = 'all';
  location = 'all';
  showFilters = false;

  @Output() search = new EventEmitter<{ query: string; category: string; location: string }>();

  handleSearch() {
    this.search.emit({
      query: this.query.trim(),
      category: this.category,
      location: this.location
    });
  }

  clearFilters() {
    this.query = '';
    this.category = 'all';
    this.location = 'all';
    this.handleSearch();
  }

  clearCategory() {
    this.category = 'all';
    this.handleSearch();
  }

  clearLocation() {
    this.location = 'all';
    this.handleSearch();
  }

  clearQuery() {
    this.query = '';
    this.handleSearch();
  }

  hasActiveFilters(): boolean {
    return this.query !== '' || this.category !== 'all' || this.location !== 'all';
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'electronics': 'Electronics',
      'personal': 'Personal Items',
      'documents': 'Documents',
      'other': 'Other'
    };
    return labels[category] || category;
  }

  getLocationLabel(location: string): string {
    const labels: { [key: string]: string } = {
      'downtown': 'Downtown',
      'coffee shop': 'Coffee Shop',
      'central park': 'Central Park',
      'bus station': 'Bus Station',
      'library': 'Library',
      'park': 'Park'
    };
    return labels[location] || location;
  }
}