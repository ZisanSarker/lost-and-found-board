import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { ListingService } from '../../core/services/listing.service';
import { Listing, ListingFilter } from './models/listing.model';
import { ListingUtils } from './utils/listing.utils';
import { ListingFilterComponent } from './components/listing-filter/listing-filter.component';
import { ListingCardComponent } from './components/listing-card/listing-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent, EmptyStateVariant } from '../../shared/components/empty-state/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { inject } from '@angular/core';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [
    CommonModule,
    ListingFilterComponent,
    ListingCardComponent,
    LoadingStateComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    PaginationComponent,
  ],
  template: `
    <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-orange-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-orange-50 to-orange-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-orange-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-orange-900">My Listings</h2>
            <p class="text-sm sm:text-base text-orange-700 mt-1">
              Manage your lost and found items
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              (click)="createNewListing('lost')"
              class="btn-responsive-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span class="hidden sm:inline">Report Lost Item</span>
              <span class="sm:hidden">Lost Item</span>
            </button>
            <button
              (click)="createNewListing('found')"
              class="btn-responsive-sm bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span class="hidden sm:inline">Report Found Item</span>
              <span class="sm:hidden">Found Item</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-orange-50/50">
        <app-listing-filter
          [activeFilter]="activeFilter"
          [searchQuery]="searchQuery"
          (filterChange)="onFilterChange($event)"
          (searchChange)="onSearchChange($event)"
          (search)="onSearch()"
        />
      </div>

      <!-- Content Section -->
      <div class="p-4 sm:p-6 lg:p-8">
        <!-- Loading State -->
        <app-loading-state
          *ngIf="isLoading"
          [style]="'skeleton'"
          [itemCount]="3"
          [showImage]="true"
          [variant]="'primary'"
          [text]="getLoadingText()"
          [overlay]="isInitialLoad"
        />

        <!-- Error State -->
        <app-error-state
          *ngIf="errorMessage && !isLoading"
          [title]="getErrorTitle()"
          [errorMessage]="errorMessage"
          [variant]="getErrorVariant()"
          [layout]="isInitialLoad ? 'centered' : 'inline'"
          [size]="'md'"
          [showRetryButton]="showRetryButton"
          [retryButtonText]="getRetryButtonText()"
          [showDismissButton]="getErrorVariant() === 'warning'"
          [dismissButtonText]="'Log In'"
          (retry)="onErrorRetry()"
          (dismiss)="onErrorDismiss()"
        />

        <!-- Empty State -->
        <app-empty-state
          *ngIf="!isLoading && !errorMessage && filteredListings.length === 0"
          [title]="getEmptyStateTitle()"
          [message]="getEmptyStateMessage()"
          [variant]="getEmptyStateVariant()"
          [size]="'md'"
          [layout]="'centered'"
          [showActionButton]="shouldShowActionButton()"
          [actionButtonText]="getActionButtonText()"
          [showSecondaryButton]="shouldShowSecondaryButton()"
          [secondaryButtonText]="getSecondaryButtonText()"
          [timestamp]="currentTimestamp"
          [username]="currentUsername"
          (action)="onEmptyStateAction()"
          (secondaryAction)="onEmptyStateSecondaryAction()"
        >
          <ng-container *ngIf="searchQuery" message-suffix>
            <span class="block mt-2 text-sm text-gray-400">
              Try using different keywords or removing filters
            </span>
          </ng-container>
        </app-empty-state>

        <!-- Listings Grid -->
        <div
          *ngIf="!isLoading && !errorMessage && filteredListings.length > 0"
          class="space-y-4 sm:space-y-6"
        >
          <!-- Results Summary -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm sm:text-base">
            <div class="text-gray-600">
              Showing <span class="font-semibold text-orange-600">{{ filteredListings.length }}</span> 
              of <span class="font-semibold text-orange-600">{{ allListings.length }}</span> listings
            </div>
            <div class="flex items-center gap-2 text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Last updated: {{ getLastUpdatedTime() }}</span>
            </div>
          </div>

          <!-- Listings -->
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <app-listing-card
              *ngFor="let listing of visibleListings"
              [listing]="listing"
              (edit)="onEditListing(listing.id)"
              (delete)="onDeleteListing(listing.id)"
            />
          </div>

          <!-- Pagination -->
          <app-pagination
            *ngIf="totalPages > 1"
            [currentPage]="currentPage"
            [totalPages]="totalPages"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </div>
      </div>
    </div>
  `,
})
export class MyListingsComponent implements OnInit, OnDestroy {
  @Input() userId: string | null = null;

  allListings: Listing[] = [];
  filteredListings: Listing[] = [];
  isLoading = false;
  isInitialLoad = true;
  errorMessage = '';
  showRetryButton = true;
  activeFilter: ListingFilter = 'all';
  searchQuery = '';
  currentTimestamp = new Date().toISOString();
  currentUsername = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  totalCount: number = 0;

  private subscription = new Subscription();
  private listingService = inject(ListingService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  ngOnInit() {
    this.initializeComponent();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private initializeComponent() {
    if (!this.userId) {
      const user = this.authService.getCurrentUser();
      this.userId = user?.id || null;
      this.currentUsername = user?.username || '';
    }

    if (!this.userId) {
      this.errorMessage = 'User not authenticated';
      this.showRetryButton = false;
      return;
    }

    this.loadListings();
  }

  loadListings() {
    this.isLoading = true;
    this.errorMessage = '';

    this.subscription.add(
      this.listingService.getUserListings(this.userId!, this.currentPage, this.itemsPerPage).subscribe({
        next: (response) => {
          this.allListings = response.data || [];
          this.totalPages = response.totalPages || 1;
          this.totalCount = response.totalCount || 0;
          this.applyFilters();
          this.isLoading = false;
          this.isInitialLoad = false;
        },
        error: (error) => {
          console.error('Error loading listings:', error);
          this.handleError(error);
          this.isLoading = false;
          this.isInitialLoad = false;
        }
      })
    );
  }

  private applyFilters() {
    this.filteredListings = ListingUtils.filterListings(
      this.allListings,
      this.activeFilter,
      this.searchQuery
    );
  }

  onFilterChange(filter: ListingFilter) {
    this.activeFilter = filter;
    this.currentPage = 1; // Reset to first page when filtering
    this.applyFilters();
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
  }

  onSearch() {
    this.currentPage = 1; // Reset to first page when searching
    this.applyFilters();
  }

  onViewListing(listingId: string) {
    this.router.navigate(['/item', listingId]);
  }

  onEditListing(listingId: string) {
    this.router.navigate(['/edit-item', listingId]);
  }

  onDeleteListing(listingId: string) {
    this.listingService.deleteListing(listingId, this.userId!).subscribe({
      next: (response) => {
        this.allListings = this.allListings.filter(l => l.id !== listingId);
        this.applyFilters();
        this.toastr.success('Post deleted successfully!', 'Success');
      },
      error: (error) => {
        console.error('Error deleting listing:', error);
        const errorMessage = error.error?.message || 'Failed to delete post. Please try again.';
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }

  createNewListing(type: 'lost' | 'found') {
    this.router.navigate(['/report', type]);
  }

  onErrorRetry() {
    this.loadListings();
  }

  onErrorDismiss() {
    this.authService.logout();
    this.router.navigate(['/auth/sign-in']);
  }

  onEmptyStateAction() {
    this.createNewListing('lost');
  }

  onEmptyStateSecondaryAction() {
    this.createNewListing('found');
  }

  private handleError(error: any) {
    if (error.status === 401) {
      this.errorMessage = 'Authentication required. Please log in again.';
      this.showRetryButton = false;
    } else if (error.status === 403) {
      this.errorMessage = 'You do not have permission to view these listings.';
      this.showRetryButton = false;
    } else if (error.status === 404) {
      this.errorMessage = 'No listings found for this user.';
      this.showRetryButton = true;
    } else {
      this.errorMessage = 'Failed to load listings. Please try again.';
      this.showRetryButton = true;
    }
  }

  getLoadingText(): string {
    return 'Loading your listings...';
  }

  getErrorTitle(): string {
    if (this.errorMessage.includes('Authentication')) {
      return 'Authentication Required';
    }
    if (this.errorMessage.includes('permission')) {
      return 'Access Denied';
    }
    if (this.errorMessage.includes('not found')) {
      return 'No Listings Found';
    }
    return 'Error Loading Listings';
  }

  getErrorVariant(): 'danger' | 'warning' | 'info' {
    if (this.errorMessage.includes('Authentication') || this.errorMessage.includes('permission')) {
      return 'warning';
    }
    return 'danger';
  }

  getRetryButtonText(): string {
    return 'Try Again';
  }

  getEmptyStateTitle(): string {
    if (this.searchQuery) {
      return 'No Matching Listings';
    }
    return 'No Listings Yet';
  }

  getEmptyStateMessage(): string {
    if (this.searchQuery) {
      return `No listings found matching "${this.searchQuery}"`;
    }
    return 'You haven\'t created any listings yet. Start by reporting a lost or found item.';
  }

  getEmptyStateVariant(): EmptyStateVariant {
    if (this.searchQuery) {
      return 'info';
    }
    return 'empty';
  }

  shouldShowActionButton(): boolean {
    return !this.searchQuery;
  }

  getActionButtonText(): string {
    return 'Report Lost Item';
  }

  shouldShowSecondaryButton(): boolean {
    return !this.searchQuery;
  }

  getSecondaryButtonText(): string {
    return 'Report Found Item';
  }

  get visibleListings(): Listing[] {
    return this.filteredListings;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadListings();
  }

  hasMoreListings(): boolean {
    // Implement pagination logic if needed
    return false;
  }

  loadMoreListings() {
    // Implement load more functionality if needed
  }

  getLastUpdatedTime(): string {
    if (this.allListings.length === 0) {
      return 'Never';
    }
    
    const latestListing = this.allListings.reduce((latest, current) => {
      return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
    });
    
    const date = new Date(latestListing.updatedAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }
}