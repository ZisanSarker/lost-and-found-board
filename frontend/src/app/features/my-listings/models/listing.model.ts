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
  imageUrl?: string;
  image?: string;
  status?: 'active' | 'found' | 'closed' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface ListingResponse {
  success: boolean;
  data: Listing[];
  count: number;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  message?: string;
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