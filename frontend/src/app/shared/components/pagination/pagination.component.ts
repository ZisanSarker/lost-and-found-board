import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center space-x-2 mt-6 sm:mt-8" *ngIf="totalPages > 1">
      <!-- Previous Button -->
      <button
        (click)="onPageChange(currentPage - 1)"
        [disabled]="currentPage === 1"
        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page Numbers -->
      <div class="flex space-x-1">
        <!-- First Page -->
        <button
          *ngIf="showFirstPage"
          (click)="onPageChange(1)"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          1
        </button>

        <!-- Ellipsis after first page -->
        <span
          *ngIf="showFirstEllipsis"
          class="px-3 py-2 text-sm text-gray-500"
        >
          ...
        </span>

        <!-- Page Numbers -->
        <button
          *ngFor="let page of visiblePages"
          (click)="onPageChange(page)"
          [class]="page === currentPage 
            ? 'px-3 py-2 text-sm font-medium text-white bg-orange-500 border border-orange-500 rounded-md' 
            : 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'"
        >
          {{ page }}
        </button>

        <!-- Ellipsis before last page -->
        <span
          *ngIf="showLastEllipsis"
          class="px-3 py-2 text-sm text-gray-500"
        >
          ...
        </span>

        <!-- Last Page -->
        <button
          *ngIf="showLastPage"
          (click)="onPageChange(totalPages)"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- Next Button -->
      <button
        (click)="onPageChange(currentPage + 1)"
        [disabled]="currentPage === totalPages"
        class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  `,
  styles: []
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() maxVisiblePages = 5;
  @Output() pageChange = new EventEmitter<number>();

  get showFirstPage(): boolean {
    return this.currentPage > 3;
  }

  get showLastPage(): boolean {
    return this.currentPage < this.totalPages - 2;
  }

  get showFirstEllipsis(): boolean {
    return this.currentPage > 4;
  }

  get showLastEllipsis(): boolean {
    return this.currentPage < this.totalPages - 3;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2));
    const end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
