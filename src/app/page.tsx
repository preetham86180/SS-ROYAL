import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchWidget } from "@/components/SearchWidget";
import { CitySelector } from "@/components/CitySelector";
import { FeaturedSection } from "@/components/FeaturedSection";
import { EMICalculator } from "@/components/EMICalculator";
import { HeroSection } from "@/components/HeroSection";

import { prisma } from "@/lib/prisma";

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
    where: { isFeatured: true, isApproved: true },
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
        <HeroSection />

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
                    status={property.status}
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

        {/* EMI CALCULATOR SECTION */}
        <EMICalculator />
      </main>
      <Footer />
    </>
  );
}
