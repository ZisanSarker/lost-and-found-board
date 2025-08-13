// item-grid.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from '../item-card/item-card.component';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-grid',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  template: `
    <!-- Loading state -->
    <div *ngIf="loading" class="grid-responsive grid-cols-responsive-sm">
      <div *ngFor="let i of [1,2,3,4,5,6]" class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="h-32 sm:h-40 md:h-48 bg-orange-100"></div>
        <div class="p-3 sm:p-4">
          <div class="h-4 bg-orange-100 rounded mb-2"></div>
          <div class="h-3 bg-orange-100 rounded mb-2"></div>
          <div class="h-3 bg-orange-100 rounded mb-3 sm:mb-4"></div>
          <div class="flex gap-2">
            <div class="flex-1 h-6 sm:h-8 bg-orange-100 rounded"></div>
            <div class="flex-1 h-6 sm:h-8 bg-orange-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div *ngIf="!loading && items.length === 0" class="text-center py-8 sm:py-12 lg:py-16">
      <div class="max-w-md mx-auto">
        <div class="text-4xl sm:text-6xl mb-4">🔍</div>
        <h3 class="text-lg sm:text-xl font-semibold text-gray-600 mb-2 sm:mb-3">{{ emptyMessage }}</h3>
        <p class="text-sm sm:text-base text-gray-500">Try adjusting your search criteria</p>
        
        <!-- Empty state actions for larger screens -->
        <div class="hidden sm:flex justify-center gap-3 mt-6">
          <button class="btn-responsive-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors">
            Clear Filters
          </button>
          <button class="btn-responsive-sm border border-orange-500 text-orange-600 hover:bg-orange-50 transition-colors">
            Browse All
          </button>
        </div>
      </div>
    </div>

    <!-- Items grid -->
    <div *ngIf="!loading && items.length > 0" class="grid-responsive grid-cols-responsive-sm">
      <app-item-card
        *ngFor="let item of items; trackBy: trackByItemId"
        [id]="item.id"
        [title]="item.title"
        [description]="item.description"
        [location]="item.location"
        [date]="item.date"
        [type]="item.type"
        [image]="item.image"
      ></app-item-card>
    </div>

    <!-- Results count for larger screens -->
    <div *ngIf="!loading && items.length > 0" class="hidden lg:block mt-6 text-center">
      <p class="text-sm text-gray-500">
        Showing {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
      </p>
    </div>
  `
})
export class ItemGridComponent {
  @Input() items: Item[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No items found';

  trackByItemId(index: number, item: Item): string {
    return item.id;
  }
}