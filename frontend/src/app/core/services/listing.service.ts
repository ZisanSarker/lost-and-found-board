import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Listing, ListingResponse, ListingActionResponse } from '../../features/my-listings/models/listing.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private readonly ITEMS_ENDPOINT = `${this.API_BASE_URL}/api/item`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders();
    
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  private getDeleteHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  getUserListings(userId: string, page: number = 1, limit: number = 6): Observable<ListingResponse> {
    const params = { page: page.toString(), limit: limit.toString() };
    return this.http.get<ListingResponse>(
      `${this.ITEMS_ENDPOINT}/user/${userId}`,
      { 
        headers: this.getHeaders(),
        params: params
      }
    );
  }

  deleteListing(listingId: string, userId: string): Observable<ListingActionResponse> {
    console.log('Deleting listing:', listingId, 'for user:', userId);
    console.log('Headers:', this.getDeleteHeaders());
    
    return this.http.delete<ListingActionResponse>(
      `${this.ITEMS_ENDPOINT}/${listingId}`,
      { headers: this.getDeleteHeaders() }
    );
  }
}