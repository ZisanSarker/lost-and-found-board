'use client';
import { useRef } from 'react';
import { useUpload } from '@/hooks/useUpload';

interface ImageUploadProps {
  selectedImage: File | null;
  uploadedImageUrl: string | null;
  isUploading: boolean;
  onImageSelected: (file: File) => void;
  onImageRemoved: () => void;
  onUploadedImageRemoved: () => void;
}

export default function ImageUpload({
  selectedImage,
  uploadedImageUrl,
  isUploading,
  onImageSelected,
  onImageRemoved,
  onUploadedImageRemoved,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isValidImageFile, getReadableFileSize } = useUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidImageFile(file)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP) under 5MB.');
        return;
      }
      onImageSelected(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isUploading) {
    return (
      <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center bg-orange-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          <p className="text-sm text-gray-600">Uploading image...</p>
        </div>
      </div>
    );
  }

  if (uploadedImageUrl) {
    return (
      <div className="border-2 border-green-300 rounded-xl p-4 bg-green-50">
        <div className="flex flex-col items-center gap-3">
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="w-full max-h-48 object-cover rounded-lg"
          />
          <div className="flex items-center gap-2 text-green-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Image uploaded successfully</span>
          </div>
          <button
            type="button"
            onClick={onUploadedImageRemoved}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Remove Image
          </button>
        </div>
      </div>
    );
  }

  if (selectedImage) {
    return (
      <div className="border-2 border-orange-300 rounded-xl p-4 bg-orange-50">
        <div className="flex flex-col items-center gap-3">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="w-full max-h-48 object-cover rounded-lg"
          />
          <div className="text-sm text-gray-600">
            <p className="font-medium">{selectedImage.name}</p>
            <p>{getReadableFileSize(selectedImage.size)}</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onImageRemoved}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-sm text-orange-500 hover:text-orange-700 font-medium"
            >
              Change
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <button
          type="button"
          onClick={triggerFileInput}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          Choose Image
        </button>
        <p className="text-xs text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
