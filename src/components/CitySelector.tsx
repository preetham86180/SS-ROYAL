"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Plus } from "lucide-react";

// The full list of user-requested locations
const ALL_LOCATIONS = [
  "Indiranagar", "Tin Factory", "KR Puram", "Battarahalli", 
  "Ramamurthy Nagar", "Anandapura", "Hebbal", "Medahalli", 
  "Avalahalli", "Hoskote", "Narsapura", "Kolar", 
  "Devanahalli", "Chikkaballapur", "Doddaballapur", "Whitefield", 
  "Kadugodi", "Budigere Cross", "Mahadevpura", "Narayanapura", 
  "Bagaluru", "Vemagal", "H Cross", "Chintamani"
].map(name => ({
  name,
  // Since we don't have distinct thumbnails for 24 specific local areas, we will use a generic clean architectural placeholder
  img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=120&q=80" 
}));

interface CitySelectorProps {
  /** counts keyed by lowercase city name */
  propertyCounts: Record<string, number>;
}

export function CitySelector({ propertyCounts }: CitySelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show first 7 locations, leave the 8th spot for the 'See More' button
  const visibleLocations = isExpanded ? ALL_LOCATIONS : ALL_LOCATIONS.slice(0, 7);

  return (
    <section className="bg-[#EEF2FF] py-16 px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-100/60 pointer-events-none" />
      <div className="absolute -right-8 bottom-0 w-80 h-80 rounded-full bg-indigo-100/40 pointer-events-none" />

      <div className="container mx-auto relative z-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Find Properties By Location
            </h2>
            <p className="text-gray-500 text-sm">
              Explore listings across prime neighborhoods and surrounding regions.
            </p>
          </div>
          <Link
            href="/"
            className="self-start sm:self-center px-6 py-2.5 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-semibold transition-colors shadow-md whitespace-nowrap"
          >
            See All Properties
          </Link>
        </div>

        {/* Location grid – 4 cols on lg, 2 on sm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleLocations.map((loc) => {
            const count =
              propertyCounts[loc.name.toLowerCase()] ??
              propertyCounts[loc.name] ??
              0;
            return (
              <Link
                key={loc.name}
                href={`/?location=${encodeURIComponent(loc.name)}`}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-indigo-50 flex items-center justify-center text-indigo-300 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={loc.img}
                    alt={loc.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
                {/* City info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {loc.name}
                  </p>
                  <p className="text-[#6366F1] text-xs font-medium mt-0.5">
                    {count} {count === 1 ? "Property" : "Properties"}
                  </p>
                </div>
              </Link>
            );
          })}

          {/* See more locations button slot */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center justify-center gap-3 bg-indigo-100/50 border border-indigo-200 border-dashed rounded-xl px-4 py-3 shadow-sm hover:bg-indigo-100 hover:border-indigo-300 hover:-translate-y-0.5 transition-all group cursor-pointer text-left"
            >
              <div className="w-14 h-14 rounded-lg bg-indigo-200/50 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <Plus size={24} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-indigo-900 text-sm leading-tight">
                  17 More
                </p>
                <p className="text-indigo-600/80 text-xs font-medium mt-0.5">
                  View full list
                </p>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
