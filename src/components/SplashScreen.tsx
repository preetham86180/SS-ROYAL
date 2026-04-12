"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2 } from "lucide-react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Disable scroll on body while splash is visible
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%", 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B1120] text-white"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                duration: 1, 
                ease: "backOut",
                delay: 0.2 
              }}
              className="bg-white text-gray-900 p-5 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <Building2 size={64} strokeWidth={1.5} />
            </motion.div>

            {/* Text Animation */}
            <div className="flex flex-col items-center overflow-hidden">
               <motion.span
                 initial={{ y: 50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                 className="font-display font-black text-5xl md:text-7xl tracking-tight text-white leading-none mb-2"
               >
                 SS ROYAL
               </motion.span>
               
               <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="h-0.5 bg-brand-500 mb-2"
               />
               
               <motion.span
                 initial={{ opacity: 0, letterSpacing: "0px" }}
                 animate={{ opacity: 1, letterSpacing: "6px" }}
                 transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                 className="text-[10px] md:text-[12px] font-semibold text-gray-400 uppercase mr-[-6px]"
               >
                 Properties & Developers
               </motion.span>
            </div>
          </div>

          {/* Luxury decorative elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 2 }}
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: '100px 100px'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
