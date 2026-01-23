import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Lost & Found Board account',
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
