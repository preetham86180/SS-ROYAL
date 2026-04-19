"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  status?: string | null;
  transaction?: string | null;
  isFeatured?: boolean;
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
  status,
  transaction,
  isFeatured,
}: PropertyCardProps) {
  // Determine transaction or fallback
  const displayTransaction = transaction || "Sale";
  // Determine status text for the data row (not the overlay)
  const displayStatusDetail = "Ready to Move"; // Mockup shows 'Immediately' etc, we could use propertyAge or just static for now

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group relative bg-white border border-gray-100 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <Link href={`/properties/${id}`} className="block absolute inset-0 z-10">
        <span className="sr-only">View {title}</span>
      </Link>

      {/* ── IMAGE SECTION ── */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        <Image
          src={imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured Tag */}
        {isFeatured && (
          <div className="absolute top-4 left-4 bg-brand-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 uppercase tracking-wider z-20">
            FEATURED
          </div>
        )}

        {/* Price Overlay (Bottom Left) */}
        <div className="absolute bottom-0 left-0 bg-black/60 text-white font-bold text-sm sm:text-base px-3 py-1.5 backdrop-blur-sm z-20">
          ₹ {price.toLocaleString("en-IN")}
        </div>

        {/* Status Overlay (Bottom Right) */}
        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs font-semibold px-3 py-1.5 backdrop-blur-sm uppercase tracking-wide z-20">
          {status ? `FOR ${status}` : "FOR SALE"}
        </div>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-display text-base sm:text-lg font-bold text-brand-600 mb-2 line-clamp-1">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-4">
          <MapPin size={14} className="mr-1.5 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-3 gap-2 mt-auto pb-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
              Area
            </span>
            <span className="text-xs font-medium text-gray-900">
              {area} Sq.Ft.
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
              Beds
            </span>
            <span className="text-xs font-medium text-gray-900">
              {bedrooms}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">
              Transaction
            </span>
            <span className="text-xs font-medium text-gray-900 line-clamp-1">
              {displayTransaction}
            </span>
          </div>
        </div>

        {/* Contact/View Button */}
        <button className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3 mt-auto transition-colors z-20 relative">
          View Details
        </button>
      </div>
    </motion.div>
  );
}
