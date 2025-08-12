import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div class="container-responsive-md py-6 sm:py-8 lg:py-12">
        <div class="max-w-content bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 border border-orange-100 hover:border-orange-200 transform hover:-translate-y-1">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-orange-600 hover:text-orange-700 transition-colors duration-200">Privacy Policy</h1>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">1. Information We Collect</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, post items, or contact other users. This may include your name, email address, phone number, and any other information you choose to provide.
            </p>
          </div>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">2. How We Use Your Information</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to ensure the safety and security of our platform.
            </p>
          </div>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">3. Information Sharing</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
            </p>
          </div>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">4. Data Security</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">5. Your Rights</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              You have the right to access, update, or delete your personal information. You can also opt out of certain communications and request information about how we use your data.
            </p>
          </div>

          <div class="pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-500 hover:text-gray-600 transition-colors duration-200">
            Last updated: May 2025
          </div>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}