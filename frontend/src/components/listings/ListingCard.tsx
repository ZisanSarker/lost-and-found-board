"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/types/listing";
import { formatShortDate } from "@/utils/date-formatter";

interface ListingCardProps {
  listing: Listing;
  onEdit: (listing: Listing) => void;
  onDelete: (listing: Listing) => void;
  onResolve: (listing: Listing) => void;
}

export default function ListingCard({ listing, onEdit, onDelete, onResolve }: ListingCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => { document.removeEventListener("click", handleClickOutside); };
  }, []);

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getImageUrl = (): string => {
    if (listing.images && Array.isArray(listing.images) && listing.images.length > 0) return listing.images[0];
    return listing.imageUrl || listing.image || "/package_placeholder.jpg";
  };
  const getListingId = (): string => listing.id || listing._id || "";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-visible hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-32 sm:h-40 md:h-48 w-full overflow-visible bg-gray-200">
        <Image
          src={getImageUrl()}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Status Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${listing.status === "resolved" ? "bg-blue-500 text-white" : listing.type === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
            {listing.status === "resolved" ? "Resolved" : listing.type === "lost" ? "Lost" : "Found"}
          </span>
        </div>
        {/* 3-dot Menu Button */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10" ref={dropdownRef}>
          <div className="relative">
            <button onClick={toggleDropdown} className="p-1.5 sm:p-2 rounded-md shadow-md transition-colors duration-200 bg-orange-100 hover:bg-orange-200">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" /></svg>
            </button>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1" style={{ zIndex: 999999 }}>
                <Link href={`/item-detail/${getListingId()}`} onClick={() => setIsDropdownOpen(false)} className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center text-sm text-gray-700 transition-colors">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  View Post
                </Link>
                <button onClick={() => { setIsDropdownOpen(false); onEdit(listing); }} className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center text-sm text-gray-700 transition-colors">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit Post
                </button>
                {listing.status !== "resolved" && (
                  <button onClick={() => { setIsDropdownOpen(false); onResolve(listing); }} className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center text-sm text-gray-700 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Mark Resolved
                  </button>
                )}
                <hr className="border-gray-200 my-1" />
                <button onClick={() => { setIsDropdownOpen(false); onDelete(listing); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center text-sm transition-colors">
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Delete Post
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">{listing.title}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed line-clamp-3">{listing.description}</p>
        {/* Location and Date */}
        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>{formatShortDate(listing.date)}</span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
          <Link href={`/item-detail/${getListingId()}`} className="flex-1 bg-white hover:bg-orange-50 text-orange-500 border-2 border-orange-500 text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <span className="hidden sm:inline">View Details</span><span className="sm:hidden">Details</span>
          </Link>
          <button onClick={() => onEdit(listing)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
