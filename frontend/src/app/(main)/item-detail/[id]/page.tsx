'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Item } from '@/types/item';
import { formatLocalDate } from '@/utils/date-formatter';
import { getErrorMessage } from '@/lib/api-error';
import AuthGuard from '@/components/shared/AuthGuard';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

export default function ItemDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadItemDetails();
  }, [id]);

  const loadItemDetails = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.get(`/api/items/${id}`);
      setItem(response.data?.data || response.data);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, 'Failed to load item details.'));
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = () => user?.id === item?.userId;

  const deleteItem = async () => {
    try {
      await api.delete(`/api/items/${id}`);
      toast.success('Item deleted successfully!');
      router.push('/dashboard');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to delete item.'));
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <div className="container-responsive-md py-6 sm:py-8 lg:py-12">
          {/* Back Button */}
          <div className="mb-6 sm:mb-8">
            <button onClick={() => router.back()} className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors duration-200 text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Listings
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
              <div className="animate-pulse flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-96 bg-gray-300 rounded-lg"></div>
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {errorMessage && !isLoading && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12 text-center">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.186-.833-2.956 0L3.858 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-lg font-semibold text-gray-900 mb-4">{errorMessage}</p>
              <button onClick={loadItemDetails} className="btn-responsive bg-orange-500 hover:bg-orange-600 text-white font-semibold">Try Again</button>
            </div>
          )}

          {/* Item Details */}
          {!isLoading && !errorMessage && item && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-orange-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {item.type === 'lost' ? 'Lost' : 'Found'}
                      </span>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.status === 'resolved' ? 'Resolved' : 'Active'}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-900">{item.title}</h1>
                  </div>
                  {isOwner() && (
                    <div className="flex gap-2">
                      <button onClick={() => router.push(`/edit-item/${id}`)} className="btn-responsive-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit
                      </button>
                      <button onClick={() => setShowDeleteModal(true)} className="btn-responsive-sm bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12">
                  <div className="w-full lg:w-1/2">
                    <div className="relative h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden shadow-md">
                      <Image
                        src={item.imageUrl || item.image || '/package_placeholder.jpg'}
                        alt={item.title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 600px"
                        priority
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Description</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><h4 className="text-sm font-semibold text-gray-900 mb-1">Category</h4><p className="text-sm text-gray-600">{item.category}</p></div>
                      <div><h4 className="text-sm font-semibold text-gray-900 mb-1">Location</h4><p className="text-sm text-gray-600">{item.location}</p></div>
                      <div><h4 className="text-sm font-semibold text-gray-900 mb-1">Date</h4><p className="text-sm text-gray-600">{formatLocalDate(item.date)}</p></div>
                      <div><h4 className="text-sm font-semibold text-gray-900 mb-1">Posted</h4><p className="text-sm text-gray-600">{formatLocalDate(item.createdAt || '')}</p></div>
                    </div>
                    {item.contactInfo && (
                      <div className="bg-orange-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-orange-900 mb-2">Contact Information</h4>
                        <p className="text-sm text-orange-800">{item.contactInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <ConfirmationModal
            isOpen={showDeleteModal}
            title="Delete Item"
            message="Are you sure you want to delete this item? This action cannot be undone."
            confirmLabel="Delete"
            variant="danger"
            onConfirm={() => { setShowDeleteModal(false); deleteItem(); }}
            onCancel={() => setShowDeleteModal(false)}
          />
        </div>
      </div>
    </AuthGuard>
  );
}
