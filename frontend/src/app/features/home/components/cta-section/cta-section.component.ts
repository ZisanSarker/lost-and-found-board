import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-cta-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      class="w-full max-w-7xl mx-auto rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div class="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
        <div class="grid-responsive grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div class="space-y-4 sm:space-y-6 lg:space-y-8">
            <h2 id="cta-heading" class="text-responsive-xl font-bold leading-tight">
              {{ authService.isLoggedIn() ? 'Welcome to the Community!' : 'Join Our Community' }}
            </h2>
            <p class="text-responsive-base text-orange-100 leading-relaxed">
              {{ authService.isLoggedIn() 
                ? 'Start posting lost or found items to help reunite people with their belongings.'
                : 'Help reunite people with their lost belongings and make a positive impact in your community. Together, we can turn lost moments into found connections.' 
              }}
            </p>
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                *ngIf="!authService.isLoggedIn()"
                (click)="signUp()"
                class="btn-responsive-lg bg-white text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Sign Up Now
              </button>
              
              <div *ngIf="authService.isLoggedIn()" class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  (click)="postLostItem()"
                  class="btn-responsive-lg bg-white text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <span class="hidden sm:inline">Post Lost Item</span>
                  <span class="sm:hidden">Lost Item</span>
                </button>
                <button
                  (click)="postFoundItem()"
                  class="btn-responsive-lg border border-white text-white hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  <span class="hidden sm:inline">Post Found Item</span>
                  <span class="sm:hidden">Found Item</span>
                </button>
              </div>
              
              <button
                (click)="showLearnMore()"
                class="btn-responsive-lg border border-white text-white hover:bg-white/10 transition-all duration-300 font-semibold"
              >
                Learn More
              </button>
            </div>
          </div>
          <div class="relative order-first lg:order-last">
            <div class="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src="/assets/cta_cover.jpg"
                alt="Illustration showing community members helping each other find lost items"
                class="img-responsive hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <!-- Image overlay for better text readability -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Learn More Modal -->
    <div 
      *ngIf="showModal()"
      class="modal-responsive"
      (click)="closeModal()"
    >
      <div class="flex items-center justify-center min-h-screen p-4">
        <div 
          class="modal-content-responsive animate-scale-in max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <div class="p-4 sm:p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h3 class="text-xl sm:text-2xl font-bold text-gray-800">About Lost & Found Board</h3>
              <button 
                (click)="closeModal()"
                (keyup.enter)="closeModal()"
                (keyup.space)="closeModal()"
                class="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1 hover:bg-gray-100 rounded-full transition-colors"
                tabindex="0"
              >
                ×
              </button>
            </div>
          </div>
          
          <div class="p-4 sm:p-6 space-y-4 sm:space-y-6 text-gray-700">
            <div>
              <h4 class="text-base sm:text-lg font-semibold text-orange-600 mb-2">What is Lost & Found Board?</h4>
              <p class="text-sm sm:text-base leading-relaxed">
                Lost & Found Board is a community-driven platform that connects people who have lost items 
                with those who have found them. Our mission is to reunite belongings with their rightful 
                owners through the power of community cooperation.
              </p>
            </div>

            <div>
              <h4 class="text-base sm:text-lg font-semibold text-orange-600 mb-2">How It Works</h4>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <span class="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                  <p class="text-sm sm:text-base"><strong>Post:</strong> Create a listing for items you've lost or found with detailed descriptions and photos.</p>
                </div>
                <div class="flex items-start gap-3">
                  <span class="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                  <p class="text-sm sm:text-base"><strong>Search:</strong> Browse through listings to find your lost items or help others find theirs.</p>
                </div>
                <div class="flex items-start gap-3">
                  <span class="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                  <p class="text-sm sm:text-base"><strong>Connect:</strong> Contact the person who found your item or vice versa to arrange a safe return.</p>
                </div>
                <div class="flex items-start gap-3">
                  <span class="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                  <p class="text-sm sm:text-base"><strong>Reunite:</strong> Celebrate as belongings are returned to their rightful owners!</p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-base sm:text-lg font-semibold text-orange-600 mb-2">Key Features</h4>
              <ul class="space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span class="text-sm sm:text-base">Easy-to-use posting system for lost and found items</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span class="text-sm sm:text-base">Photo uploads to help identify items</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span class="text-sm sm:text-base">Location-based search to find items near you</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span class="text-sm sm:text-base">Secure messaging system for safe communication</span>
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span class="text-sm sm:text-base">Community-driven approach with verified users</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 class="text-base sm:text-lg font-semibold text-orange-600 mb-2">Why Join Our Community?</h4>
              <p class="text-sm sm:text-base leading-relaxed">
                By joining Lost & Found Board, you become part of a caring community dedicated to helping 
                others. Whether you've lost something precious or found an item that belongs to someone else, 
                our platform makes it easy to do the right thing and make someone's day brighter.
              </p>
            </div>

            <div class="bg-orange-50 p-4 rounded-lg">
              <p class="text-orange-800 font-medium text-center text-sm sm:text-base">
                Ready to make a difference? Sign up today and help build a more connected community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CtaSectionComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  showModal = signal(false);

  signUp() {
    this.router.navigate(['/auth/sign-up']);
  }

  postLostItem() {
    this.router.navigate(['/repost/lost']);
  }

  postFoundItem() {
    this.router.navigate(['/repost/found']);
  }

  showLearnMore() {
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }
}