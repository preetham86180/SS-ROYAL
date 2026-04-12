"use client";

import Link from "next/link";

// City data with real Unsplash thumbnail images
const CITIES = [
  {
    name: "Mumbai",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&q=80",
  },
  {
    name: "Delhi",
    img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=120&q=80",
  },
  {
    name: "Bengaluru",
    img: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=120&q=80",
  },
  {
    name: "Hyderabad",
    img: "https://images.unsplash.com/photo-1572445271230-a78bc5e7af6f?w=120&q=80",
  },
  {
    name: "Chennai",
    img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=120&q=80",
  },
  {
    name: "Pune",
    img: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=120&q=80",
  },
  {
    name: "Kolkata",
    img: "https://images.unsplash.com/photo-1558618047-3c8c76ca1d5e?w=120&q=80",
  },
  {
    name: "Ahmedabad",
    img: "https://images.unsplash.com/photo-1624293952627-c5b79f06f13e?w=120&q=80",
  },
];

interface CitySelectorProps {
  /** counts keyed by lowercase city name */
  propertyCounts: Record<string, number>;
}

export function CitySelector({ propertyCounts }: CitySelectorProps) {
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
              Find Properties in These Cities
            </h2>
            <p className="text-gray-500 text-sm">
              Browse our wide selection of properties across India's top cities.
            </p>
          </div>
          <Link
            href="/"
            className="self-start sm:self-center px-6 py-2.5 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-semibold transition-colors shadow-md whitespace-nowrap"
          >
            See All Properties
          </Link>
        </div>

        {/* City grid – 4 cols on lg, 2 on sm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CITIES.map((city) => {
            const count =
              propertyCounts[city.name.toLowerCase()] ??
              propertyCounts[city.name] ??
              0;
            return (
              <Link
                key={city.name}
                href={`/?location=${encodeURIComponent(city.name)}`}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
              >
                {/* City thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={city.img}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                {/* City info */}
                <div>
                  <p className="font-semibold text-gray-900 text-sm leading-tight">
                    {city.name}
                  </p>
                  <p className="text-[#6366F1] text-xs font-medium mt-0.5">
                    {count} {count === 1 ? "Property" : "Properties"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
