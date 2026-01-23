'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface AuthLottieProps {
  animationUrl: string;
  title: string;
  subtitle: string;
  highlights?: string[];
}

export default function AuthLottie({ animationUrl, title, subtitle, highlights }: AuthLottieProps) {
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(animationUrl)
      .then(res => res.json())
      .then(data => {
        setAnimationData(data);
        setTimeout(() => setIsLoaded(true), 100);
      })
      .catch(() => setAnimationData(null));
  }, [animationUrl]);

  return (
    <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col items-center justify-center p-12">
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,191,36,0.3)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(194,65,12,0.4)_0%,_transparent_60%)]" />

      {/* Animated floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-white/5 blur-xl animate-float" />
        <div className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full bg-amber-300/10 blur-2xl animate-float-delayed" />
        <div className="absolute top-[50%] left-[60%] w-40 h-40 rounded-full bg-orange-300/10 blur-xl animate-float-slow" />
      </div>

      {/* Lottie Animation */}
      <div className={`relative z-10 w-full max-w-sm transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop
            autoplay
            className="w-full h-auto max-h-[280px] drop-shadow-2xl"
          />
        ) : (
          <div className="w-48 h-48 mx-auto flex items-center justify-center">
            <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Vibrant text content */}
      <div className={`relative z-10 text-center mt-8 max-w-lg transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg leading-tight">
          {title}
        </h2>
        <p className="text-white/90 text-lg xl:text-xl max-w-md mx-auto leading-relaxed font-light mb-6">
          {subtitle}
        </p>

        {/* Feature highlights */}
        {highlights && highlights.length > 0 && (
          <div className={`flex flex-wrap justify-center gap-3 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {highlights.map((text, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-medium hover:bg-white/25 transition-all duration-300 hover:scale-105 cursor-default"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <svg className="w-3.5 h-3.5 text-amber-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {text}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Minimal bottom indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-8 h-1 rounded-full bg-white/60" />
        <div className="w-2 h-1 rounded-full bg-white/30" />
        <div className="w-2 h-1 rounded-full bg-white/30" />
      </div>

      {/* Custom keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.03); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite 1s; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite 2s; }
      `}</style>
    </div>
  );
}
