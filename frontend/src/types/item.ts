export type ItemType = 'lost' | 'found';

export interface Item {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: ItemType;
  contactInfo: string;
  userId: string;
  images?: string[];
  image?: string;
  imageUrl?: string;
  status?: 'active' | 'found' | 'closed' | 'resolved';
  owner?: {
    _id?: string;
    username: string;
    email: string;
    avatar?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ItemFormData {
  type: ItemType;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  contactInfo: string;
  userId?: string;
  imageUrl?: string;
}

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface ItemsResponse {
  data: Item[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ImageFile {
  file: File;
  preview: string;
}
