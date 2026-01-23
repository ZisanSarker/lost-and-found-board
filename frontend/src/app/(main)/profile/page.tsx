'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Edit, Save, X, Trash2, Camera, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import { useProfile } from '@/hooks/useProfile';
import { useUpload } from '@/hooks/useUpload';
import AuthGuard from '@/components/shared/AuthGuard';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ContactInfo from '@/components/profile/ContactInfo';
import Bio from '@/components/profile/Bio';
import { UserProfile } from '@/types/profile';

interface EditForm {
  username: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

export default function ProfilePage() {
  const { logout, updateUserProfile } = useAuth();
  const { profile, loading, error, getProfile, updateProfile, deleteAccount } = useProfile();
  const { uploadImage, isUploading, isValidImageFile } = useUpload();

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    username: '',
    phone: '',
    location: '',
    bio: '',
    avatar: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfile().catch(() => {});
  }, [getProfile]);

  const currentProfile: UserProfile | null = profile;

  useEffect(() => {
    if (currentProfile) {
      setEditForm({
        username: currentProfile.username || '',
        phone: currentProfile.phone || '',
        location: currentProfile.location || '',
        bio: currentProfile.bio || '',
        avatar: currentProfile.avatar || '',
      });
    }
  }, [currentProfile]);

  const handleEditChange = useCallback((field: keyof EditForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleStartEdit = () => {
    if (currentProfile) {
      setEditForm({
        username: currentProfile.username || '',
        phone: currentProfile.phone || '',
        location: currentProfile.location || '',
        bio: currentProfile.bio || '',
        avatar: currentProfile.avatar || '',
      });
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (currentProfile) {
      setEditForm({
        username: currentProfile.username || '',
        phone: currentProfile.phone || '',
        location: currentProfile.location || '',
        bio: currentProfile.bio || '',
        avatar: currentProfile.avatar || '',
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await updateProfile({
        username: editForm.username,
        phone: editForm.phone,
        location: editForm.location,
        bio: editForm.bio,
        avatar: editForm.avatar,
      });
      updateUserProfile(response.data.user as unknown as Parameters<typeof updateUserProfile>[0]);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setEditForm((prev) => ({ ...prev, avatar: imageUrl.url }));
        toast.success('Avatar uploaded successfully!');
      }
    } catch {
      toast.error('Failed to upload avatar');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
      logout();
    } catch {
      toast.error('Failed to delete account');
    }
    setShowDeleteModal(false);
  };

  if (loading && !currentProfile) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50/30">
          <div className="container mx-auto px-4 py-12 max-w-5xl">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="h-48 bg-gradient-to-r from-orange-200 to-amber-200 animate-pulse" />
              <div className="bg-white px-8 pb-8 pt-20">
                <div className="absolute top-32 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse border-4 border-white shadow-xl" />
                </div>
                <div className="text-center mt-8 space-y-3">
                  <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto" />
                  <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mx-auto" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 h-52 animate-pulse" />
              <div className="bg-white rounded-2xl shadow-lg p-6 h-52 animate-pulse" />
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error && !currentProfile) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50/30 flex items-center justify-center">
          <div className="text-center bg-white rounded-3xl shadow-xl p-10 max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">Failed to load profile</p>
            <p className="text-gray-500 text-sm mb-6">Something went wrong. Please try again.</p>
            <button
              onClick={() => getProfile()}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
            >
              Try Again
            </button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!currentProfile) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50/30 flex items-center justify-center">
          <p className="text-gray-600">No profile data available</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50/30">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
          {/* Profile Header Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white">
            {/* Cover Gradient */}
            <div className="h-44 md:h-52 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-white/5 to-transparent rounded-full" />
              </div>

              {/* Action buttons on cover */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleStartEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all hover:scale-105"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit Profile</span>
                    </button>
                    <button
                      onClick={() => { logout(); }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all hover:scale-105"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading || isUploading}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/90 backdrop-blur-md border border-green-400/30 rounded-xl text-white text-sm font-medium hover:bg-green-600/90 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white text-sm font-medium hover:bg-white/30 transition-all hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div className="relative px-6 md:px-10 pb-8">
              <div className="flex flex-col items-center -mt-16 md:-mt-20">
                <div className="relative group">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center ring-4 ring-orange-100/50">
                    {(isEditing ? editForm.avatar : currentProfile.avatar) ? (
                      <img
                        src={isEditing ? editForm.avatar : currentProfile.avatar}
                        alt={currentProfile.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl md:text-5xl font-bold text-orange-500">
                        {(currentProfile.username || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button
                      onClick={handleAvatarClick}
                      className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <div className="text-center text-white">
                        <Camera className="w-7 h-7 mx-auto" />
                        <span className="text-xs mt-1 block font-medium">Change</span>
                      </div>
                    </button>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />

                {/* Name & Info */}
                <ProfileHeader
                  username={currentProfile.username}
                  joinDate={currentProfile.createdAt || ''}
                  location={currentProfile.location}
                  email={currentProfile.email}
                  isEditing={isEditing}
                  editForm={editForm}
                  onEditChange={handleEditChange}
                />
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <ContactInfo
              email={currentProfile.email}
              phone={currentProfile.phone}
              isEditing={isEditing}
              editForm={editForm}
              onEditChange={handleEditChange}
            />
            <Bio
              bio={currentProfile.bio}
              isEditing={isEditing}
              editForm={editForm}
              onEditChange={handleEditChange}
            />
          </div>

          {/* Danger Zone */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
            <div className="px-6 py-4 bg-red-50/50 border-b border-red-100">
              <h3 className="text-base font-semibold text-red-700 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Danger Zone
              </h3>
            </div>
            <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Delete your account</p>
                <p className="text-sm text-gray-500 mt-0.5">Once deleted, all your data will be permanently removed.</p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-all shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Account</h3>
              <p className="text-gray-500 text-center mb-8 text-sm leading-relaxed">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg shadow-red-600/25"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </AuthGuard>
  );
}
