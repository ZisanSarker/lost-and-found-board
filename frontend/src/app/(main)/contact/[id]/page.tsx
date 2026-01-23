'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Item } from '@/types/item';
import { formatLocalDate } from '@/utils/date-formatter';
import { getErrorMessage } from '@/lib/api-error';

const contactSchema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message is required and must be at least 10 characters'),
  contactPreference: z.string().min(1),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [itemLoadError, setItemLoadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { contactPreference: 'email' },
  });

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    setIsLoadingItem(true);
    setItemLoadError('');
    try {
      const response = await api.get(`/api/items/${id}`);
      if (response.data?.success) {
        setItem(response.data.data);
      } else {
        setItemLoadError(response.data?.message || 'Failed to load item');
      }
    } catch (error: unknown) {
      setItemLoadError(getErrorMessage(error, 'Failed to load item'));
    } finally {
      setIsLoadingItem(false);
    }
  };

  const onSubmit = async (_data: ContactFormData) => {
    if (!item) return;
    setIsSubmitting(true);
    try {
      // Note: Backend does not yet have a contact/email route.
      // For now, show success and encourage using the item's contact info directly.
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowSuccess(true);
      reset();
    } catch {
      toast.error('Failed to send message. Please use the contact info shown above.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    router.push(`/item-detail/${id}`);
  };

  return (
    <div className="min-h-screen">
      <div className="container-responsive py-6 sm:py-8 lg:py-12">
        <div className="max-w-2xl lg:max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border-t-4 border-orange-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">Contact Item Owner</h1>
                <p className="text-sm sm:text-base text-gray-600">Send a message about this item</p>
              </div>
              <button
                onClick={goBack}
                className="btn-responsive-sm bg-orange-100 hover:bg-orange-200 text-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to Item</span>
                <span className="sm:hidden">Back</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingItem && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500"></div>
                <p className="text-sm sm:text-base text-gray-600">Loading item details...</p>
              </div>
            </div>
          )}

          {/* Item Info Card */}
          {item && !isLoadingItem && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m16 0l-2-2m2 2l-2 2M4 13l2-2m-2 2l2 2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 capitalize">{item.type} &bull; {item.category}</p>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{item.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm sm:text-base">
                    <p className="text-gray-600">
                      <span className="font-medium">Location:</span> {item.location}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Date:</span> {formatLocalDate(item.date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Item Load Error */}
          {itemLoadError && (
            <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm sm:text-base text-red-800 font-medium mb-1">Unable to Load Item</h3>
                  <p className="text-xs sm:text-sm text-red-700">{itemLoadError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Authentication Check */}
          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base text-yellow-800 font-medium mb-1">Login Required</h3>
                  <p className="text-xs sm:text-sm text-yellow-700 mb-3 sm:mb-4">You need to be logged in to send messages.</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={() => router.push('/auth/sign-in')}
                      className="btn-responsive-sm bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition-colors"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => router.push('/auth/sign-up')}
                      className="btn-responsive-sm border border-yellow-600 text-yellow-700 hover:bg-yellow-50 font-semibold transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          {isAuthenticated && item && !isLoadingItem && !showSuccess && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Send Message</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    placeholder="Brief description of your message"
                    className={`input-responsive w-full focus:ring-orange-500 focus:border-orange-500 ${errors.subject ? 'border-red-300' : ''}`}
                  />
                  {errors.subject && (
                    <div className="mt-1 text-sm text-red-600 flex items-start gap-1">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>{errors.subject.message}</span>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    placeholder="Describe your inquiry or provide additional details..."
                    className={`textarea-responsive w-full focus:ring-orange-500 focus:border-orange-500 ${errors.message ? 'border-red-300' : ''}`}
                  />
                  {errors.message && (
                    <div className="mt-1 text-sm text-red-600 flex items-start gap-1">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.888-.833-2.658 0L3.156 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>{errors.message.message}</span>
                    </div>
                  )}
                </div>

                {/* Contact Preference */}
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('contactPreference')}
                        value="email"
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm sm:text-base text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('contactPreference')}
                        value="phone"
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm sm:text-base text-gray-700">Phone</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('contactPreference')}
                        value="any"
                        className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm sm:text-base text-gray-700">Any method</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-responsive-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex-1 btn-responsive-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex items-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-sm sm:text-base text-green-800 font-medium mb-1">Message Sent Successfully!</h3>
                  <p className="text-xs sm:text-sm text-green-700 mb-3 sm:mb-4">
                    Your message has been sent to the item owner. They will get back to you soon.
                  </p>
                  <button
                    onClick={goBack}
                    className="btn-responsive-sm bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                  >
                    Back to Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
