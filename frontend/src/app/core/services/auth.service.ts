// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  joinDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private router = inject(Router);

  constructor() {
    if (this.isBrowser) {
      this.loadUserFromStorage();
    }
  }

  login(token: string, user: User): void {
    if (this.isBrowser) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
    this.router.navigate(['/home']);
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  getUser(): User | null {
    return this.userSubject.getValue();
  }

  getCurrentUser(): User | null {
    return this.userSubject.getValue();
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  private loadUserFromStorage(): void {
    if (this.isBrowser) {
      const token = localStorage.getItem('accessToken');
      const userJson = localStorage.getItem('user');
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson) as User;
          this.userSubject.next(user);
        } catch {
          this.logout();
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        this.userSubject.next(null);
      }
    }
  }
}