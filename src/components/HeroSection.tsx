"use client";

import { motion } from "framer-motion";
import { AnimatedBackground } from "./AnimatedBackground";

export function HeroSection() {
  const titleWords = ["Space", "For", "Life"];

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden w-full">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80')] bg-cover bg-center" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0B1120]/95 via-[#0B1120]/80 to-[#0B1120]/40" />
      <div className="absolute inset-0 z-0 bg-blue-900/20 mix-blend-overlay" />
      
      {/* Animated Glowing Background Effect */}
      <AnimatedBackground />

      {/* Giant Background Watermark Text */}
      <motion.div 
        className="absolute top-[20%] left-0 w-full overflow-hidden pointer-events-none z-0 select-none opacity-10 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <h2 className="text-[120px] sm:text-[180px] md:text-[250px] font-black text-transparent bg-clip-text whitespace-nowrap" style={{ WebkitTextStroke: '3px rgba(255,255,255,0.8)' }}>
          SS ROYAL
        </h2>
      </motion.div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* Top Small Text */}
        <motion.div 
          className="mb-6 flex items-center gap-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase">Your Luxury Residence</span>
          <div className="h-px w-12 bg-white/30 hidden sm:block"></div>
        </motion.div>

        {/* Main Headlines */}
        <div className="max-w-4xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tight text-white mb-6 leading-[1.05] flex flex-wrap gap-x-4">
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.15, ease: [0.2, 0.65, 0.3, 0.9] }}
                className="block"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Over 1 million+ homes for sale available on the website, we can match you with a house you will want to call home.
          </motion.p>
          <motion.button 
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-10 py-4 rounded-full font-medium text-lg transition-transform hover:-translate-y-0.5 shadow-[0_0_40px_rgba(99,102,241,0.4)] hoverable"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Properties
          </motion.button>
        </div>
      </div>

      {/* Circular Agent Image */}
      <motion.div 
        className="hidden lg:block absolute right-[8%] top-[55%] -translate-y-1/2 z-20 cursor-pointer hoverable"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.8, type: "spring", stiffness: 50 }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="relative group">
          <div className="w-[300px] h-[300px] rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 border border-white/10 group-hover:border-white/30 transition-colors">
            <img 
              src="/agent.jpg" 
              alt="Real Estate Agent" 
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0B1120] shadow-2xl z-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
