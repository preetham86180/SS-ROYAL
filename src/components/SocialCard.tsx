"use client";

import React from "react";
import { motion } from "framer-motion";

interface SocialCardProps {
  platform: string;
  followers: string;
  buttonText: string;
  icon: React.ReactNode;
  url: string;
}

export function SocialCard({ platform, followers, buttonText, icon, url }: SocialCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl p-6 flex items-center justify-between shadow-[0_10px_40px_rgba(255,100,150,0.08)] hover:shadow-[0_15px_50px_rgba(255,100,150,0.15)] transition-all duration-300 border border-pink-50/50 hoverable w-full"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-gray-900 font-bold text-lg leading-tight">{platform}</h3>
          <p className="text-gray-400 text-sm">{followers}</p>
        </div>
      </div>
      <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold text-sm px-5 py-2 rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all pointer-events-none">
        {buttonText}
      </button>
    </motion.a>
  );
}
