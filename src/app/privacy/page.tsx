import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navigation />
      <main className="flex-1 w-full bg-gray-50 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl bg-white p-8 md:p-12 shadow-sm rounded-2xl border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-brand max-w-none text-gray-600">
            <p className="mb-6"><strong>Effective Date:</strong> January 1, 2026</p>
            
            <p className="mb-6">
              Welcome to SS Royal Properties & Developers ("we", "us", or "our"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Important Information and Who We Are</h2>
            <p className="mb-6">
              This privacy policy aims to give you information on how SS Royal collects and processes your personal data through your use of this website, including any data you may provide through this website when you sign up to our newsletter, purchase a product or service, or take part in a competition.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. The Data We Collect About You</h2>
            <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Identity Data:</strong> includes first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
              <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Financial Data:</strong> includes bank account and payment card details (processed securely via our payment gateway partners like Razorpay).</li>
              <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Personal Data</h2>
            <p className="mb-6">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              <br/><br/>
              - Where we need to perform the contract we are about to enter into or have entered into with you.<br/>
              - Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.<br/>
              - Where we need to comply with a legal obligation.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Data Security</h2>
            <p className="mb-6">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Details</h2>
            <p className="mb-6">
              If you have any questions about this privacy policy or our privacy practices, please contact us in the following ways:<br/>
              <strong>Email address:</strong> contact@ssroyal.com<br/>
              <strong>Postal address:</strong> 123 Luxury Avenue, Prestige Park, Downtown Business District, Metropolis - 500001
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
