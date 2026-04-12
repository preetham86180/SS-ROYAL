"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bed, Bath, Square, MapPin } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
}

export function PropertyCard({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
}: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl"
    >
      <Link href={`/properties/${id}`} className="block absolute inset-0 z-10">
        <span className="sr-only">View {title}</span>
      </Link>

      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        <Image
          src={imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur py-1 px-3 rounded-full text-brand-600 font-semibold shadow-sm">
          ₹{price.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1 inline" />
          <span className="line-clamp-1">{location}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 text-gray-600 text-sm font-medium">
          <div className="flex items-center gap-1.5 flex-col lg:flex-row text-center lg:text-left">
            <Bed size={18} className="text-brand-500" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 flex-col lg:flex-row text-center lg:text-left">
            <Bath size={18} className="text-brand-500" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 flex-col lg:flex-row text-center lg:text-left">
            <Square size={18} className="text-brand-500" />
            <span>{area} sqft</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
