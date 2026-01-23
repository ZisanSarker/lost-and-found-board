'use client';

import React from 'react';
import { Calendar, MapPin, Mail } from 'lucide-react';
import { formatLocalDate } from '@/utils/date-formatter';

interface EditForm {
  username: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

interface ProfileHeaderProps {
  username: string;
  joinDate: string;
  location: string;
  email: string;
  isEditing: boolean;
  editForm: EditForm;
  onEditChange: (field: keyof EditForm, value: string) => void;
}

export default function ProfileHeader({
  username,
  joinDate,
  location,
  email,
  isEditing,
  editForm,
  onEditChange,
}: ProfileHeaderProps) {
  return (
    <div className="text-center mt-5 w-full max-w-sm">
      {/* Username */}
      {isEditing ? (
        <input
          type="text"
          value={editForm.username}
          onChange={(e) => onEditChange('username', e.target.value)}
          className="text-2xl md:text-3xl font-bold text-gray-900 bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-2 w-full text-center focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
          placeholder="Your name"
        />
      ) : (
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{username || 'User'}</h1>
      )}

      {/* Email badge */}
      <div className="flex items-center justify-center gap-1.5 mt-2 text-gray-500">
        <Mail className="w-3.5 h-3.5" />
        <span className="text-sm">{email}</span>
      </div>

      {/* Meta info row */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        {/* Join date */}
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar className="w-4 h-4 text-orange-400" />
          <span className="text-sm">Joined {formatLocalDate(joinDate)}</span>
        </div>

        {/* Location */}
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-orange-400" />
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => onEditChange('location', e.target.value)}
              className="text-sm bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all w-36"
              placeholder="Your location"
            />
          </div>
        ) : (
          location && (
            <div className="flex items-center gap-1.5 text-gray-500">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-sm">{location}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
