'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getErrorMessage } from '@/lib/api-error';
import AuthGuard from '@/components/shared/AuthGuard';
import LoadingState from '@/components/shared/LoadingState';

const editSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  location: z.string().min(1, 'Please select a location.'),
  date: z.string().min(1, 'Please select a date.'),
  contactInfo: z.string().min(1, 'Please provide contact information.'),
});

type EditFormData = z.infer<typeof editSchema>;

export default function EditItemPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await api.get(`/api/items/${id}`);
        const item = response.data?.data || response.data;
        reset({
          title: item.title || '',
          description: item.description || '',
          category: item.category || '',
          location: item.location || '',
          date: item.date ? item.date.split('T')[0] : '',
          contactInfo: item.contactInfo || '',
        });
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, 'Failed to load item details.'));
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    loadItem();
  }, [id, reset, router]);

  const onSubmit = async (data: EditFormData) => {
    setIsSubmitting(true);
    try {
      await api.put(`/api/items/${id}`, data);
      toast.success('Item updated successfully!');
      router.push(`/item-detail/${id}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to update item.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <div className="container-responsive-md py-6 sm:py-8 lg:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <button onClick={() => router.back()} className="mb-4 inline-flex items-center px-4 py-2 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m0 0l7 7m-7-7l7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-900">Edit Item</h1>
          </div>

          {isLoading ? (
            <LoadingState text="Loading item details..." />
          ) : (
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="bg-white rounded-xl shadow-xl border border-orange-200 p-6 sm:p-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-orange-800">Title *</label>
                      <input {...register('title')} className={`input-responsive w-full ${errors.title ? 'border-red-400' : ''}`} />
                      {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-orange-800">Description *</label>
                      <textarea {...register('description')} rows={4} className={`textarea-responsive w-full ${errors.description ? 'border-red-400' : ''}`} />
                      {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-orange-800">Category *</label>
                        <select {...register('category')} className={`input-responsive w-full ${errors.category ? 'border-red-400' : ''}`}>
                          <option value="">Select</option>
                          <option value="electronics">Electronics</option>
                          <option value="personal">Personal Items</option>
                          <option value="documents">Documents</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-orange-800">Location *</label>
                        <select {...register('location')} className={`input-responsive w-full ${errors.location ? 'border-red-400' : ''}`}>
                          <option value="">Select</option>
                          <option value="downtown">Downtown</option>
                          <option value="coffee shop">Coffee Shop</option>
                          <option value="central park">Central Park</option>
                          <option value="bus station">Bus Station</option>
                          <option value="library">Library</option>
                          <option value="park">Park</option>
                        </select>
                        {errors.location && <p className="text-sm text-red-600">{errors.location.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-orange-800">Date *</label>
                      <input type="date" {...register('date')} className={`input-responsive w-full ${errors.date ? 'border-red-400' : ''}`} />
                      {errors.date && <p className="text-sm text-red-600">{errors.date.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-orange-800">Contact Info *</label>
                      <textarea {...register('contactInfo')} rows={3} className={`textarea-responsive w-full ${errors.contactInfo ? 'border-red-400' : ''}`} />
                      {errors.contactInfo && <p className="text-sm text-red-600">{errors.contactInfo.message}</p>}
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" disabled={isSubmitting} className="flex-1 btn-responsive-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                        {isSubmitting && <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>}
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button type="button" onClick={() => router.back()} className="flex-1 btn-responsive-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
