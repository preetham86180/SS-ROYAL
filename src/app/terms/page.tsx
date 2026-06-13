import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <>
      <Navigation />
      <main className="flex-1 w-full bg-gray-50 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-4xl bg-white p-8 md:p-12 shadow-sm rounded-2xl border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="prose prose-brand max-w-none text-gray-600">
            <p className="mb-6"><strong>Last Updated:</strong> January 1, 2026</p>
            
            <p className="mb-6">
              These terms and conditions outline the rules and regulations for the use of SS Royal Properties & Developers's Website, located at https://ssroyalproperties.in/.
            </p>
            <p className="mb-6">
              By accessing this website we assume you accept these terms and conditions. Do not continue to use SS Royal Properties if you do not agree to take all of the terms and conditions stated on this page.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. Cookies</h2>
            <p className="mb-6">
              We employ the use of cookies. By accessing SS Royal Properties, you agreed to use cookies in agreement with the SS Royal Properties & Developers's Privacy Policy. Most interactive websites use cookies to let us retrieve the user's details for each visit.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. License</h2>
            <p className="mb-6">
              Unless otherwise stated, SS Royal Properties & Developers and/or its licensors own the intellectual property rights for all material on SS Royal Properties. All intellectual property rights are reserved. You may access this from SS Royal Properties for your own personal use subjected to restrictions set in these terms and conditions.
            </p>
            <p className="mb-4">You must not:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Republish material from SS Royal Properties</li>
              <li>Sell, rent or sub-license material from SS Royal Properties</li>
              <li>Reproduce, duplicate or copy material from SS Royal Properties</li>
              <li>Redistribute content from SS Royal Properties</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. Online Payments</h2>
            <p className="mb-6">
              Our website facilitates online payments for property rent, dues, and other services. By using our payment gateway (Razorpay), you agree to provide accurate and complete payment information. All payments are subject to verification and we reserve the right to cancel or refund transactions that are deemed suspicious or fraudulent. Receipts for successful payments will be sent to your registered email address.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. Disclaimer</h2>
            <p className="mb-6">
              SS ROYAL PROPERTIES & DEVELOPERS is only an intermediary offering its platform to advertise properties of Sellers for Customers/Buyers/Users coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. The Company shall neither be responsible nor liable to mediate or resolve any disputes.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
