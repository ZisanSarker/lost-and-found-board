import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

/**
 * User Interface
 * Defines the structure of user data
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt?: string;
}

/**
 * Authentication Service
 * Handles user authentication, token management, and user state
 * Uses Angular 21 signals for reactive state management
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Dependencies
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // State management with signals
  private readonly userSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);

  // Public computed signals
  public readonly user = this.userSignal.asReadonly();
  public readonly isAuthenticated = computed(() => this.userSignal() !== null);

  // Storage keys
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly USER_KEY = 'user';

  constructor() {
    this.loadAuthState();
  }

  /**
   * Login user and save authentication state
   * @param token - JWT access token
   * @param user - User data
   */
  login(token: string, user: User): void {
    this.tokenSignal.set(token);
    this.userSignal.set(user);
    this.saveAuthState(token, user);
    this.router.navigate(['/home']);
  }

  /**
   * Logout user and clear authentication state
   */
  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.clearAuthState();
    this.router.navigate(['/auth/sign-in']);
  }

  /**
   * Get access token
   * @returns Access token or null
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Get current user
   * @returns User object or null
   */
  getUser(): User | null {
    return this.userSignal();
  }

  /**
   * Update user profile
   * @param user - Updated user data
   */
  updateUserProfile(user: User): void {
    this.userSignal.set(user);
    this.saveUserData(user);
  }

  /**
   * Check if user is logged in (backward compatibility)
   * @returns True if user is authenticated, false otherwise
   * @deprecated Use isAuthenticated signal instead
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get current user (backward compatibility)
   * @returns User object or null
   * @deprecated Use getUser() instead
   */
  getCurrentUser(): User | null {
    return this.getUser();
  }

  /**
   * Load authentication state from storage
   * @private
   */
  private loadAuthState(): void {
    if (!this.isBrowser) return;

    try {
      const token = this.getFromStorage(this.ACCESS_TOKEN_KEY);
      const userJson = this.getFromStorage(this.USER_KEY);

      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        this.tokenSignal.set(token);
        this.userSignal.set(user);
      } else {
        this.clearAuthState();
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      this.clearAuthState();
    }
  }

  /**
   * Save authentication state to storage
   * @private
   */
  private saveAuthState(token: string, user: User): void {
    if (!this.isBrowser) return;

    try {
      this.saveToStorage(this.ACCESS_TOKEN_KEY, token);
      this.saveUserData(user);
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }

  /**
   * Save user data to storage
   * @private
   */
  private saveUserData(user: User): void {
    if (!this.isBrowser) return;

    try {
      this.saveToStorage(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  /**
   * Clear authentication state from storage
   * @private
   */
  private clearAuthState(): void {
    if (!this.isBrowser) return;

    this.removeFromStorage(this.ACCESS_TOKEN_KEY);
    this.removeFromStorage(this.USER_KEY);
  }

  /**
   * Get item from localStorage
   * @private
   */
  private getFromStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Save item to localStorage
   * @private
   */
  private saveToStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Remove item from localStorage
   * @private
   */
  private removeFromStorage(key: string): void {
    localStorage.removeItem(key);
  }
}