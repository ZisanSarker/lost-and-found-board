'use client';

import React from 'react';
import { Mail, Phone, Shield } from 'lucide-react';

interface EditForm {
  username: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

interface ContactInfoProps {
  email: string;
  phone: string;
  isEditing: boolean;
  editForm: EditForm;
  onEditChange: (field: keyof EditForm, value: string) => void;
}

export default function ContactInfo({
  email,
  phone,
  isEditing,
  editForm,
  onEditChange,
}: ContactInfoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/80 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Shield className="w-4.5 h-4.5 text-white" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">Contact Information</h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 border border-orange-100">
            <Mail className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
            <div className="mt-1.5 flex items-center gap-2">
              <p className="text-sm font-medium text-gray-800 truncate">{email}</p>
              <span className="text-[10px] font-medium text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full shrink-0">Verified</span>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <Phone className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => onEditChange('phone', e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2.5 border-2 border-orange-200 rounded-xl text-sm text-gray-800 bg-orange-50/50 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white transition-all"
                placeholder="Enter phone number"
              />
            ) : (
              <p className="text-sm font-medium text-gray-800 mt-1.5">
                {phone || <span className="text-gray-400 font-normal italic">Not provided</span>}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
