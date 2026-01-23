import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a new Lost & Found Board account',
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
