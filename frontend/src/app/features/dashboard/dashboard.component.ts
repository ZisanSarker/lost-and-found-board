// dashboard.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {
  DataService,
  Listing,
  Message,
  Notification,
} from '../../shared/services/data.service';
import { AuthService } from '../../core/services/auth.service';

import { ProfileSidebarComponent } from '../../shared/components/profile-sidebar/profile-sidebar.component';
import { NotificationSidebarComponent } from '../../shared/components/notification-sidebar/notification-sidebar.component';
import { MyListingsComponent } from '../my-listings/my-listings.component';
import { DashboardHeaderComponent } from '../../shared/components/dashboard-header/dashboard-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ProfileSidebarComponent,
    NotificationSidebarComponent,
    MyListingsComponent,
    DashboardHeaderComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div class="container-responsive-lg py-6 sm:py-8 lg:py-12">
        <!-- Page Header -->
        <app-dashboard-header
          (reportLostItem)="onReportLostItem()"
          (reportFoundItem)="onReportFoundItem()"
        />

        <!-- Mobile Navigation Toggle -->
        <div class="lg:hidden mb-6">
          <button
            (click)="toggleMobileSidebar()"
            class="w-full btn-responsive bg-white text-orange-700 border border-orange-200 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>{{ showMobileSidebar ? 'Hide' : 'Show' }} Dashboard Menu</span>
          </button>
        </div>

        <!-- Mobile Sidebar Overlay -->
        <div 
          *ngIf="showMobileSidebar" 
          class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          (click)="closeMobileSidebar()"
        ></div>

        <!-- Mobile Sidebar -->
        <div 
          *ngIf="showMobileSidebar"
          class="lg:hidden fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
        >
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Dashboard Menu</h3>
              <button 
                (click)="closeMobileSidebar()"
                class="text-gray-500 hover:text-gray-700"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4 space-y-4 overflow-y-auto h-full">
            <app-profile-sidebar/>
            <app-notification-sidebar
              [activeTab]="activeTab"
              [unreadMessagesCount]="getUnreadMessagesCount()"
              [unreadNotificationsCount]="getUnreadNotificationsCount()"
              (tabChange)="setActiveTab($event)"
            />
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <!-- Desktop Sidebar -->
          <div class="hidden lg:block lg:col-span-1">
            <div class="space-y-6">
              <app-profile-sidebar/>
              <app-notification-sidebar
                [activeTab]="activeTab"
                [unreadMessagesCount]="getUnreadMessagesCount()"
                [unreadNotificationsCount]="getUnreadNotificationsCount()"
                (tabChange)="setActiveTab($event)"
              />
            </div>
          </div>

          <!-- Main Content Area -->
          <div class="lg:col-span-3">
            <!-- Loading State -->
            <div
              *ngIf="isLoading"
              class="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm"
            >
              <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                <p class="text-sm sm:text-base text-gray-600">Loading your dashboard...</p>
              </div>
            </div>

            <!-- Error State -->
            <div
              *ngIf="errorMessage && !isLoading"
              class="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6"
            >
              <div class="flex items-start">
                <svg
                  class="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div class="flex-1">
                  <p class="text-sm sm:text-base text-red-700 mb-2">{{ errorMessage }}</p>
                  <button
                    (click)="loadData()"
                    class="btn-responsive-sm bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>

            <!-- Content -->
            <ng-container *ngIf="!isLoading && !errorMessage">
              <!-- Only render MyListingsComponent if currentUserId is available -->
              <app-my-listings 
                *ngIf="currentUserId" 
                [userId]="currentUserId">
              </app-my-listings>
              
              <!-- Fallback if no user ID -->
              <div *ngIf="!currentUserId" class="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">User Information Not Available</h3>
                <p class="text-sm sm:text-base text-gray-600 mb-4">
                  Unable to load your user information. Please try refreshing the page.
                </p>
                <button
                  (click)="loadData()"
                  class="btn-responsive bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit, OnDestroy {
  isLoading = true;
  errorMessage = '';
  activeTab = 'notifications';
  currentUserId: string | null = null;
  showMobileSidebar = false;

  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private subscription = new Subscription();

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = '';

    // Get current user ID
    const user = this.authService.getCurrentUser();
    this.currentUserId = user?.id || null;

    if (!this.currentUserId) {
      this.errorMessage = 'User information not available. Please log in again.';
      this.isLoading = false;
      return;
    }

    // Load dashboard data
    this.subscription.add(
      this.dataService.getDashboardData().subscribe({
        next: (data) => {
          this.isLoading = false;
          // Handle dashboard data
        },
        error: (error) => {
          console.error('Dashboard loading error:', error);
          this.errorMessage = 'Failed to load dashboard data. Please try again.';
          this.isLoading = false;
        }
      })
    );
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getUnreadMessagesCount(): number {
    return this.dataService.getUnreadMessagesCount();
  }

  getUnreadNotificationsCount(): number {
    return this.dataService.getUnreadNotificationsCount();
  }

  onReportLostItem() {
    // Navigate to report lost item page
    console.log('Report lost item clicked');
  }

  onReportFoundItem() {
    // Navigate to report found item page
    console.log('Report found item clicked');
  }

  toggleMobileSidebar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  closeMobileSidebar() {
    this.showMobileSidebar = false;
  }
}