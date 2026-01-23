'use client';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm sm:text-base max-w-md">{description}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="btn-responsive bg-orange-600 text-white hover:bg-orange-700 rounded-lg mt-2"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
