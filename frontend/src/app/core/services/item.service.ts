import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Item,
  ItemType,
  ItemFormData,
  ApiResponse
} from '../../shared/models/item.model';
import { AuthService } from './auth.service';

/**
 * Item Service
 * Manages lost and found items with reactive state using Angular signals
 */
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly ITEMS_ENDPOINT = `${this.baseUrl}/api/items`;

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  // Reactive state with signals
  private readonly itemsCache = signal<Map<string, Item>>(new Map());

  /**
   * Get authorization headers
   * @private
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * API methods use the correct /api/items endpoint
   */

  /**
   * Get items by type with pagination
   * @param type - Item type (lost or found)
   * @param page - Page number
   * @param limit - Items per page
   */
  getItemsByType(type: ItemType, page = 1, limit = 20): Observable<any> {
    const params = {
      type,
      page: page.toString(),
      limit: limit.toString()
    };

    return this.http.get<any>(this.ITEMS_ENDPOINT, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      tap(response => this.cacheItems(response.data)),
      catchError(error => {
        console.error('Error fetching items by type:', error);
        throw error;
      })
    );
  }

  /**
   * Get total counts for lost and found items
   * @returns Observable with counts
   */
  getTotalCounts(): Observable<{ lost: number; found: number }> {
    // Return counts from both types
    return new Observable(subscriber => {
      const lostPromise = this.getItemsByType('lost', 1, 1).toPromise();
      const foundPromise = this.getItemsByType('found', 1, 1).toPromise();

      Promise.all([lostPromise, foundPromise]).then(([lostResponse, foundResponse]) => {
        subscriber.next({
          lost: (lostResponse as any)?.pagination?.totalItems || 0,
          found: (foundResponse as any)?.pagination?.totalItems || 0
        });
        subscriber.complete();
      }).catch(error => {
        subscriber.error(error);
      });
    });
  }

  /**
   * Get all items with optional filters
   * @param filters - Query parameters for filtering
   */
  getAllItems(filters?: {
    type?: ItemType;
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    const params: any = {};

    if (filters) {
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.page) params.page = filters.page.toString();
      if (filters.limit) params.limit = filters.limit.toString();
    }

    return this.http.get<any>(this.ITEMS_ENDPOINT, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      tap(response => this.cacheItems(response.data)),
      catchError(error => {
        console.error('Error fetching all items:', error);
        throw error;
      })
    );
  }

  /**
   * Get a single item by ID
   * @param id - Item ID
   */
  getItemById(id: string): Observable<any> {
    // Check cache first
    const cached = this.itemsCache().get(id);

    return this.http.get<any>(`${this.ITEMS_ENDPOINT}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.data?.item) {
          this.cacheItem(response.data.item);
        }
      }),
      catchError(error => {
        console.error('Error fetching item by ID:', error);
        throw error;
      })
    );
  }

  /**
   * Submit a new item
   * @param data - Item form data
   */
  submitItem(data: ItemFormData): Observable<any> {
    // Note: Backend expects different endpoint structure
    // For now using the items endpoint
    return this.http.post<any>(this.ITEMS_ENDPOINT, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.data?.item) {
          this.cacheItem(response.data.item);
        }
      }),
      catchError(error => {
        console.error('Error submitting item:', error);
        throw error;
      })
    );
  }

  /**
   * Update an item
   * @param id - Item ID
   * @param data - Updated item data
   */
  updateItem(id: string, data: Partial<ItemFormData>): Observable<any> {
    return this.http.put<any>(`${this.ITEMS_ENDPOINT}/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(response => {
        if (response.data?.item) {
          this.cacheItem(response.data.item);
        }
      }),
      catchError(error => {
        console.error('Error updating item:', error);
        throw error;
      })
    );
  }

  /**
   * Delete an item
   * @param id - Item ID
   */
  deleteItem(id: string): Observable<any> {
    return this.http.delete<any>(`${this.ITEMS_ENDPOINT}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        // Remove from cache
        const cache = new Map(this.itemsCache());
        cache.delete(id);
        this.itemsCache.set(cache);
      }),
      catchError(error => {
        console.error('Error deleting item:', error);
        throw error;
      })
    );
  }

  /**
   * Cache a single item
   * @private
   */
  private cacheItem(item: Item): void {
    const cache = new Map(this.itemsCache());
    cache.set(item.id, item);
    this.itemsCache.set(cache);
  }

  /**
   * Cache multiple items
   * @private
   */
  private cacheItems(items: Item[]): void {
    if (!items || !Array.isArray(items)) return;

    const cache = new Map(this.itemsCache());
    items.forEach(item => cache.set(item.id, item));
    this.itemsCache.set(cache);
  }

  /**
   * Clear item cache
   */
  clearCache(): void {
    this.itemsCache.set(new Map());
  }
}