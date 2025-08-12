import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemGridComponent } from '../../../../shared/components/item-grid/item-grid.component';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { Item, ItemType } from '../../../../shared/models/item.model';
import { ItemService } from '../../../../core/services/item.service';
import { ItemFilterService } from '../../../../core/services/item-filter.service';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [CommonModule, ItemGridComponent, SearchBarComponent],
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
                <span class="block sm:inline">({{ filteredLostItems.length }})</span>
              </button>
              <button
                (click)="setActiveTab('found')"
                [class]="activeTab === 'found' ? 'bg-orange-500 text-white' : 'text-orange-500 hover:bg-orange-50'"
                class="px-3 sm:px-6 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base"
              >
                <span class="hidden sm:inline">Found Items</span>
                <span class="sm:hidden">Found</span>
                <span class="block sm:inline">({{ filteredFoundItems.length }})</span>
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
          [items]="visibleItems"
          [loading]="isLoading"
          [emptyMessage]="getEmptyMessage()"
        ></app-item-grid>

        <!-- See All / Show Less Button -->
        <div class="text-center mt-6 sm:mt-8" *ngIf="showToggleButton && !isLoading && !error">
          <button
            (click)="toggleShowAll()"
            class="btn-responsive-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all duration-200"
          >
            <span class="hidden sm:inline">{{ showAll ? 'Show Less' : 'See All ' + activeTab + ' Items' }}</span>
            <span class="sm:hidden">{{ showAll ? 'Show Less' : 'See All' }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AllPostsComponent implements OnInit {
  activeTab: ItemType = 'lost';
  isLoading = true;
  showAll = false;
  error: string = '';

  searchQuery = '';
  searchCategory = 'all';
  searchLocation = 'all';

  lostItems: Item[] = [];
  foundItems: Item[] = [];

  private itemService = inject(ItemService);
  private itemFilterService = inject(ItemFilterService);

  ngOnInit() {
    this.loadData();
  }

  setActiveTab(tab: ItemType) {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.showAll = false;
      this.error = '';

      if ((tab === 'lost' && this.lostItems.length === 0) ||
          (tab === 'found' && this.foundItems.length === 0)) {
        this.loadItemsByType(tab);
      }
    }
  }

  loadData() {
    this.error = '';
    this.isLoading = true;
    
    this.itemService.getAllItems().subscribe({
      next: (responses) => {
        if (responses.lost.success) {
          this.lostItems = responses.lost.data;
        }
        if (responses.found.success) {
          this.foundItems = responses.found.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load items:', err);
        this.error = 'Failed to load items. Please try again.';
        this.isLoading = false;
      }
    });
  }

  loadItemsByType(type: ItemType) {
    this.isLoading = true;
    this.error = '';

    this.itemService.getItemsByType(type).subscribe({
      next: (response) => {
        if (response.success) {
          if (type === 'lost') {
            this.lostItems = response.data;
          } else {
            this.foundItems = response.data;
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

  get filteredLostItems(): Item[] {
    return this.itemFilterService.filterItems(
      this.lostItems,
      this.searchQuery,
      this.searchCategory,
      this.searchLocation
    );
  }

  get filteredFoundItems(): Item[] {
    return this.itemFilterService.filterItems(
      this.foundItems,
      this.searchQuery,
      this.searchCategory,
      this.searchLocation
    );
  }

  get visibleItems(): Item[] {
    const items = this.activeTab === 'lost' 
      ? this.filteredLostItems 
      : this.filteredFoundItems;
    return this.showAll ? items : items.slice(0, 3);
  }

  get showToggleButton(): boolean {
    const items = this.activeTab === 'lost' 
      ? this.filteredLostItems 
      : this.filteredFoundItems;
    return items.length > 3;
  }

  getEmptyMessage(): string {
    const hasFilters = this.searchQuery || 
                      this.searchCategory !== 'all' || 
                      this.searchLocation !== 'all';
    return this.itemFilterService.getEmptyMessage(this.activeTab, hasFilters as boolean);
  }

  onSearch(searchData: { query: string; category: string; location: string }) {
    this.searchQuery = searchData.query;
    this.searchCategory = searchData.category;
    this.searchLocation = searchData.location;
    this.showAll = false;
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }
}