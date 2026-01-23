import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your lost and found item listings',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
