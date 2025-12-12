export interface Listing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: 'lost' | 'found';
  contactInfo: string;
  userId: string;
  images?: string[];  // Array of image URLs from backend
  imageUrl?: string;  // Legacy field
  image?: string;     // Legacy field
  status?: 'active' | 'found' | 'closed' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface ListingResponse {
  success: boolean;
  message?: string;
  data: {
    items: Listing[];
  };
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ListingActionResponse {
  success: boolean;
  message: string;
  data?: Listing;
}

export type ListingFilter = 'all' | 'lost' | 'found';

export interface FilterTab {
  label: string;
  value: ListingFilter;
}