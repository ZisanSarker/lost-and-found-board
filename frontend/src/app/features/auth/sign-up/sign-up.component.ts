import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
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
  selector: 'app-sign-up',
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
      <div class="w-full max-w-sm sm:max-w-md lg:max-w-lg">
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

        <!-- Sign Up Form -->
        <form
          [formGroup]="form"
          (ngSubmit)="onSubmit()"
          class="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8"
        >
          <!-- Header -->
          <div class="text-center">
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 mb-2 sm:mb-3">
              Join Our Community
            </h2>
            <p class="text-sm sm:text-base text-gray-600">
              Create your account to start helping others
            </p>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4 sm:space-y-6">
            <app-form-input
              label="Full Name"
              [control]="username"
              type="text"
              placeholder="Enter your full name"
              errorMessage="Full name is required and must contain only letters."
              [required]="true"
              iconType="user"
            />

            <app-form-input
              label="Email Address"
              [control]="email"
              type="email"
              placeholder="Enter your email"
              errorMessage="Please enter a valid email address."
              [required]="true"
              iconType="email"
            />

            <app-form-input
              label="Password"
              [control]="password"
              type="password"
              placeholder="Create a strong password"
              errorMessage="Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
              [required]="true"
              iconType="lock"
              helpText="Must be at least 8 characters with uppercase, lowercase, number, and special character"
            />

            <app-form-input
              label="Confirm Password"
              [control]="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              errorMessage="Passwords do not match."
              [required]="true"
              iconType="lock"
            />
          </div>

          <!-- Password Requirements -->
          <div class="bg-orange-50 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-orange-800 mb-2">Password Requirements:</h4>
            <ul class="text-xs sm:text-sm text-orange-700 space-y-1">
              <li class="flex items-center gap-2">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                At least 8 characters long
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Include uppercase and lowercase letters
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Include at least one number
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Include at least one special character
              </li>
            </ul>
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
            <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
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

          <!-- Sign In Link -->
          <div class="text-center">
            <p class="text-sm sm:text-base text-gray-600">
              Already have an account?
              <a
                routerLink="/auth/sign-in"
                class="text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div>
        </form>

        <!-- Footer -->
        <div class="text-center mt-6 sm:mt-8">
          <p class="text-xs sm:text-sm text-gray-500">
            By creating an account, you agree to our 
            <a routerLink="/terms" class="text-orange-600 hover:text-orange-700">Terms of Service</a> 
            and 
            <a routerLink="/privacy" class="text-orange-600 hover:text-orange-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class SignUpComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private authService = inject(AuthService);

  constructor() {
    this.form = this.fb.group({
      username: ['', [Validators.required, this.nameValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
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

      this.http.post(`${baseUrl}/auth/register`, formData).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.authService.login(response.data.accessToken, response.data.user);
            this.toast.success('Account created successfully!', 'Welcome!');
            this.router.navigate(['/dashboard']);
          } else {
            this.toast.error(response.message || 'Registration failed', 'Error');
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.toast.error(
            error.error?.message || 'Registration failed. Please try again.',
            'Error'
          );
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  nameValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(value)) {
      return { invalidName: true };
    }
    return null;
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar || !isLongEnough) {
      return { invalidPassword: true };
    }
    return null;
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }
}
