'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for hash fragment (implicit flow returns token in hash)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const error = searchParams.get('error') || params.get('error');

    if (error) {
      localStorage.setItem('google-auth-result', JSON.stringify({ error }));
    } else if (accessToken) {
      localStorage.setItem('google-auth-result', JSON.stringify({ access_token: accessToken }));
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
