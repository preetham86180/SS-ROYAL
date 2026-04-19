"use client";

import { useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { Building2, Search, Filter, SlidersHorizontal, ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  status: string | null;
  transaction: string | null;
  propertyType: string | null;
  isFeatured: boolean;
}

interface PropertiesClientProps {
  initialProperties: Property[];
  locations: string[];
  recentProperties: Property[];
  popularCategories: { type: string; count: number }[];
  totalCount: number;
}

export function PropertiesClient({
  initialProperties,
  locations,
  recentProperties,
  popularCategories,
  totalCount,
}: PropertiesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(20);

  // Read current filters from URL
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    status: searchParams.get("status") || "SALE", // Default to For Sale like in mockup
    propertyType: searchParams.get("propertyType") || "",
    location: searchParams.get("location") || "",
    bhk: searchParams.get("bhk") || "",
    transaction: searchParams.get("transaction") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const visibleProperties = initialProperties.slice(0, visibleCount);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/properties?${params.toString()}`);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* ── LEFT COLUMN: PROPERTIES GRID ── */}
      <div className="flex-1 lg:w-3/4">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 flex items-center justify-center text-white font-bold text-xl">
              <Building2 size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-brand-600 uppercase tracking-wide">
              Properties Listings
            </h2>
          </div>
          <div className="flex items-center gap-4 hidden sm:flex">
             <span className="text-sm text-gray-500 font-medium">Sort By:</span>
             <select className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 bg-white">
                <option value="newest">New To Old</option>
                <option value="oldest">Old To New</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
             </select>
          </div>
        </div>

        {initialProperties.length > 0 ? (
          <>
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  price={property.price}
                  location={property.location}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.area}
                  imageUrl={property.imageUrl}
                  status={property.status}
                  transaction={property.transaction}
                  isFeatured={property.isFeatured}
                />
              ))}
            </div>
            {visibleCount < initialProperties.length && (
              <div className="mt-12 flex justify-center border-t border-gray-200 pt-8">
                <button
                  onClick={handleShowMore}
                  className="bg-white border-2 border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Show More Options
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white border border-gray-100 rounded-xl">
            <Building2 size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No matching properties
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search filters to find what you're looking for.
            </p>
            <Link
              href="/properties"
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded font-medium transition-colors"
            >
              Clear All Filters
            </Link>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN: SIDEBAR ── */}
      <aside className="w-full lg:w-1/4 space-y-10">
        
        {/* Advanced Search Module */}
        <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
          <h3 className="font-display font-bold text-gray-900 text-lg uppercase tracking-wide mb-6 flex items-center gap-2">
            <span className="text-brand-600">ADVANCED</span> SEARCH
          </h3>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search query */}
            <div className="relative">
              <input
                type="text"
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
                placeholder="Search by keyword..."
                className="w-full border border-gray-300 rounded-md py-2.5 pl-3 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500 xl:pr-3"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-700 focus:border-brand-500"
            >
              <option value="">All Status</option>
              <option value="SALE">For Sale</option>
              <option value="RENT">For Rent</option>
            </select>

            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-700 focus:border-brand-500"
            >
              <option value="">All Types</option>
              {popularCategories.map(cat => (
                 <option key={cat.type} value={cat.type}>{cat.type}</option>
              ))}
            </select>

            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-700 focus:border-brand-500"
            >
              <option value="">Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="bhk"
                value={filters.bhk}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-700 focus:border-brand-500"
              >
                <option value="">BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>

              <select
                name="transaction"
                value={filters.transaction}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-700 focus:border-brand-500"
              >
                <option value="">Transaction</option>
                <option value="New">New</option>
                <option value="Resale">Resale</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                 type="number"
                 name="minPrice"
                 placeholder="Min Rs."
                 value={filters.minPrice}
                 onChange={handleFilterChange}
                 className="border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500"
              />
              <input
                 type="number"
                 name="maxPrice"
                 placeholder="Max Rs."
                 value={filters.maxPrice}
                 onChange={handleFilterChange}
                 className="border border-gray-300 rounded-md py-2.5 px-3 text-sm text-gray-700 placeholder-gray-400 focus:border-brand-500"
              />
            </div>
            
            {/* Show More Actions / Area Mock Slider */}
            <div className="pt-2">
               <div className="flex justify-between items-center text-xs text-brand-600 font-bold mb-4 cursor-pointer hover:underline">
                  <div className="flex items-center gap-1"><Filter size={12}/> Show More Options</div>
               </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 uppercase tracking-widest text-sm transition-colors rounded-sm"
            >
              SEARCH
            </button>
          </form>
        </div>

        {/* Popular Category */}
        <div>
          <h3 className="font-display font-bold text-gray-900 text-lg uppercase tracking-wide mb-4">
            <span className="text-gray-900 font-black">POPULAR</span> CATEGORY
          </h3>
          <div className="space-y-3 border-t border-gray-200 pt-4">
             {popularCategories.map(cat => (
                <div key={cat.type} className="flex items-center justify-between group cursor-pointer">
                   <Link href={`/properties?propertyType=${cat.type}`} className="text-sm text-gray-500 group-hover:text-brand-600 transition-colors">
                      {cat.type}
                   </Link>
                   <span className="text-xs text-gray-400">({cat.count})</span>
                </div>
             ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div>
          <h3 className="font-display font-bold text-gray-900 text-lg uppercase tracking-wide mb-4 pb-4 border-b border-gray-200">
            <span className="text-gray-900 font-black">RECENT</span> PROPERTIES
          </h3>
          <div className="space-y-4">
            {recentProperties.map(rp => (
               <Link href={`/properties/${rp.id}`} key={rp.id} className="flex gap-4 group">
                  <div className="w-24 h-16 shrink-0 relative overflow-hidden bg-gray-100 border border-gray-200">
                     <Image src={rp.imageUrl} alt={rp.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col justify-center">
                     <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
                       {rp.title}
                     </h4>
                     <p className="text-brand-600 font-bold text-sm mt-1">₹ {rp.price.toLocaleString("en-IN")}</p>
                  </div>
               </Link>
            ))}
          </div>
        </div>

        {/* Help Center Widget */}
        <div className="bg-gray-50 border border-gray-200 p-6 rounded relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-600/5 rounded-full -mr-10 -mt-10" />
          <h3 className="font-display font-bold text-gray-900 text-lg uppercase tracking-wide mb-6 relative">
            <span className="font-black">HELPING</span> CENTER
          </h3>
          <div className="space-y-6 relative">
             <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                   <MapPin size={16} />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-gray-900 mb-1">Address</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">
                      SS Royal Properties & Developers<br/>
                      Bengaluru, Karnataka
                   </p>
                </div>
             </div>
             <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                   <h4 className="text-sm font-bold text-gray-900 mb-1">Phone</h4>
                   <p className="text-xs text-gray-500 font-medium">
                     +91-9876543210
                   </p>
                </div>
             </div>
          </div>
        </div>

      </aside>
    </div>
  );
}
