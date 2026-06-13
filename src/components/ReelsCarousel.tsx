"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";

export interface Reel {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string; // e.g., YouTube embed URL
}

interface ReelsCarouselProps {
  reels: Reel[];
}

export function ReelsCarousel({ reels }: ReelsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // rough width of one card + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeVideo]);

  return (
    <div className="w-full relative">
      {/* Header & Navigation Arrows */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => scroll("left")}
          className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-colors shrink-0"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 text-center px-4">
          Latest Video Reels
        </h2>

        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 hover:bg-pink-100 transition-colors shrink-0"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 pt-4 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel) => (
          <motion.div
            key={reel.id}
            className="relative flex-shrink-0 w-[260px] md:w-[280px] aspect-[4/5] rounded-3xl overflow-hidden snap-center cursor-pointer group shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
            whileHover={{ y: -8 }}
            onClick={() => setActiveVideo(reel.videoUrl)}
          >
            <Image
              src={reel.thumbnail}
              alt={reel.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Subtle dark gradient at bottom for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            {/* Play Button */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] group-hover:bg-red-500 group-hover:scale-110 transition-all duration-300">
                <Play size={24} className="ml-1" fill="currentColor" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Popup Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 sm:p-8"
            onClick={() => setActiveVideo(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setActiveVideo(null)}
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
              <video
                src={activeVideo}
                className="absolute inset-0 w-full h-full object-contain"
                controls
                autoPlay
                playsInline
                loop
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
