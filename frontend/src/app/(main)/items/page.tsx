'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Item } from '@/types/item';
import AuthGuard from '@/components/shared/AuthGuard';
import { ListingFilter } from '@/types/listing';
import { formatShortDate } from '@/utils/date-formatter';
import Pagination from '@/components/shared/Pagination';

type SortOption = 'newest' | 'oldest' | 'title';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ListingFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadItems();
  }, [currentPage, sortBy]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/items?page=${currentPage}&limit=9&sort=${sortBy}`);
      const data = response.data?.data;
      setItems(data?.items || data || []);
      setTotalPages(data?.pagination?.totalPages || 1);
      setTotalItems(data?.pagination?.total || (data?.items || data || []).length);
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterCounts = {
    all: items.length,
    lost: items.filter(i => i.type === 'lost').length,
    found: items.filter(i => i.type === 'found').length,
  };

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Public Posts</h1>
              </div>
              <p className="text-sm sm:text-base text-gray-500 ml-[52px]">
                Browse lost and found items posted by the community
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/repost/lost"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report Lost
              </Link>
              <Link
                href="/repost/found"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report Found
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-4 sm:p-5 mb-6 space-y-4">
            {/* Search Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-xl text-sm bg-orange-50/30 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 hover:border-orange-300 transition-all duration-200"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }}
                className="px-4 py-3 border-2 border-orange-200 rounded-xl text-sm bg-orange-50/30 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 hover:border-orange-300 transition-all duration-200 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {(['all', 'lost', 'found'] as ListingFilter[]).map(filter => (
                <button
                  key={filter}
                  onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeFilter === filter
                      ? filter === 'lost'
                        ? 'bg-red-50 text-red-700 border-2 border-red-200 shadow-sm'
                        : filter === 'found'
                          ? 'bg-green-50 text-green-700 border-2 border-green-200 shadow-sm'
                          : 'bg-orange-50 text-orange-700 border-2 border-orange-300 shadow-sm'
                      : 'text-gray-500 border-2 border-transparent hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {filter === 'lost' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  {filter === 'found' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {filter === 'all' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  )}
                  <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeFilter === filter
                      ? filter === 'lost' ? 'bg-red-100 text-red-600'
                        : filter === 'found' ? 'bg-green-100 text-green-600'
                          : 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {filterCounts[filter as keyof typeof filterCounts] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          {!isLoading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-orange-600">{filteredItems.length}</span> of{' '}
                <span className="font-semibold text-orange-600">{totalItems}</span> items
              </p>
            </div>
          )}

          {/* Items Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-orange-100 overflow-hidden animate-pulse">
                  <div className="h-52 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-lg w-full" />
                    <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
                    <div className="flex justify-between pt-2">
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-orange-200">
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No matching items' : 'No items posted yet'}
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                {searchQuery
                  ? `No items match "${searchQuery}". Try a different search term.`
                  : 'Be the first to report a lost or found item!'}
              </p>
              {!searchQuery && (
                <div className="flex gap-3 justify-center">
                  <Link href="/repost/lost" className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    Report Lost
                  </Link>
                  <Link href="/repost/found" className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    Report Found
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <Link
                    key={item.id || item._id}
                    href={`/item-detail/${item.id || item._id}`}
                    className="group bg-white rounded-2xl border border-orange-100 overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.imageUrl || item.image || '/package_placeholder.jpg'}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/package_placeholder.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* Type Badge */}
                      <span className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${
                        item.type === 'lost'
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}>
                        {item.type}
                      </span>
                      {/* Category Badge */}
                      {item.category && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm shadow-sm">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-orange-600 transition-colors duration-200">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Meta Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate max-w-[120px]">{item.location}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatShortDate(item.date)}
                        </span>
                      </div>

                      {/* Owner Info */}
                      {item.owner && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          {item.owner.avatar ? (
                            <img
                              src={item.owner.avatar}
                              alt={item.owner.username}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-orange-100"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white">
                                {item.owner.username?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-xs text-gray-500 truncate">
                            {item.owner.username}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
