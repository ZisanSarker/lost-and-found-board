'use client';

export default function LoadingState({ text }: { text?: string }) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">{text || 'Loading...'}</p>
      </div>
    </div>
  );
}
