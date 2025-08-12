import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mb-4 sm:mb-6">
      <label class="block text-sm sm:text-base font-semibold text-orange-800 mb-2 sm:mb-3">
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>
      <div class="relative">
        <input
          [type]="type"
          [formControl]="control"
          [placeholder]="placeholder"
          [required]="required"
          class="input-responsive w-full focus:ring-orange-500 focus:border-orange-500"
          [class.pr-10]="hasIcon"
        />
        <div *ngIf="hasIcon" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <ng-container [ngSwitch]="iconType">
              <path *ngSwitchCase="'email'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              <path *ngSwitchCase="'phone'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              <path *ngSwitchCase="'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              <path *ngSwitchCase="'lock'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              <path *ngSwitchCase="'search'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              <path *ngSwitchDefault="'text'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </ng-container>
          </svg>
        </div>
      </div>
      
      <!-- Error Message -->
      <div
        *ngIf="control?.touched && control?.invalid"
        class="mt-2 flex items-start gap-2 text-sm text-red-600 animate-slide-down"
      >
        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
      
      <!-- Help Text -->
      <p *ngIf="helpText" class="mt-2 text-xs sm:text-sm text-gray-500">
        {{ helpText }}
      </p>
    </div>
  `,
})
export class FormInputComponent {
  @Input() label: string = '';
  @Input() control!: FormControl;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() errorMessage: string = '';
  @Input() required: boolean = false;
  @Input() helpText: string = '';
  @Input() iconType: 'email' | 'phone' | 'user' | 'lock' | 'search' | 'text' = 'text';

  get hasIcon(): boolean {
    return this.iconType !== 'text';
  }
}
