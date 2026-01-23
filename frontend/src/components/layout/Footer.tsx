import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-orange-100 text-orange-900 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container-responsive">
        <div className="flex flex-col justify-center h-28 sm:h-32 gap-3">
          {/* Top row: links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link href="/terms" className="text-orange-800/80 hover:text-orange-600 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-orange-800/80 hover:text-orange-600 transition-colors">
              Privacy
            </Link>
            <Link href="/contact-us" className="text-orange-800/80 hover:text-orange-600 transition-colors">
              Contact
            </Link>
            <Link href="/help-support" className="text-orange-800/80 hover:text-orange-600 transition-colors">
              Help
            </Link>
          </div>
          {/* Bottom row: copyright */}
          <p className="text-center text-xs sm:text-sm text-orange-800/60">
            &copy; {currentYear} Lost & Found Board. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
