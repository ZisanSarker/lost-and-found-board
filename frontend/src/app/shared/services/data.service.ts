import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

export interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  status: 'active' | 'resolved';
  type: 'lost' | 'found';
  image?: string;
  imageUrl?: string;
  category?: string;
  contactInfo?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: number;
  from: string;
  initial: string;
  message: string;
  time: string;
  itemId: string;
  itemTitle: string;
  unread: boolean;
}

export interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  itemId: string;
  unread: boolean;
}

export interface ApiResponse {
  success: boolean;
  data: any[];
  message?: string;
  count?: number;
}

export interface DashboardData {
  lostItems: Listing[];
  foundItems: Listing[];
  myListings: Listing[];
  messages: Message[];
  notifications: Notification[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getData(): Observable<DashboardData> {
    // For now, return empty data structure since we're using separate services
    return new Observable(observer => {
      observer.next({
        lostItems: [],
        foundItems: [],
        myListings: [],
        messages: [],
        notifications: []
      });
      observer.complete();
    });
  }

  getMyListings(): Observable<Listing[]> {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    return this.http.get<ApiResponse>(
      `${this.baseUrl}/api/item/user/${user.id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      // Transform the response to match the expected format
      map(response => response.data || [])
    );
  }

  getMessages(): Observable<Message[]> {
    // Placeholder - implement when messaging feature is added
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  getNotifications(): Observable<Notification[]> {
    // Placeholder - implement when notification feature is added
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  getDashboardData(): Observable<DashboardData> {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      return new Observable(observer => {
        observer.next({
          lostItems: [],
          foundItems: [],
          myListings: [],
          messages: [],
          notifications: []
        });
        observer.complete();
      });
    }

    // Get user's listings for the dashboard
    return this.getMyListings().pipe(
      map(myListings => ({
        lostItems: [],
        foundItems: [],
        myListings,
        messages: [],
        notifications: []
      }))
    );
  }

  getUnreadMessagesCount(): number {
    return 0; // Placeholder implementation
  }

  getUnreadNotificationsCount(): number {
    return 0; // Placeholder implementation
  }
}