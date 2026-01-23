'use client';

import React from 'react';
import { User } from 'lucide-react';

interface EditForm {
  username: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

interface BioProps {
  bio: string;
  isEditing: boolean;
  editForm: EditForm;
  onEditChange: (field: keyof EditForm, value: string) => void;
}

export default function Bio({ bio, isEditing, editForm, onEditChange }: BioProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/80 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <User className="w-4.5 h-4.5 text-white" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">About Me</h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEditing ? (
          <textarea
            value={editForm.bio}
            onChange={(e) => onEditChange('bio', e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl text-sm text-gray-800 bg-orange-50/50 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all resize-none leading-relaxed"
            placeholder="Tell others about yourself — your interests, what you do, or how they can reach you..."
          />
        ) : (
          <div className="min-h-[80px]">
            {bio ? (
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{bio}</p>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400 italic">No bio added yet</p>
                <p className="text-xs text-gray-300 mt-1">Click &quot;Edit Profile&quot; to add one</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
