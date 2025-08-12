import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  template: `
    <header class="w-full bg-orange-100 shadow-md">
      <div class="container-responsive">
        <div class="flex-responsive-between py-3 sm:py-4">
          <!-- Logo -->
          <div class="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 cursor-pointer transition-colors hover:text-orange-700" 
               (click)="navigateHome()">
            Lost & Found
          </div>
          
          <!-- Desktop Navigation Links -->
          <nav class="hidden md:flex items-center space-x-4 lg:space-x-6 text-gray-800 font-medium">
            <a routerLink="/home" routerLinkActive="text-orange-600" 
               class="hover:text-orange-500 transition-colors duration-200 text-sm lg:text-base">Home</a>
            <ng-container *ngIf="user$ | async">
              <a routerLink="/dashboard" routerLinkActive="text-orange-600" 
                 class="hover:text-orange-500 transition-colors duration-200 text-sm lg:text-base">Dashboard</a>
              <a routerLink="/items" routerLinkActive="text-orange-600" 
                 class="hover:text-orange-500 transition-colors duration-200 text-sm lg:text-base">All Posts</a>
            </ng-container>
          </nav>
          
          <!-- Auth Buttons & User Menu -->
          <div class="flex items-center space-x-2 sm:space-x-3">
            <ng-container *ngIf="(user$ | async) as user; else guestTemplate">
              <!-- Desktop User Menu -->
              <div class="hidden md:block relative">
                <button 
                  (click)="toggleDropdown()"
                  class="flex items-center gap-2 p-2 rounded-full hover:bg-orange-200 transition-colors duration-200"
                >
                  <!-- User Avatar -->
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-orange-300">
                    <img 
                      *ngIf="user.avatar; else avatarFallback"
                      [src]="user.avatar" 
                      [alt]="user.username || user.name || 'User'"
                      class="w-full h-full object-cover"
                    />
                    <ng-template #avatarFallback>
                      <svg class="w-full h-full bg-orange-200 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </ng-template>
                  </div>
                  <!-- Dropdown Arrow -->
                  <svg 
                    class="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 transition-transform duration-200"
                    [class.rotate-180]="isDropdownOpen()"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Desktop Dropdown Menu -->
                <div 
                  *ngIf="isDropdownOpen()"
                  class="dropdown-responsive"
                >
                  <!-- User Info -->
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ user.username || user.name || 'User' }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                  </div>
                  
                  <!-- Menu Items -->
                  <a 
                    routerLink="/profile" 
                    (click)="closeDropdown()"
                    class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </a>
                  
                  <a 
                    routerLink="/help-support" 
                    (click)="closeDropdown()"
                    class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Help & Support</span>
                  </a>
                  
                  <button 
                    (click)="showLogoutConfirmation()"
                    class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
              
              <!-- Mobile User Avatar -->
              <div class="md:hidden">
                <button 
                  (click)="toggleMobileMenu()"
                  class="flex items-center gap-2 p-2 rounded-full hover:bg-orange-200 transition-colors duration-200"
                >
                  <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-300">
                    <img 
                      *ngIf="user.avatar; else mobileAvatarFallback"
                      [src]="user.avatar" 
                      [alt]="user.username || user.name || 'User'"
                      class="w-full h-full object-cover"
                    />
                    <ng-template #mobileAvatarFallback>
                      <svg class="w-full h-full bg-orange-200 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </ng-template>
                  </div>
                  <svg 
                    class="w-4 h-4 text-gray-600 transition-transform duration-200"
                    [class.rotate-180]="isMobileMenuOpen()"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </ng-container>
            
            <ng-template #guestTemplate>
              <!-- Guest User Buttons -->
              <div class="flex items-center space-x-2 sm:space-x-3">
                <a 
                  routerLink="/auth/sign-in" 
                  routerLinkActive="bg-orange-700"
                  class="btn-responsive-sm bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                >
                  <span class="hidden sm:inline">Sign In</span>
                  <span class="sm:hidden">Login</span>
                </a>
                <a 
                  routerLink="/auth/sign-up" 
                  routerLinkActive="bg-orange-50 border-orange-700"
                  class="btn-responsive-sm border border-orange-600 text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  <span class="hidden sm:inline">Sign Up</span>
                  <span class="sm:hidden">Join</span>
                </a>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div 
        *ngIf="isMobileMenuOpen()"
        class="md:hidden bg-white border-t border-orange-200 shadow-lg animate-slide-down"
      >
        <div class="container-responsive py-4">
          <nav class="space-y-3">
            <a 
              routerLink="/home" 
              routerLinkActive="bg-orange-50 text-orange-600"
              (click)="closeMobileMenu()"
              class="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
            >
              Home
            </a>
            <ng-container *ngIf="user$ | async">
              <a 
                routerLink="/dashboard" 
                routerLinkActive="bg-orange-50 text-orange-600"
                (click)="closeMobileMenu()"
                class="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                Dashboard
              </a>
              <a 
                routerLink="/items" 
                routerLinkActive="bg-orange-50 text-orange-600"
                (click)="closeMobileMenu()"
                class="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                All Posts
              </a>
              <a 
                routerLink="/profile" 
                (click)="closeMobileMenu()"
                class="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                Profile
              </a>
              <a 
                routerLink="/help-support" 
                (click)="closeMobileMenu()"
                class="block px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                Help & Support
              </a>
              <button 
                (click)="showLogoutConfirmation(); closeMobileMenu()"
                class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </ng-container>
          </nav>
        </div>
      </div>
    </header>

    <!-- Logout Confirmation Modal -->
    <div 
      *ngIf="showLogoutModal()"
      class="modal-responsive"
      (click)="cancelLogout()"
    >
      <div class="flex items-center justify-center min-h-screen p-4">
        <div 
          class="modal-content-responsive animate-scale-in"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Confirm Logout</h3>
              <p class="text-sm text-gray-600 mt-1">Are you sure you want to log out of your account?</p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <button 
              (click)="cancelLogout()"
              class="btn-responsive-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              (click)="confirmLogout()"
              class="btn-responsive-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HeaderComponent {
  private authService = inject(AuthService);
  user$: Observable<any | null> = this.authService.user$;
  
  isDropdownOpen = signal(false);
  isMobileMenuOpen = signal(false);
  showLogoutModal = signal(false);

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.relative');
    if (!dropdown && this.isDropdownOpen()) {
      this.closeDropdown();
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  showLogoutConfirmation(): void {
    this.closeDropdown();
    this.closeMobileMenu();
    this.showLogoutModal.set(true);
  }

  cancelLogout(): void {
    this.showLogoutModal.set(false);
  }

  confirmLogout(): void {
    this.showLogoutModal.set(false);
    this.authService.logout();
  }

  navigateHome(): void {
    window.location.href = '/';
  }
}