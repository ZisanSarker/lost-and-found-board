import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';

const baseUrl = environment.apiBaseUrl;

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormInputComponent,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-form">
        <!-- Back to Home Link -->
        <div class="text-center mb-6 sm:mb-8">
          <a 
            routerLink="/home"
            class="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200 text-sm sm:text-base"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>

        <!-- Sign In Form -->
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8"
        >
          <!-- Header -->
          <div class="text-center">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-2 sm:mb-3">
              Welcome Back
            </h2>
            <p class="text-sm sm:text-base text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4 sm:space-y-6">
            <app-form-input
              label="Email Address"
              [control]="email"
              type="email"
              placeholder="Enter your email"
              errorMessage="Please enter a valid email address."
              [required]="true"
              iconType="email"
            />

            <!-- Password Field with Show/Hide Toggle -->
            <div class="space-y-2">
              <label for="password" class="block text-sm sm:text-base font-semibold text-orange-800">
                Password <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  [formControl]="password"
                  placeholder="Enter your password"
                  required
                  class="input-responsive w-full pr-12 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-orange-400 hover:text-orange-600 transition-colors"
                  [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                >
                  <svg *ngIf="!showPassword" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword" class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                </button>
              </div>
              <!-- Error Message -->
              <div
                *ngIf="password.touched && password.invalid"
                class="flex items-start gap-2 text-sm text-red-600"
              >
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Password is required.</span>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="form.invalid || isLoading"
            class="w-full btn-responsive-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg *ngIf="isLoading" class="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
          </button>

          <!-- Divider -->
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center">
            <p class="text-sm sm:text-base text-gray-600">
              Don't have an account?
              <a
                routerLink="/auth/sign-up"
                class="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
              >
                Create one now
              </a>
            </p>
          </div>

          <!-- Additional Links -->
          <div class="text-center space-y-2">
            <a 
              href="#" 
              class="block text-xs sm:text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200"
            >
              Forgot your password?
            </a>
            <a 
              routerLink="/help-support" 
              class="block text-xs sm:text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200"
            >
              Need help signing in?
            </a>
          </div>
        </form>

        <!-- Footer -->
        <div class="text-center mt-6 sm:mt-8">
          <p class="text-xs sm:text-sm text-gray-500">
            By signing in, you agree to our 
            <a routerLink="/terms" class="text-orange-600 hover:text-orange-700">Terms of Service</a> 
            and 
            <a routerLink="/privacy" class="text-orange-600 hover:text-orange-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class SignInComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  showPassword = false;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private authService = inject(AuthService);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      const formData = this.form.value;

      this.http.post(`${baseUrl}/api/auth/login`, formData).subscribe({
        next: (response: {
          success?: boolean;
          message?: string;
          data?: { accessToken?: string; user?: unknown }
        }) => {
          this.isLoading = false;
          if (response.data?.accessToken && response.data?.user) {
            this.authService.login(
              response.data.accessToken,
              response.data.user as { id: string; username: string; email: string }
            );
            this.toast.success('Successfully signed in!', 'Welcome back!');
            this.router.navigate(['/dashboard']);
          } else {
            this.toast.error(response.message || 'Sign in failed', 'Error');
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.toast.error(
            error.error?.message || 'Sign in failed. Please try again.',
            'Error'
          );
        }
      });
    }
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
