'use client';

import type { ListingFilter as ListingFilterType } from '@/types/listing';

import { useState } from 'react';

interface ListingFilterProps {
  activeFilter: ListingFilterType;
  searchQuery: string;
  onFilterChange: (filter: ListingFilterType) => void;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

const filterTabs: { label: string; value: ListingFilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Lost', value: 'lost' },
  { label: 'Found', value: 'found' },
  { label: 'Resolved', value: 'resolved' },
];

export default function ListingFilter({ activeFilter, searchQuery, onFilterChange, onSearchChange, onSearch }: ListingFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full text-sm sm:text-base"
            />
          </div>
          <button
            onClick={onSearch}
            className="ml-2 p-2 sm:p-3 border border-gray-300 rounded-lg hover:border-orange-600 hover:text-orange-700 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-orange-50 rounded-lg p-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
              activeFilter === tab.value
                ? 'bg-white text-orange-700 shadow-sm'
                : 'text-gray-600 hover:text-orange-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
