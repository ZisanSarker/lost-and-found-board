"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { Item } from "@/types/item";
import { formatShortDate } from "@/utils/date-formatter";

export default function FeaturedItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/api/items?limit=3");
      const data = response.data?.data || response.data || [];
      setItems(Array.isArray(data) ? data : data.items || []);
    } catch (err) {
      setError("Failed to load latest reports. Please try again.");
      console.error("Error fetching featured items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const getImageUrl = (item: Item): string => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) return item.images[0];
    return item.imageUrl || item.image || "/package_placeholder.jpg";
  };
  const getItemId = (item: Item): string => item.id || item._id || "";

  if (isLoading) {
    return (
      <section className="w-full max-w-7xl mx-auto rounded-xl bg-white shadow-lg overflow-hidden">
        <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">Latest Reports</span>
            <h2 className="text-responsive-xl font-bold tracking-tight text-orange-600 mb-4 sm:mb-6">Recently Posted Items</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-7xl mx-auto rounded-xl bg-white shadow-lg overflow-hidden">
        <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">Latest Reports</span>
            <h2 className="text-responsive-xl font-bold tracking-tight text-orange-600 mb-4 sm:mb-6">Recently Posted Items</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-red-700 mb-4">{error}</p>
              <button onClick={fetchItems} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors">Try Again</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto rounded-xl bg-white shadow-lg overflow-hidden">
        <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">Latest Reports</span>
            <h2 className="text-responsive-xl font-bold tracking-tight text-orange-600 mb-4 sm:mb-6">Recently Posted Items</h2>
            <div className="bg-orange-50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-orange-700 font-medium">No items posted yet</p>
              <p className="text-orange-600 text-sm mt-2">Be the first to report a lost or found item!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto rounded-xl bg-white shadow-lg overflow-hidden">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">Latest Reports</span>
          <h2 className="text-responsive-xl font-bold tracking-tight text-orange-600 mb-4 sm:mb-6">Recently Posted Items</h2>
          <p className="mx-auto max-w-2xl text-responsive-base text-gray-700 leading-relaxed">Check out the most recently reported lost and found items in our community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item) => (
            <Link key={getItemId(item)} href={`/item-detail/${getItemId(item)}`} className="group bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                <Image src={getImageUrl(item)} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-md ${item.type === "lost" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>{item.type === "lost" ? "Lost" : "Found"}</span>
                </div>
                {item.category && (<div className="absolute top-3 right-3"><span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 rounded-md text-xs font-medium">{item.category}</span></div>)}
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed line-clamp-2">{item.description}</p>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1.5">
                  <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="line-clamp-1">{item.location}</span>
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>{formatShortDate(item.date || item.createdAt || "")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
