'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';

export default function CtaSection() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <section className="w-full max-w-7xl mx-auto rounded-xl bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg overflow-hidden">
        <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
              <h2 className="text-responsive-xl font-bold leading-tight">
                {isAuthenticated ? 'Welcome to the Community!' : 'Join Our Community'}
              </h2>
              <p className="text-responsive-base text-orange-100 leading-relaxed">
                {isAuthenticated
                  ? 'Start posting lost or found items to help reunite people with their belongings.'
                  : 'Help reunite people with their lost belongings and make a positive impact in your community. Together, we can turn lost moments into found connections.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {!isAuthenticated && (
                  <button
                    onClick={() => router.push('/auth/sign-up')}
                    className="btn-responsive-lg bg-white text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                  >
                    Sign Up Now
                  </button>
                )}
                {isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={() => router.push('/repost/lost')}
                      className="btn-responsive-lg bg-white text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                    >
                      <span className="hidden sm:inline">Post Lost Item</span>
                      <span className="sm:hidden">Lost Item</span>
                    </button>
                    <button
                      onClick={() => router.push('/repost/found')}
                      className="btn-responsive-lg border border-white text-white hover:bg-white/10 transition-all duration-300 font-semibold"
                    >
                      <span className="hidden sm:inline">Post Found Item</span>
                      <span className="sm:hidden">Found Item</span>
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-responsive-lg border border-white text-white hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/cta_cover.jpg"
                  alt="Community members helping each other find lost items"
                  width={2000}
                  height={2000}
                  className="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {showModal && (
        <div className="modal-responsive" onClick={() => setShowModal(false)}>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="modal-content-responsive animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">About Lost & Found Board</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1 hover:bg-gray-100 rounded-full transition-colors">
                    &times;
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 text-gray-700">
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-orange-600 mb-2">What is Lost & Found Board?</h4>
                  <p className="text-sm sm:text-base leading-relaxed">
                    Lost & Found Board is a community-driven platform that connects people who have lost items with those who have found them.
                  </p>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-orange-600 mb-2">How It Works</h4>
                  <div className="space-y-3">
                    {['Post: Create a listing for items you\'ve lost or found.', 'Search: Browse through listings to find your lost items.', 'Connect: Contact the person who found your item.', 'Reunite: Celebrate as belongings are returned!'].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="bg-orange-100 text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">{i + 1}</span>
                        <p className="text-sm sm:text-base"><strong>{step.split(':')[0]}:</strong>{step.split(':').slice(1).join(':')}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-orange-600 mb-2">Key Features</h4>
                  <ul className="space-y-2">
                    {['Easy-to-use posting system for lost and found items', 'Photo uploads to help identify items', 'Location-based search to find items near you', 'Secure messaging system for safe communication', 'Community-driven approach with verified users'].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">&#10003;</span>
                        <span className="text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-orange-800 font-medium text-center text-sm sm:text-base">
                    Ready to make a difference? Sign up today and help build a more connected community!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
