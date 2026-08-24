"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Phone, Mail, MapPin, Send, CheckCircle2, Circle } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="w-full bg-[#fcfcfc] font-sans pt-32 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-[40px] font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-gray-500 font-medium">Any question or remarks? Just write us a message!</p>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.05)] p-2.5 flex flex-col lg:flex-row gap-6 mx-auto w-full mb-24 relative z-10">
            
            {/* Left Panel */}
            <div className="bg-[#111827] text-white rounded-lg p-10 flex flex-col lg:w-[400px] relative overflow-hidden flex-shrink-0">
              <h2 className="text-[28px] font-semibold mb-2 relative z-10">Contact Information</h2>
              <p className="text-gray-400 text-sm mb-20 relative z-10">Say something to start a live chat!</p>

              <div className="space-y-10 flex-1 relative z-10">
                <div className="flex items-center gap-6">
                  <Phone className="w-6 h-6 text-white" />
                  <span className="text-[15px]">+1012 3456 789</span>
                </div>
                <div className="flex items-center gap-6">
                  <Mail className="w-6 h-6 text-white" />
                  <span className="text-[15px]">admin@ssroyalproperties.in</span>
                </div>
                <div className="flex items-start gap-6">
                  <MapPin className="w-6 h-6 text-white mt-1 shrink-0" />
                  <span className="text-[15px] leading-relaxed max-w-[200px]">
                    132 Dartmouth Street Boston, Massachusetts 02156 United States
                  </span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4 mt-20 relative z-10">
                <a href="#" className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>

              {/* Decorative Circles */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full pointer-events-none"></div>
            </div>

            {/* Right Panel (Form) */}
            <div className="p-8 lg:p-12 flex-1 relative">
              <form className="flex flex-col h-full" onSubmit={(e) => e.preventDefault()}>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 mb-12">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="border-b border-gray-300 pb-2 focus:outline-none focus:border-black text-gray-900 bg-transparent placeholder:text-gray-900"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="border-b border-gray-300 pb-2 focus:outline-none focus:border-black text-gray-900 bg-transparent placeholder:text-gray-900"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500">Email</label>
                    <input 
                      type="email" 
                      className="border-b border-gray-300 pb-2 focus:outline-none focus:border-black text-gray-900 bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 012 3456 789"
                      className="border-b border-gray-300 pb-2 focus:outline-none focus:border-black text-gray-900 bg-transparent placeholder:text-gray-900"
                    />
                  </div>
                </div>

                <div className="mb-12">
                  <p className="text-sm font-semibold text-gray-900 mb-4">Select Subject?</p>
                  <div className="flex flex-wrap gap-6">
                    {/* Radio Options */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4">
                        <CheckCircle2 className="w-4 h-4 text-black absolute" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">General Inquiry</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4">
                        <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400 absolute" />
                      </div>
                      <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">General Inquiry</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4">
                        <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400 absolute" />
                      </div>
                      <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">General Inquiry</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-4 h-4">
                        <Circle className="w-4 h-4 text-gray-300 group-hover:text-gray-400 absolute" />
                      </div>
                      <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">General Inquiry</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-12">
                  <label className="text-xs font-semibold text-gray-500">Message</label>
                  <input 
                    type="text" 
                    placeholder="Write your message.."
                    className="border-b border-gray-300 pb-2 focus:outline-none focus:border-black text-gray-900 bg-transparent placeholder:text-gray-400"
                  />
                </div>

                <div className="flex justify-end mt-auto">
                  <button type="button" className="bg-[#0057FF] hover:bg-blue-700 text-white px-10 py-3.5 rounded-md font-medium text-sm transition-colors shadow-lg">
                    Send Message
                  </button>
                </div>
                
                {/* Decorative plane or element behind button (placeholder via CSS) */}
                <div className="absolute right-0 bottom-[-50px] w-32 h-32 opacity-10 pointer-events-none select-none">
                  {/* Decorative shape resembling paper plane path could go here */}
                </div>

              </form>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="relative rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center mb-12 shadow-2xl">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 z-0 bg-black/60" />
            
            <div className="relative z-10 text-center px-6 py-16 max-w-2xl mx-auto w-full">
              <h2 className="text-3xl md:text-[32px] font-bold text-white mb-4">Sign up to our newsletter</h2>
              <p className="text-gray-300 text-[15px] mb-8 font-medium">Reciev latest news, update, and many other things every week.</p>
              
              <div className="relative max-w-[450px] mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter Your email address"
                  className="w-full bg-white rounded-full py-4 pl-6 pr-16 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xl"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 w-[42px] bg-[#0057FF] hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors">
                  <Send className="w-4 h-4 ml-[-2px] mt-[2px] transform -rotate-12" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
