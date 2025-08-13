import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="section-padding bg-gradient-to-br from-orange-50 to-orange-100">
      <div class="container-responsive">
        <div class="flex flex-col items-center justify-center gap-6 lg:gap-8 text-center">
          <!-- Header Text -->
          <div class="max-w-4xl mx-auto animate-fade-in">
            <h1 class="text-responsive-2xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent animate-pulse leading-tight">
              Turn Moments of Panic into Stories of Reunion
            </h1>
            <p class="mt-4 sm:mt-6 text-responsive-base text-orange-700 max-w-2xl mx-auto leading-relaxed">
              A community-powered space where you can quickly report lost or discovered items and connect with others.
            </p>
          </div>
          
          <!-- Action Buttons (only if logged in) -->
          <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg mt-4 sm:mt-6 animate-slide-up" *ngIf="isLoggedIn">
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                routerLink="/repost/lost"
                class="btn-responsive-lg bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="hidden sm:inline">Report Lost Item</span>
                <span class="sm:hidden">Lost Item</span>
              </a>
              <a
                routerLink="/repost/found"
                class="btn-responsive-lg border-2 border-orange-600 text-orange-600 hover:text-white hover:bg-orange-600 flex items-center justify-center gap-2 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="hidden sm:inline">Report Found Item</span>
                <span class="sm:hidden">Found Item</span>
              </a>
            </div>
          </div>
          
          <!-- Login Prompt (only if not logged in) -->
          <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg mt-4 sm:mt-6 animate-slide-up" *ngIf="!isLoggedIn">
            <div class="card-responsive-sm bg-white/70 backdrop-blur-sm border border-orange-200 shadow-lg">
              <p class="text-orange-800 mb-4 sm:mb-6 font-medium text-responsive-base">
                Join our community to report lost or found items
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  routerLink="/auth/login"
                  class="btn-responsive bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors duration-300"
                >
                  Sign In
                </a>
                <a
                  routerLink="/auth/register"
                  class="btn-responsive border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold transition-colors duration-300"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
          
          <!-- Image and Decorations -->
          <div class="relative mt-8 sm:mt-10 lg:mt-12 w-full max-w-4xl animate-fade-in animation-delay-500">
            <!-- Decorative Elements -->
            <div class="absolute -top-8 -left-8 sm:-top-10 sm:-left-10 w-16 h-16 sm:w-20 sm:h-20 bg-orange-200 rounded-full opacity-70 animate-bounce-slow"></div>
            <div class="absolute -bottom-8 -right-8 sm:-bottom-10 sm:-right-10 w-12 h-12 sm:w-16 sm:h-16 bg-orange-300 rounded-full opacity-70 animate-bounce-slow animation-delay-1000"></div>
            
            <!-- Main Image -->
            <div class="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/home_cover.png"
                alt="Community reunions"
                class="img-responsive hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              <!-- Image Overlay for better text readability -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <!-- Additional decorative elements for larger screens -->
          </div>
          
          <!-- Stats Section (for larger screens) -->
          <div class="hidden lg:flex items-center justify-center gap-8 xl:gap-12 mt-8 lg:mt-12 animate-fade-in animation-delay-1000">
            <div class="text-center">
              <div class="text-2xl xl:text-3xl font-bold text-orange-600">1000+</div>
              <div class="text-sm xl:text-base text-orange-700">Items Recovered</div>
            </div>
            <div class="w-px h-12 bg-orange-300"></div>
            <div class="text-center">
              <div class="text-2xl xl:text-3xl font-bold text-orange-600">500+</div>
              <div class="text-sm xl:text-base text-orange-700">Happy Users</div>
            </div>
            <div class="w-px h-12 bg-orange-300"></div>
            <div class="text-center">
              <div class="text-2xl xl:text-3xl font-bold text-orange-600">24/7</div>
              <div class="text-sm xl:text-base text-orange-700">Community Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  private authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn();
}