import Link from "next/link";
import { MapPin, Mail, Phone, Rss } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0B1120] border-t border-white/10 mt-auto text-gray-300 font-sans">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: Contact Us & About Us */}
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-[15px] tracking-wider uppercase mb-6">CONTACT US</h3>
              <p className="text-[13px] text-gray-400 mb-4">Get in touch with us</p>
              
              <ul className="space-y-4 mt-4">
                <li className="flex items-start gap-4 text-[13px] text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">123 Luxury Avenue, Prestige Park,<br/>Downtown Business District, Metropolis - 500001</span>
                </li>
                <li className="flex items-center gap-4 text-[13px] text-gray-400">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>Email: contact@ssroyal.com</span>
                </li>
                <li className="flex items-center gap-4 text-[13px] text-gray-400">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>Phone: +1 (555) 123-4567</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-white font-semibold text-[15px] tracking-wider uppercase mb-6">ABOUT US</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed text-justify">
                Entrepreneurs who wanted to bring something new and unique in the field of real estate. We have spent the last 10 years building an unprecedented level of knowledge and experience in residential property management. We have built a reputation for providing a professional, tailored, and caring management service to a wide range to fulfill every minute need of tenants and owners.
              </p>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="space-y-4 md:pl-8 lg:pl-16">
            <h3 className="text-white font-semibold text-[15px] tracking-wider uppercase mb-6">LINKS</h3>
            <ul className="space-y-3.5 text-[13px] text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Travel Expense Form</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">PMS Form</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tenant Form</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Property for sale</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Property for rent</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Residential Project</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Commercial Project</Link></li>
            </ul>
          </div>

          {/* Column 3: Facebook Posts */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-[15px] tracking-wider uppercase mb-6">FACEBOOK POSTS</h3>
            {/* Empty space as exactly shown in the image */}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/5 bg-[#0B1120]">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <p className="text-[11px] text-gray-500 leading-relaxed text-justify mb-8 max-w-full">
            Disclaimer: SS ROYAL PROPERTIES & DEVELOPERS is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Company shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Company in any manner.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-[13px] text-gray-500 font-medium">
              © 2026 SS ROYAL PROPERTIES & DEVELOPERS.
            </p>
            <div className="flex items-center gap-5 text-gray-500">
              <a href="#" className="hover:text-white transition-colors"><Rss className="w-[14px] h-[14px]" /></a>
              <a href="#" className="hover:text-white transition-colors"><Rss className="w-[14px] h-[14px]" /></a>
              <a href="#" className="hover:text-white transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
              <a href="#" className="hover:text-white transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
              <a href="#" className="hover:text-white transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
