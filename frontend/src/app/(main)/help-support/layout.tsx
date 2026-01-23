import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Support',
  description: 'Get help with using Lost & Found Board',
};

export default function HelpSupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
