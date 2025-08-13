import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Item, 
  ItemType, 
  ItemFormData, 
  ApiResponse 
} from '../../shared/models/item.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly ITEMS_ENDPOINT = `${this.baseUrl}/api/item`;
  
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Get all items of both types
  getAllItems(): Observable<{
    lost: ApiResponse<Item[]>;
    found: ApiResponse<Item[]>;
  }> {
    return forkJoin({
      lost: this.getItemsByType('lost'),
      found: this.getItemsByType('found')
    });
  }

  // Get items by type (lost or found) with pagination
  getItemsByType(type: ItemType, page = 1, limit = 6): Observable<ApiResponse<Item[]>> {
    const params = { page: page.toString(), limit: limit.toString() };
    return this.http.get<ApiResponse<Item[]>>(
      `${this.ITEMS_ENDPOINT}/type/${type}`,
      { 
        headers: this.getAuthHeaders(),
        params: params
      }
    );
  }

  // Get total counts for both types (for tab headers)
  getTotalCounts(): Observable<{ lost: number; found: number }> {
    return forkJoin({
      lost: this.getItemsByType('lost', 1, 1),
      found: this.getItemsByType('found', 1, 1)
    }).pipe(
      map(response => ({
        lost: response.lost.totalCount || 0,
        found: response.found.totalCount || 0
      }))
    );
  }

  // Submit a new item
  submitItem(data: ItemFormData): Observable<ApiResponse<Item>> {
    // If there's an image, use FormData
    if (data.image) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });
      
      return this.http.post<ApiResponse<Item>>(
        this.ITEMS_ENDPOINT,
        formData,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${this.authService.getToken()}`
          })
        }
      );
    }

    // If no image, use JSON
    return this.http.post<ApiResponse<Item>>(
      this.ITEMS_ENDPOINT,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Get a single item by ID
  getItemById(id: string): Observable<ApiResponse<Item>> {
    return this.http.get<ApiResponse<Item>>(
      `${this.ITEMS_ENDPOINT}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  // Update an item
  updateItem(id: string, data: Partial<ItemFormData>): Observable<ApiResponse<Item>> {
    return this.http.patch<ApiResponse<Item>>(
      `${this.ITEMS_ENDPOINT}/${id}`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // Delete an item
  deleteItem(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.ITEMS_ENDPOINT}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }
}