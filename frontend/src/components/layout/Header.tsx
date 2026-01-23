'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const getInitials = () => {
    if (!user?.username) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      <header className="w-full bg-orange-100 shadow-md">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600 cursor-pointer transition-colors hover:text-orange-700">
              Lost & Found
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                href="/home"
                className={`hover:text-orange-500 transition-colors duration-200 text-sm lg:text-base ${
                  isActive('/home') ? 'text-orange-600 font-semibold' : 'text-gray-700'
                }`}
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className={`hover:text-orange-500 transition-colors duration-200 text-sm lg:text-base ${
                      isActive('/dashboard') ? 'text-orange-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/items"
                    className={`hover:text-orange-500 transition-colors duration-200 text-sm lg:text-base ${
                      isActive('/items') ? 'text-orange-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    Public Posts
                  </Link>
                </>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                /* User Menu */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-orange-300 flex items-center justify-center bg-orange-200">
                      {user?.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-orange-700 font-semibold text-sm sm:text-base">
                          {getInitials()}
                        </span>
                      )}
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown-responsive animate-scale-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        href="/help-support"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Help & Support
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogoutClick}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Buttons */
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/auth/sign-in"
                    className="btn-responsive-sm bg-orange-600 text-white hover:bg-orange-700 rounded-md"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="btn-responsive-sm border border-orange-600 text-orange-600 hover:bg-orange-50 rounded-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-orange-200 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-orange-200 shadow-lg animate-slide-down">
            <nav className="container-responsive py-4 space-y-2">
              <Link
                href="/home"
                className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                  isActive('/home')
                    ? 'bg-orange-100 text-orange-600 font-semibold'
                    : 'text-gray-700 hover:bg-orange-50'
                }`}
              >
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-orange-100 text-orange-600 font-semibold'
                        : 'text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/items"
                    className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                      isActive('/items')
                        ? 'bg-orange-100 text-orange-600 font-semibold'
                        : 'text-gray-700 hover:bg-orange-50'
                    }`}
                  >
                    Public Posts
                  </Link>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <button
                      onClick={handleLogoutClick}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-2 flex flex-col gap-2 px-4">
                  <Link
                    href="/auth/sign-in"
                    className="btn-responsive-sm bg-orange-600 text-white hover:bg-orange-700 rounded-md text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="btn-responsive-sm border border-orange-600 text-orange-600 hover:bg-orange-50 rounded-md text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access your account."
        confirmLabel="Logout"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
