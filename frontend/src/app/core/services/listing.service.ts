import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ListingResponse, ListingActionResponse } from '../../features/my-listings/models/listing.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private readonly API_BASE_URL = environment.apiBaseUrl;
  private readonly ITEMS_ENDPOINT = `${this.API_BASE_URL}/api/items`;

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders(contentType?: string): HttpHeaders {
    const token = this.authService.getToken();
    const headers = new HttpHeaders();

    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getUserListings(userId: string, page = 1, limit = 6): Observable<ListingResponse> {
    const params = { page: page.toString(), limit: limit.toString() };
    return this.http.get<ListingResponse>(
      `${this.ITEMS_ENDPOINT}/user/${userId}`,
      {
        headers: this.getHeaders(),
        params: params
      }
    );
  }

  deleteListing(listingId: string): Observable<ListingActionResponse> {
    return this.http.delete<ListingActionResponse>(
      `${this.ITEMS_ENDPOINT}/${listingId}`,
      { headers: this.getHeaders('application/json') }
    );
  }
}