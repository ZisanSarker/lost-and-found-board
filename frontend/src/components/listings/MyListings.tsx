'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Listing } from '@/types/listing';
import type { ListingFilter as ListingFilterType } from '@/types/listing';
import { filterListings } from '@/utils/listing.utils';
import ListingFilter from './ListingFilter';
import ListingCard from './ListingCard';
import Pagination from '@/components/shared/Pagination';
import LoadingState from '@/components/shared/LoadingState';
import ErrorState from '@/components/shared/ErrorState';
import EmptyState from '@/components/shared/EmptyState';

interface MyListingsProps {
  userId: string;
}

export default function MyListings({ userId }: MyListingsProps) {
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<ListingFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const router = useRouter();

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.get(`/api/items/user/${userId}?page=${currentPage}&limit=${itemsPerPage}`);
      const items = response.data?.data?.items || response.data?.data || [];
      setAllListings(items);
      setTotalPages(response.data?.data?.pagination?.totalPages || Math.ceil(items.length / itemsPerPage) || 1);
      applyFilters(items, activeFilter, searchQuery);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMessage('Authentication required. Please log in again.');
      } else {
        setErrorMessage('Failed to load listings. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, currentPage]);

  const applyFilters = (listings: Listing[], filter: ListingFilterType, query: string) => {
    let filtered = listings;
    if (filter === 'resolved') {
      filtered = filtered.filter(l => l.status === 'resolved');
    } else if (filter !== 'all') {
      filtered = filtered.filter(l => l.type === filter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      );
    }
    setFilteredListings(filtered);
  };

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const onFilterChange = (filter: ListingFilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    applyFilters(allListings, filter, searchQuery);
  };

  const onSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const onSearch = () => {
    setCurrentPage(1);
    applyFilters(allListings, activeFilter, searchQuery);
  };

  const onEditListing = (listing: Listing) => {
    const id = listing.id || listing._id || "";
    router.push(`/edit-item/${id}`);
  };

  const onDeleteListing = async (listing: Listing) => {
    const id = listing.id || listing._id || "";
    try {
      await api.delete(`/api/items/${id}`);
      const updated = allListings.filter(l => (l.id || l._id) !== id);
      setAllListings(updated);
      applyFilters(updated, activeFilter, searchQuery);
      toast.success('Post deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete post.');
    }
  };

  const onResolveListing = async (listing: Listing) => {
    const id = listing.id || listing._id || "";
    try {
      await api.patch(`/api/items/${id}/resolve`);
      const updated = allListings.map((l) => (l.id || l._id) === id ? { ...l, status: "resolved" as const } : l);
      setAllListings(updated);
      applyFilters(updated, activeFilter, searchQuery);
      toast.success("Item marked as resolved!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to resolve item.");
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
      {/* Header + Filter */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 border-b border-orange-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">My Listings</h2>
        <ListingFilter activeFilter={activeFilter} searchQuery={searchQuery} onFilterChange={onFilterChange} onSearchChange={onSearchChange} onSearch={onSearch} />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 lg:p-8">
        {isLoading && <LoadingState text="Loading your listings..." />}
        {errorMessage && !isLoading && <ErrorState message={errorMessage} onRetry={loadListings} />}
        {!isLoading && !errorMessage && filteredListings.length === 0 && (
          <EmptyState
            title={searchQuery ? 'No Matching Listings' : 'No Listings Yet'}
            description={searchQuery ? `No listings found matching "${searchQuery}"` : "You haven't created any listings yet."}
            actionLabel="Report Lost Item"
            onAction={() => router.push('/repost/lost')}
          />
        )}
        {!isLoading && !errorMessage && filteredListings.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-sm sm:text-base text-gray-600">
              Showing <span className="font-semibold text-orange-600">{filteredListings.length}</span> of <span className="font-semibold text-orange-600">{allListings.length}</span> listings
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id || listing._id} listing={listing} onEdit={onEditListing} onDelete={onDeleteListing} onResolve={onResolveListing} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => { setCurrentPage(page); }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
