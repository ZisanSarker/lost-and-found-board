import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'A community-powered platform for reporting lost and found items',
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
