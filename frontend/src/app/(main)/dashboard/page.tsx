"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/shared/AuthGuard";
import api from "@/lib/api";
import MyListings from "@/components/listings/MyListings";
import { Listing } from "@/types/listing";

interface DashboardStats {
  total: number;
  lost: number;
  found: number;
  active: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ total: 0, lost: 0, found: 0, active: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) { fetchStats(); }
  }, [user?.id]);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/items/user/${user?.id}`);
      const items: Listing[] = response.data?.data?.items || response.data?.data || [];
      setStats({
        total: items.length,
        lost: items.filter((i) => i.type === "lost").length,
        found: items.filter((i) => i.type === "found").length,
        active: items.filter((i) => i.status !== "resolved").length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const getInitials = (name: string): string => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const statCards = [
    { label: "Total Posts", value: stats.total, color: "orange", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { label: "Lost Items", value: stats.lost, color: "red", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { label: "Found Items", value: stats.found, color: "green", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Active", value: stats.active, color: "blue", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  ];

  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    orange: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-100" },
    red: { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-100" },
    green: { bg: "bg-green-50", text: "text-green-600", ring: "ring-green-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
  };

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Top Bar: Greeting + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
                  <span className="text-sm font-bold text-white">{getInitials(user.username)}</span>
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Welcome, {user.username}
                </h1>
                <p className="text-sm text-gray-500">Here&apos;s your activity overview</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href="/repost/lost"
                className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-orange-300 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-50 hover:border-orange-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report Lost
              </Link>
              <Link
                href="/repost/found"
                className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-orange-300 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-50 hover:border-orange-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Report Found
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => {
              const colors = colorMap[stat.color];
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl p-5 border border-orange-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center`}>
                      <svg className={`w-5 h-5 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? (
                          <span className="inline-block w-6 h-6 bg-gray-100 rounded animate-pulse" />
                        ) : stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Listings Section */}
          <MyListings userId={user.id} />
        </div>
      </div>
    </AuthGuard>
  );
}
