import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Items',
  description: 'Browse lost and found items in our community',
};

export default function ItemsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
