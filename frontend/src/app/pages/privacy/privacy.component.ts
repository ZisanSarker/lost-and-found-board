import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div class="container-responsive py-6 sm:py-8 lg:py-12">
        <div class="max-w-4xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 border border-orange-100 hover:border-orange-200 transform hover:-translate-y-1">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-orange-600 hover:text-orange-700 transition-colors duration-200">Privacy Policy</h1>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">1. Information We Collect</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              We collect personal details such as name, email, and phone number when users post a lost or found item. This information is used solely to help users reconnect with their belongings.
            </p>
          </div>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">2. Public Visibility</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              Any contact information you provide will be publicly displayed on your posts. Please do not share sensitive personal data unless you are comfortable making it public.
            </p>
          </div>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">3. How We Use Your Data</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              We use the information to facilitate communication between users and to enhance your experience on the platform. Your data is not sold or shared with third-party advertisers.
            </p>
          </div>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">4. Data Security</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              We implement basic security measures to protect your data. However, we cannot guarantee full security over data transmitted online.
            </p>
          </div>

          <div class="space-y-4 p-3 sm:p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 hover:shadow-sm">
            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200">5. Future Features and Tracking</h2>
            <p class="text-sm sm:text-base hover:text-gray-900 transition-colors duration-200 leading-relaxed">
              In future updates (such as in-app chat and maps), minimal data may be used to improve functionality. We will update this policy accordingly when those features are released.
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