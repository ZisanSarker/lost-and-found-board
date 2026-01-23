'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { getErrorMessage } from '@/lib/api-error';
import AuthLottie from '@/components/auth/AuthLottie';

const signUpSchema = z.object({
  username: z.string().min(1, 'Username is required.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(3, 'Password must be at least 3 characters.'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  if (isAuthenticated) {
    router.push('/home');
    return null;
  }

  const handleGoogleLogin = () => {
    setSocialLoading('google');
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const redirectUri = `${window.location.origin}/auth/google-callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent('email profile')}`;
    const popup = window.open(googleAuthUrl, 'google-auth', `width=${width},height=${height},left=${left},top=${top}`);

    const interval = setInterval(async () => {
      const result = localStorage.getItem('google-auth-result');
      if (result || !popup || popup.closed) {
        clearInterval(interval);
        if (result) {
          localStorage.removeItem('google-auth-result');
          try {
            const parsed = JSON.parse(result);
            if (parsed.error) {
              toast.error(parsed.error);
              setSocialLoading(null);
            } else if (parsed.access_token) {
              const response = await api.post('/api/auth/google', { access_token: parsed.access_token });
              const { accessToken, user: authUser } = response.data?.data || response.data;
              login(accessToken, authUser);
              toast.success('Welcome!');
              router.push('/dashboard');
            }
          } catch {
            toast.error('Google login failed. Please try again.');
            setSocialLoading(null);
          }
        } else {
          setSocialLoading(null);
        }
      }
    }, 500);
  };

  const handleGithubLogin = () => {
    setSocialLoading('github');
    const width = 500, height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/github`,
      'github-auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const interval = setInterval(() => {
      const result = localStorage.getItem('github-auth-result');
      if (result || !popup || popup.closed) {
        clearInterval(interval);
        setSocialLoading(null);
        if (result) {
          localStorage.removeItem('github-auth-result');
          try {
            const parsed = JSON.parse(result);
            if (parsed.error) {
              toast.error(parsed.error);
            } else if (parsed.accessToken && parsed.user) {
              login(parsed.accessToken, parsed.user);
              toast.success('Welcome!');
              router.push('/dashboard');
            }
          } catch {
            toast.error('GitHub login failed. Please try again.');
          }
        }
      }
    }, 500);
  };

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/register', data);
      if (response.data?.data?.accessToken && response.data?.data?.user) {
        login(response.data.data.accessToken, response.data.data.user);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } else {
        toast.error(response.data?.message || 'Registration failed');
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Registration failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Lottie Animation */}
      <AuthLottie
        animationUrl="/animation_flying_man.json"
        title="Join Our Community"
        subtitle="Help reunite people with their lost belongings. Together we can make a difference."
        highlights={['Free to Join', 'Instant Alerts', 'Community Driven']}
      />

      {/* Right Side - Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-orange-50/30 px-6 sm:px-8 lg:px-14 py-8 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-50/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100/80 p-8 sm:p-10 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-gray-500 text-base">
                Fill in your details to get started
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 transition-colors group-focus-within:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    {...register('username')}
                    placeholder="John Doe"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-base bg-gray-50/50 transition-all duration-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:shadow-sm hover:border-gray-300 ${errors.username ? 'border-red-300 bg-red-50/30 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200'}`}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 animate-shake">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 transition-colors group-focus-within:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="you@example.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-base bg-gray-50/50 transition-all duration-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:shadow-sm hover:border-gray-300 ${errors.email ? 'border-red-300 bg-red-50/30 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200'}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 animate-shake">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Create a strong password"
                    className={`w-full pl-4 pr-12 py-3 border-2 rounded-xl text-base bg-gray-50/50 transition-all duration-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:shadow-sm hover:border-gray-300 ${errors.password ? 'border-red-300 bg-red-50/30 focus:ring-red-500/10 focus:border-red-500' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-orange-500 transition-all duration-200 hover:scale-110"
                  >
                    {!showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 animate-shake">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
                <p className="text-xs text-gray-400 pl-1">
                  Minimum 3 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-base font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md mt-2"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : null}
                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-400 font-medium">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={socialLoading === 'google' || isLoading}
                className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {socialLoading === 'google' ? (
                  <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={socialLoading === 'github' || isLoading}
                className="flex-1 flex items-center justify-center gap-2.5 py-3 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {socialLoading === 'github' ? (
                  <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                )}
                <span>GitHub</span>
              </button>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/sign-in" className="text-orange-600 hover:text-orange-700 font-semibold transition-all duration-200 hover:underline underline-offset-2">
                Sign In
              </Link>
            </p>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-orange-500 hover:text-orange-600 transition-colors hover:underline underline-offset-2">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-orange-500 hover:text-orange-600 transition-colors hover:underline underline-offset-2">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
