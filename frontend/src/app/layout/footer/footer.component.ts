import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer class="w-full border-t bg-orange-100 text-orange-900">
      <div class="container-responsive py-4 sm:py-6 lg:py-8">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
          <!-- Logo and Description -->
          <div class="text-center lg:text-left">
            <div class="text-xl sm:text-2xl font-bold text-orange-600 mb-1">Lost & Found</div>
            <p class="text-sm sm:text-base text-orange-700 max-w-md">
              Helping communities reunite with their lost belongings through the power of connection.
            </p>
          </div>

          <!-- Navigation Links -->
          <nav class="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-sm sm:text-base font-medium">
            <a routerLink="/terms" class="hover:text-orange-600 transition-colors duration-200 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Terms
            </a>
            <a routerLink="/privacy" class="hover:text-orange-600 transition-colors duration-200 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Privacy
            </a>
            <a routerLink="/contact-us" class="hover:text-orange-600 transition-colors duration-200 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact
            </a>
            <a routerLink="/help-support" class="hover:text-orange-600 transition-colors duration-200 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </a>
          </nav>
        </div>

        <!-- Bottom Section - Centered Copyright -->
        <div class="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-orange-200">
          <div class="text-center text-xs sm:text-sm text-orange-600">
            <p>© 2025 Lost & Found Board. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
