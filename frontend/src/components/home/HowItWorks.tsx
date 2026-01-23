export default function HowItWorks() {
  return (
    <section className="w-full max-w-7xl mx-auto rounded-xl bg-white shadow-lg overflow-hidden">
      <div className="container-responsive py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-responsive-xl font-bold tracking-tight text-orange-600 mb-4 sm:mb-6">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-responsive-base text-gray-700 leading-relaxed">
            Our platform helps you post and find lost items with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1 */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 lg:p-8 h-full text-center flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-4 sm:mb-6 text-orange-500">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Create Lost or Found Post</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-auto leading-relaxed">
              Quickly create a post for your lost item or something you found with details and contact info.
            </p>
          </div>

          {/* Card 2 */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 lg:p-8 h-full text-center flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-4 sm:mb-6 text-orange-500">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0m8 0a4 4 0 00-8 0m8 0H4m16 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Browse Listings</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-auto leading-relaxed">
              Explore all lost and found items posted by users to help return or reclaim belongings.
            </p>
          </div>

          {/* Card 3 */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-6 lg:p-8 h-full text-center flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-4 sm:mb-6 text-orange-500">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l1.293 1.293a1 1 0 001.414 0L10 7l7 7m0 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m14 0l3-3" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">Connect via Contact Info</h3>
            <p className="text-sm sm:text-base text-gray-600 mt-auto leading-relaxed">
              Contact the person who lost or found the item using provided email or phone number.
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="hidden lg:block mt-12 lg:mt-16">
          <div className="bg-orange-50 rounded-lg p-6 lg:p-8">
            <div className="flex items-center justify-center gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm lg:text-base text-orange-700 font-medium">Free to use</span>
              </div>
              <div className="w-px h-4 bg-orange-300"></div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm lg:text-base text-orange-700 font-medium">Secure & Private</span>
              </div>
              <div className="w-px h-4 bg-orange-300"></div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm lg:text-base text-orange-700 font-medium">Instant notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
