import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmationModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  icon?: string;
}

@Component({
  selector: 'app-confirmation-modal',
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
        class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4"
        (click)="$event.stopPropagation()"
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div 
                *ngIf="data?.icon"
                class="w-10 h-10 rounded-full flex items-center justify-center"
                [class]="data?.icon === 'warning' ? 'bg-red-100' : 'bg-orange-100'"
              >
                <svg 
                  *ngIf="data?.icon === 'warning'"
                  class="w-6 h-6 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.186-.833-2.956 0L3.858 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <svg 
                  *ngIf="data?.icon === 'info'"
                  class="w-6 h-6 text-orange-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">{{ data?.title || 'Confirm Action' }}</h3>
            </div>
            <button 
              (click)="onCancel()"
              (keyup.enter)="onCancel()"
              (keyup.space)="onCancel()"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="px-6 py-4">
          <p class="text-gray-700 leading-relaxed">{{ data?.message || 'Are you sure you want to proceed?' }}</p>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row gap-3 justify-end">
          <button
            (click)="onCancel()"
            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 font-medium"
            [class]="data?.cancelButtonClass || ''"
          >
            {{ data?.cancelText || 'Cancel' }}
          </button>
          <button
            (click)="onConfirm()"
            class="px-4 py-2 text-white rounded-md transition-colors duration-200 font-medium"
            [class]="data?.confirmButtonClass || 'bg-red-600 hover:bg-red-700'"
          >
            {{ data?.confirmText || 'Confirm' }}
          </button>
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
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() data: ConfirmationModalData | null = null;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() modalClosed = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.modalClosed.emit();
    }
  }
}
