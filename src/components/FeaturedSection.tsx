"use client";

import { motion } from "framer-motion";
import { BedDouble, Bath, Square, ChevronUp, ChevronDown } from "lucide-react";
import Image from "next/image";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
}

interface FeaturedSectionProps {
  properties: Property[];
}

export function FeaturedSection({ properties }: FeaturedSectionProps) {
  if (!properties || properties.length === 0) return null;

  return (
    <section className="bg-[#0b1120] text-white py-20 overflow-hidden relative">
      {/* Background Graphic/Grid Lines slightly visible */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Marquee Header */}
      <div className="relative flex overflow-x-hidden border-b border-white/10 pb-8 mb-12">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="flex whitespace-nowrap items-center gap-8 text-5xl md:text-7xl font-bold tracking-tight opacity-90"
        >
          {Array(10).fill("Featured Properties").map((text, i) => (
            <div key={i} className="flex items-center gap-8">
              <span>{text}</span>
              <span className="text-indigo-500">★</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex cursor-default">
        {/* Scroll Container */}
        <div className="flex gap-0 overflow-x-auto snap-x snap-mandatory hide-scrollbar flex-1 border-l border-white/10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {properties.map((property, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={property.id}
              className="snap-start shrink-0 w-full sm:w-[400px] border-r border-white/10 px-6 py-4 flex flex-col hover:bg-white/[0.02] transition-colors group"
            >
              {/* Title & Subtitle */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{property.title}</h3>
                <p className="text-gray-400 text-sm">{property.location}</p>
              </div>

              {/* Image Container with Badge */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                <Image
                  src={property.imageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute bottom-4 left-4 bg-[#6366F1] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  POPULAR
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-[#818CF8]">
                  ₹{property.price.toLocaleString("en-IN")} <span className="text-sm text-gray-500 font-normal">/Month</span>
                </p>
              </div>

              {/* Amenities */}
              <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <BedDouble size={16} className="text-indigo-400" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath size={16} className="text-indigo-400" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Square size={16} className="text-indigo-400" />
                  <span>{property.area} sqft</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right side navigation buttons (decorative or manual scroll) */}
        <div className="hidden md:flex flex-col justify-center items-center gap-4 px-6 border-r border-white/10">
          <button className="w-12 h-12 rounded-full bg-[#818CF8] flex items-center justify-center text-white hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <ChevronUp size={24} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <ChevronDown size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
