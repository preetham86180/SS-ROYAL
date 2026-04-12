import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchWidget } from "@/components/SearchWidget";
import { CitySelector } from "@/components/CitySelector";
import { FeaturedSection } from "@/components/FeaturedSection";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  // Construct Prisma WHERE clause
  const whereClause: any = {};
  
  if (typeof searchParams.location === 'string') {
    whereClause.location = { equals: searchParams.location };
  }
  
  if (typeof searchParams.bhk === 'string') {
    whereClause.bedrooms = { equals: parseInt(searchParams.bhk) };
  }
  
  const minPrice = typeof searchParams.min === 'string' ? parseFloat(searchParams.min) : undefined;
  const maxPrice = typeof searchParams.max === 'string' ? parseFloat(searchParams.max) : undefined;
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};
    if (minPrice !== undefined) whereClause.price.gte = minPrice;
    if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
  }

  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  const featuredProperties = await prisma.property.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
  });

  // Calculate unique filters from the entire database (unfiltered) to populate dropdowns
  const allProperties = await prisma.property.findMany({ select: { location: true, bedrooms: true, price: true } });
  
  const locations = Array.from(new Set(allProperties.map(p => p.location))).filter(Boolean);
  const bhkOptions = Array.from(new Set(allProperties.map(p => p.bedrooms))).sort((a,b) => a - b);
  
  const dbMinPrice = allProperties.length > 0 ? Math.min(...allProperties.map(p => p.price)) : 0;
  const dbMaxPrice = allProperties.length > 0 ? Math.max(...allProperties.map(p => p.price)) : 10000;
  const priceRange = { min: dbMinPrice, max: dbMaxPrice };

  // Count properties per city for CitySelector
  const propertyCounts: Record<string, number> = {};
  for (const p of allProperties) {
    const key = p.location?.toLowerCase() ?? "";
    propertyCounts[key] = (propertyCounts[key] || 0) + 1;
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 w-full bg-[#0B1120]">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden w-full">
          {/* Background Image & Overlays */}
          <div 
            className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80')] bg-cover bg-center"
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0B1120]/95 via-[#0B1120]/80 to-[#0B1120]/40" />
          <div className="absolute inset-0 z-0 bg-blue-900/20 mix-blend-overlay" />
          
          {/* Giant Background Watermark Text */}
          <div className="absolute top-[20%] left-0 w-full overflow-hidden pointer-events-none z-0 select-none opacity-10 flex justify-center">
             <h2 className="text-[120px] sm:text-[180px] md:text-[250px] font-black text-transparent bg-clip-text whitespace-nowrap" style={{ WebkitTextStroke: '3px rgba(255,255,255,0.8)' }}>
                SS ROYAL
             </h2>
          </div>

          <div className="container relative z-10 mx-auto px-6 lg:px-12 pt-32 pb-24">
            
            {/* Top Small Text */}
            <div className="mb-6 flex items-center gap-4">
              <span className="text-[11px] font-bold tracking-[0.3em] text-white/80 uppercase">Your Luxury Residence</span>
              <div className="h-px w-12 bg-white/30 hidden sm:block"></div>
            </div>

            {/* Main Headlines */}
            <div className="max-w-4xl">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tight text-white mb-6 leading-[1.05]">
                Space For Life
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed font-medium">
                Over 1 million+ homes for sale available on the website, we can match you with a house you will want to call home.
              </p>
              <button className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-10 py-4 rounded-full font-medium text-lg transition-transform hover:-translate-y-0.5 shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                Explore Properties
              </button>
            </div>
          </div>
            


          {/* Circular Agent Image */}
          <div className="hidden lg:block absolute right-[8%] top-[55%] -translate-y-1/2 z-20 hover:scale-105 transition-transform duration-500 cursor-pointer">
              <div className="relative group">
                 <div className="w-[300px] h-[300px] rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 border border-white/10 group-hover:border-white/30 transition-colors">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" 
                      alt="Real Estate Agent" 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#0B1120] shadow-2xl z-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                 </div>
              </div>
          </div>
        </section>

        {/* FLOATING SEARCH WIDGET */}
        <SearchWidget 
          locations={locations} 
          bhkOptions={bhkOptions} 
          priceRange={priceRange} 
        />

        {/* CITY SELECTOR SECTION */}
        <CitySelector propertyCounts={propertyCounts} />

        {/* PROPERTY LISTINGS SECTION */}
        <section className="bg-gray-50 pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                Discover Your <span className="text-[#6366F1]">Dream Home</span>
              </h2>
              <p className="text-lg text-gray-600">
                Explore our curated selection of premium properties. Modern living spaces designed for exceptional comfort and style.
              </p>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
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
                  />
                ))}
              </div>
            ) : (
               <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
                 <h3 className="text-xl font-medium text-gray-900 mb-2">No properties listed yet</h3>
                 <p className="text-gray-500">Check back later or visit the admin dashboard to add listings.</p>
               </div>
            )}
          </div>
        </section>

        {/* FEATURED PROPERTIES SECTION */}
        <FeaturedSection properties={featuredProperties} />
      </main>
      <Footer />
    </>
  );
}
