'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GithubCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get('data');
    const error = searchParams.get('error');

    if (error) {
      localStorage.setItem('github-auth-result', JSON.stringify({ error }));
    } else if (data) {
      localStorage.setItem('github-auth-result', data);
    }
    window.close();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
      </div>
    </div>
  );
}
