"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Crosshair, Home as HomeIcon, CircleDollarSign } from "lucide-react";

interface SearchWidgetProps {
  locations: string[];
  bhkOptions: number[];
  priceRange: { min: number; max: number };
}

export function SearchWidget({ locations, bhkOptions, priceRange }: SearchWidgetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"Rent" | "Buy" | "Sell">("Sell");
  
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [bhk, setBhk] = useState(searchParams.get("bhk") || "");

  // Dual slider state
  const defaultMin = priceRange.min || 0;
  const defaultMax = priceRange.max > priceRange.min ? priceRange.max : priceRange.min + 10000;
  
  const [minVal, setMinVal] = useState(defaultMin);
  const [maxVal, setMaxVal] = useState(defaultMax);
  
  const minPercent = ((minVal - defaultMin) / (defaultMax - defaultMin)) * 100;
  const maxPercent = ((maxVal - defaultMin) / (defaultMax - defaultMin)) * 100;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (bhk && bhk !== "any") params.set("bhk", bhk);
    if (minVal > defaultMin) params.set("min", minVal.toString());
    if (maxVal < defaultMax) params.set("max", maxVal.toString());
    
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 z-30">
      {/* Container - Translated up to overlap Hero */}
      <div className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden transform md:-translate-y-1/2 mt-12 md:mt-0">
        
        {/* Top Tabs */}
        <div className="flex bg-gray-50/50">
          {["Rent", "Buy", "Sell"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-10 py-5 text-[15px] font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-[#3B82F6] text-white" // Using bright blue based on user comment
                  : "bg-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Inputs Content */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between bg-white w-full">
          
          {/* Location */}
          <div className="flex-1 w-full relative group border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-8">
            <div className="flex items-center gap-2 mb-2 text-gray-900">
              <Crosshair size={18} className="text-gray-900 stroke-[2.5px]" />
              <span className="font-bold text-lg">Location</span>
            </div>
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="w-full bg-transparent text-gray-500 text-sm focus:outline-none cursor-pointer appearance-none outline-none"
            >
              <option value="" disabled hidden>Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc} className="text-gray-900">{loc}</option>
              ))}
            </select>
          </div>

          {/* BHK */}
          <div className="flex-1 w-full relative group border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:px-8">
            <div className="flex items-center gap-2 mb-2 text-gray-900">
              <HomeIcon size={18} className="text-gray-900 stroke-[2.5px]" />
              <span className="font-bold text-lg">BHK</span>
            </div>
            <select 
              value={bhk}
              onChange={(e) => setBhk(e.target.value)}
              className="w-full bg-transparent text-gray-500 text-sm focus:outline-none cursor-pointer appearance-none outline-none"
            >
              <option value="" disabled hidden>Select BHK</option>
              <option value="any" className="text-gray-900">Any</option>
              {bhkOptions.map((bhk, i) => (
                <option key={i} value={bhk} className="text-gray-900">{bhk} BHK</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex-1 w-full relative group pb-4 md:pb-0 md:px-8 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-1 text-gray-900">
              <div className="flex items-center gap-2">
                <CircleDollarSign size={18} className="text-gray-900 stroke-[2.5px]" />
                <span className="font-bold text-lg">Price</span>
              </div>
            </div>
            
            <div className="relative pt-1 pb-4">
              <div className="text-[13px] font-semibold text-gray-500 mb-2 whitespace-nowrap">
                ₹{minVal.toLocaleString('en-IN')} - ₹{maxVal.toLocaleString('en-IN')}
              </div>
              
              <div className="relative h-1.5 w-full bg-gray-200 rounded-full mt-2">
                {defaultMax > defaultMin && (
                  <div 
                    className="absolute top-0 h-1.5 bg-red-500 rounded-full" 
                    style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                  ></div>
                )}
                
                <input 
                  type="range" 
                  min={defaultMin} 
                  max={defaultMax} 
                  value={minVal} 
                  onChange={(e) => setMinVal(Math.min(Number(e.target.value), maxVal - 1))}
                  className="absolute top-0 left-0 w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none cursor-pointer"
                />
                <input 
                  type="range" 
                  min={defaultMin} 
                  max={defaultMax} 
                  value={maxVal} 
                  onChange={(e) => setMaxVal(Math.max(Number(e.target.value), minVal + 1))}
                  className="absolute top-0 left-0 w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto md:pl-2 flex-shrink-0 mt-4 md:mt-0">
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 active:scale-95"
            >
              <Search size={20} className="stroke-[2.5px]" />
              <span className="text-base">Search</span>
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
