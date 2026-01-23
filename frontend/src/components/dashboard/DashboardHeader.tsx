import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent animate-pulse">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your lost and found items</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link
            href="/repost/lost"
            className="btn-responsive bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Report Lost Item</span>
            <span className="sm:hidden">Lost Item</span>
          </Link>
          <Link
            href="/repost/found"
            className="btn-responsive border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-700 transition-all duration-300 flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Report Found Item</span>
            <span className="sm:hidden">Found Item</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
