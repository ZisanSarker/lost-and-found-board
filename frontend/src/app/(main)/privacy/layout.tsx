import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we handle your data at Lost & Found Board',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
