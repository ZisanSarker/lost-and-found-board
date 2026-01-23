import { Mail, MessageCircle } from 'lucide-react';
import FaqAccordion from '@/components/help/FaqAccordion';

const faqItems = [
  {
    question: 'How do I report a lost item?',
    answer: 'To report a lost item, log in to your account and click the "Report Lost Item" button on the dashboard. Fill in the details including item description, location where it was lost, date, and any photos you may have. Your listing will be visible to other users who may have found your item.',
  },
  {
    question: 'How do I report a found item?',
    answer: 'If you have found an item, click "Report Found Item" on the dashboard. Provide a detailed description, the location where you found it, and upload photos if possible. The owner may contact you through the platform to arrange item retrieval.',
  },
  {
    question: 'How do I claim a found item?',
    answer: 'If you see a found item listing that matches something you lost, click on the listing and use the contact option to reach out to the finder. You may need to provide proof of ownership such as describing unique features of the item.',
  },
  {
    question: 'Is my personal information safe?',
    answer: 'Yes, we take privacy seriously. Your contact information is only shared when you choose to contact another user about a listing. We use encryption to protect your data and never sell your information to third parties.',
  },
  {
    question: 'Can I edit or delete my listing?',
    answer: 'Yes, you can edit or delete your listings at any time from the "My Listings" section in your dashboard. If your item has been found or returned, we encourage you to update or remove the listing.',
  },
  {
    question: 'How do I update my profile information?',
    answer: 'Go to your Profile page by clicking on your avatar or the profile option in the navigation menu. Click "Edit Profile" to update your information including username, phone number, location, and bio.',
  },
  {
    question: 'What should I do if I find a suspicious listing?',
    answer: 'If you encounter a listing that appears fraudulent or suspicious, please report it using the report button on the listing page. Our team will review the report and take appropriate action.',
  },
  {
    question: 'How do I delete my account?',
    answer: 'You can delete your account from the Profile page by clicking the "Delete Account" button. Please note that this action is permanent and cannot be undone. All your listings and data will be permanently removed.',
  },
];

export default function HelpSupportPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Help &amp; Support</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or reach out to our support team for assistance.
          </p>
        </div>

        {/* FAQ Section */}
        <FaqAccordion items={faqItems} />

        {/* Support Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Send us an email and we will respond within 24-48 hours.
            </p>
            <a
              href="mailto:support@lostandfoundboard.com"
              className="text-orange-600 font-medium hover:text-orange-700"
            >
              support@lostandfoundboard.com
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Community Help</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Connect with other users and share tips about finding lost items.
            </p>
            <span className="text-blue-600 font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}
