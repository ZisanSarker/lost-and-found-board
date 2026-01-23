'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { getErrorMessage } from '@/lib/api-error';
import { useAuth } from '@/lib/auth-context';
import AuthGuard from '@/components/shared/AuthGuard';
import { ItemType } from '@/types/item';

const reportSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  location: z.string().min(1, 'Please select a location.'),
  date: z.string().min(1, 'Please select a date.'),
});

type ReportFormData = z.infer<typeof reportSchema>;

const countryCodes = [
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
];

const locationSuggestions = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna',
  'Barishal', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur',
  'Narayanganj', 'Cox\'s Bazar', 'Jessore', 'Bogra', 'Dinajpur',
  'Tangail', 'Brahmanbaria', 'Narsingdi', 'Savar', 'Tongi',
];

const categorySuggestions = [
  'Electronics', 'Mobile Phone', 'Laptop', 'Wallet', 'Keys',
  'Documents', 'ID Card', 'Passport', 'Bag', 'Jewelry',
  'Clothing', 'Watch', 'Glasses', 'Umbrella', 'Books',
  'Pet', 'Bicycle', 'Other',
];

export default function ReportPage() {
  const params = useParams();
  const itemType = params.type as ItemType;
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+880');

  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setShowCategorySuggestions(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = categorySuggestions.filter(c =>
    c.toLowerCase().includes(categoryInput.toLowerCase())
  );

  const filteredLocations = locationSuggestions.filter(l =>
    l.toLowerCase().includes(locationInput.toLowerCase())
  );

  if (!['lost', 'found'].includes(itemType)) {
    router.push('/dashboard');
    return null;
  }

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    try {
      let imageUrl = '';

      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const uploadRes = await api.post('/api/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data?.data?.url || '';
      }

      const contactInfo = mobile.trim()
        ? `${user?.email || ''} | ${countryCode}${mobile.trim()}`
        : user?.email || '';

      const itemData = {
        ...data,
        type: itemType,
        imageUrl,
        contactInfo,
      };

      const response = await api.post('/api/items', itemData);
      if (response.data) {
        toast.success(`${itemType === 'lost' ? 'Lost' : 'Found'} item reported successfully!`);
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to submit report. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLost = itemType === 'lost';

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLost ? 'bg-red-100' : 'bg-green-100'}`}>
                {isLost ? (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isLost ? 'Report Lost Item' : 'Report Found Item'}
              </h1>
            </div>
            <p className="text-gray-600 text-sm sm:text-base ml-[52px]">
              {isLost
                ? 'Provide details about the item you lost to help others identify it.'
                : 'Provide details about the item you found to help the owner claim it.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-5 sm:p-8 space-y-6">

              {/* Title & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Item Title</label>
                  <input
                    {...register('title')}
                    placeholder={isLost ? 'What did you lose?' : 'What did you find?'}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm bg-orange-50/30 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 hover:border-orange-300 ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-orange-200'}`}
                  />
                  {errors.title && <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>}
                </div>
                <div className="space-y-1.5 relative" ref={categoryRef}>
                  <label className="block text-sm font-semibold text-gray-700">Category</label>
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => {
                      setCategoryInput(e.target.value);
                      setValue('category', e.target.value, { shouldValidate: true });
                      setShowCategorySuggestions(true);
                    }}
                    onFocus={() => setShowCategorySuggestions(true)}
                    placeholder="Type or select a category"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm bg-orange-50/30 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 hover:border-orange-300 ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-orange-200'}`}
                  />
                  {showCategorySuggestions && filteredCategories.length > 0 && (
                    <ul className="absolute z-20 w-full mt-1 bg-white border border-orange-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredCategories.map((cat) => (
                        <li
                          key={cat}
                          onClick={() => {
                            setCategoryInput(cat);
                            setValue('category', cat, { shouldValidate: true });
                            setShowCategorySuggestions(false);
                          }}
                          className="px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {cat}
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category.message}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe the item in detail — color, brand, distinguishing features..."
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm bg-orange-50/30 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 hover:border-orange-300 resize-none ${errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-orange-200'}`}
                />
                {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
              </div>

              {/* Location & Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 relative" ref={locationRef}>
                  <label className="block text-sm font-semibold text-gray-700">Location</label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => {
                      setLocationInput(e.target.value);
                      setValue('location', e.target.value, { shouldValidate: true });
                      setShowLocationSuggestions(true);
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    placeholder="Type or select a location"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm bg-orange-50/30 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 hover:border-orange-300 ${errors.location ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-orange-200'}`}
                  />
                  {showLocationSuggestions && filteredLocations.length > 0 && (
                    <ul className="absolute z-20 w-full mt-1 bg-white border border-orange-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredLocations.map((loc) => (
                        <li
                          key={loc}
                          onClick={() => {
                            setLocationInput(loc);
                            setValue('location', loc, { shouldValidate: true });
                            setShowLocationSuggestions(false);
                          }}
                          className="px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 cursor-pointer transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {loc}
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.location && <p className="text-xs text-red-500 font-medium">{errors.location.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Date</label>
                  <input
                    type="date"
                    {...register('date')}
                    onMouseEnter={(e) => {
                      try { (e.target as HTMLInputElement).showPicker(); } catch {}
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-sm bg-orange-50/30 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 hover:border-orange-300 ${errors.date ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-orange-200'}`}
                  />
                  {errors.date && <p className="text-xs text-red-500 font-medium">{errors.date.message}</p>}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-4 py-3 border-2 rounded-xl text-sm bg-gray-100 border-orange-200 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400">Auto-filled from your account</p>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mobile <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-[120px] px-2 py-3 border-2 rounded-xl text-sm bg-orange-50/30 border-orange-200 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="1XXXXXXXXX"
                      className="flex-1 px-4 py-3 border-2 rounded-xl text-sm bg-orange-50/30 border-orange-200 transition-all duration-200 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 hover:border-orange-300"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Photo <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                {imagePreview ? (
                  <div className="relative inline-block group">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded-xl border-2 border-orange-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => document.getElementById('image-input')?.click()}
                    className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all duration-200 group"
                  >
                    <svg className="w-10 h-10 text-orange-300 mx-auto mb-2 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Click to upload a photo of the item</p>
                  </div>
                )}
                <input id="image-input" type="file" accept="image/*" className="hidden" onChange={onImageChange} />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-3 px-4 border-2 border-orange-200 text-orange-700 text-sm font-semibold rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
