import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemGridComponent } from '../../../../shared/components/item-grid/item-grid.component';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Item, ItemType } from '../../../../shared/models/item.model';
import { ItemService } from '../../../../core/services/item.service';
import { ItemFilterService } from '../../../../core/services/item-filter.service';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [CommonModule, ItemGridComponent, SearchBarComponent, PaginationComponent],
  template: `
    <div class="min-h-screen">
      <div class="container-responsive py-6 sm:py-8 lg:py-12">
        <!-- Header -->
        <div class="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 class="text-responsive-2xl font-bold text-orange-800 mb-3 sm:mb-4 animate-bounce">
            Find What Matters Most
          </h1>
          <p class="text-responsive-base text-orange-600 max-w-2xl mx-auto leading-relaxed">
            Search through our database of lost and found items to find what
            you're looking for.
          </p>
        </div>

        <!-- Search Bar -->
        <div class="mb-6 sm:mb-8">
          <app-search-bar (search)="onSearch($event)"></app-search-bar>
        </div>

        <!-- Tab Switcher -->
        <div class="flex justify-center mb-6 sm:mb-8">
          <div class="bg-white rounded-lg p-1 shadow-md w-full max-w-md">
            <div class="grid grid-cols-2 gap-1">
              <button
                (click)="setActiveTab('lost')"
                [class]="activeTab === 'lost' ? 'bg-orange-500 text-white' : 'text-orange-500 hover:bg-orange-50'"
                class="px-3 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base"
              >
                <span class="hidden sm:inline">Lost Items</span>
                <span class="sm:hidden">Lost</span>
                <span class="block sm:inline">({{ lostTotalCount }})</span>
              </button>
              <button
                (click)="setActiveTab('found')"
                [class]="activeTab === 'found' ? 'bg-orange-500 text-white' : 'text-orange-500 hover:bg-orange-50'"
                class="px-3 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base"
              >
                <span class="hidden sm:inline">Found Items</span>
                <span class="sm:hidden">Found</span>
                <span class="block sm:inline">({{ foundTotalCount }})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-8 sm:py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
          <p class="text-orange-600 mt-2 sm:mt-4 text-sm sm:text-base">Loading items...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !isLoading" class="text-center py-8 sm:py-12">
          <div class="max-w-md mx-auto">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <svg class="w-8 h-8 sm:w-12 sm:h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p class="text-red-600 text-sm sm:text-base mb-4">{{ error }}</p>
              <button 
                (click)="loadData()" 
                class="btn-responsive bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>

        <!-- Items Grid -->
        <app-item-grid
          *ngIf="!isLoading && !error"
          [items]="currentItems"
          [loading]="isLoading"
          [emptyMessage]="getEmptyMessage()"
        ></app-item-grid>

        <!-- Pagination -->
        <app-pagination
          *ngIf="!isLoading && !error && totalPages > 1"
          [currentPage]="currentPage"
          [totalPages]="totalPages"
          (pageChange)="onPageChange($event)"
        ></app-pagination>

        <!-- Items Info -->
        <div *ngIf="!isLoading && !error && currentItems.length > 0" class="text-center mt-4 text-sm text-gray-600">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalCount) }} of {{ totalCount }} {{ activeTab }} items
        </div>
      </div>
    </div>
  `,
})
export class AllPostsComponent implements OnInit {
  activeTab: ItemType = 'lost';
  isLoading = true;
  error: string = '';

  searchQuery = '';
  searchCategory = 'all';
  searchLocation = 'all';

  // Current page items (only 6 items per page)
  currentItems: Item[] = [];

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  totalCount: number = 0;

  // Total counts for tabs
  lostTotalCount: number = 0;
  foundTotalCount: number = 0;

  // Math utility for template
  Math = Math;

  private itemService = inject(ItemService);
  private itemFilterService = inject(ItemFilterService);

  ngOnInit() {
    this.loadData();
    this.loadTotalCounts();
  }

  loadTotalCounts() {
    this.itemService.getTotalCounts().subscribe({
      next: (counts) => {
        this.lostTotalCount = counts.lost;
        this.foundTotalCount = counts.found;
      },
      error: (err) => {
        console.error('Failed to load total counts:', err);
        // Don't show error for total counts, just log it
      }
    });
  }

  setActiveTab(tab: ItemType) {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.currentPage = 1; // Reset to first page when switching tabs
      this.error = '';
      this.loadItemsByType(tab, 1);
    }
  }

  loadData() {
    this.error = '';
    this.isLoading = true;
    
    // Load first page of the active tab
    this.loadItemsByType(this.activeTab, 1);
  }

  loadItemsByType(type: ItemType, page: number = 1) {
    this.isLoading = true;
    this.error = '';

    this.itemService.getItemsByType(type, page, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response.success) {
          this.currentItems = response.data;
          this.totalPages = response.totalPages || 1;
          this.totalCount = response.totalCount || 0;
          
          // Update total counts for tabs
          if (type === 'lost') {
            this.lostTotalCount = response.totalCount || 0;
          } else {
            this.foundTotalCount = response.totalCount || 0;
          }
        } else {
          this.error = response.message || `Failed to load ${type} items`;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(`Failed to load ${type} items:`, err);
        this.error = `Failed to load ${type} items. Please try again.`;
        this.isLoading = false;
      }
    });
  }

  getEmptyMessage(): string {
    const hasFilters = this.searchQuery || 
                      this.searchCategory !== 'all' || 
                      this.searchLocation !== 'all';
    
    if (hasFilters) {
      return `No ${this.activeTab} items found matching your search criteria`;
    }
    
    return `No ${this.activeTab} items found`;
  }

  onSearch(searchData: { query: string; category: string; location: string }) {
    this.searchQuery = searchData.query;
    this.searchCategory = searchData.category;
    this.searchLocation = searchData.location;
    this.currentPage = 1; // Reset to first page when searching
    
    // For now, we'll do client-side filtering since server-side search has route issues
    // In the future, this should call a search endpoint
    this.applyFilters();
  }

  applyFilters() {
    // Apply client-side filtering to current items
    if (this.searchQuery || this.searchCategory !== 'all' || this.searchLocation !== 'all') {
      this.currentItems = this.itemFilterService.filterItems(
        this.currentItems,
        this.searchQuery,
        this.searchCategory,
        this.searchLocation
      );
    } else {
      // If no filters, reload the current page
      this.loadItemsByType(this.activeTab, this.currentPage);
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadItemsByType(this.activeTab, page);
  }
}