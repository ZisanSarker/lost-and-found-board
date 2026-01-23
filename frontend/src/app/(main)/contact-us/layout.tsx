import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Lost & Found Board team',
};

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
