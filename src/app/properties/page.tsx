import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PropertiesClient } from "@/components/PropertiesClient";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PropertiesPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  // ── Build WHERE clause from filters ────────────────────────────
  const whereClause: any = { isApproved: true };

  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  if (q) {
    whereClause.OR = [
      { title: { contains: q } },
      { location: { contains: q } },
    ];
  }

  const statusFilter = typeof searchParams.status === "string" ? searchParams.status : "";
  if (statusFilter) whereClause.status = statusFilter;
  
  const propertyTypeFilter = typeof searchParams.propertyType === "string" ? searchParams.propertyType : "";
  if (propertyTypeFilter) whereClause.propertyType = propertyTypeFilter;

  const bhkFilter = typeof searchParams.bhk === "string" ? parseInt(searchParams.bhk) : null;
  if (bhkFilter) whereClause.bedrooms = bhkFilter;

  const locationFilter = typeof searchParams.location === "string" ? searchParams.location : "";
  if (locationFilter) whereClause.location = { contains: locationFilter };

  const transactionFilter = typeof searchParams.transaction === "string" ? searchParams.transaction : "";
  if (transactionFilter) whereClause.transaction = transactionFilter;

  const minPrice = typeof searchParams.minPrice === "string" && searchParams.minPrice ? parseFloat(searchParams.minPrice) : null;
  const maxPrice = typeof searchParams.maxPrice === "string" && searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : null;
  
  if (minPrice !== null || maxPrice !== null) {
      whereClause.price = {};
      if (minPrice !== null) whereClause.price.gte = minPrice;
      if (maxPrice !== null) whereClause.price.lte = maxPrice;
  }

  const sortParam = typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const orderBy =
    sortParam === "price_asc"
      ? { price: "asc" as const }
      : sortParam === "price_desc"
      ? { price: "desc" as const }
      : sortParam === "oldest"
      ? { createdAt: "asc" as const }
      : { createdAt: "desc" as const };

  // ── Fetch filtered properties ───────────────────────────────────
  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy,
  });

  // ── Fetch all for filter options ────────────────────────────────
  const allProperties = await prisma.property.findMany({
    select: { location: true, propertyType: true },
  });
  
  const locations = Array.from(
    new Set(allProperties.map((p) => p.location).filter(Boolean))
  ).sort();

  // ── Calculate Popular Categories ────────────────────────────────
  const typeCounts: Record<string, number> = {};
  allProperties.forEach(p => {
     if (p.propertyType) {
        typeCounts[p.propertyType] = (typeCounts[p.propertyType] || 0) + 1;
     }
  });
  const popularCategories = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5 categories

  // ── Fetch Recent Properties for Sidebar ─────────────────────────
  const recentProperties = await prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
  });

  const totalCount = await prisma.property.count();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#FDFDFD]">
        {/* Subtle background for the page */}
        <div className="pt-24 min-h-screen relative">
           
           {/* Top Title Banner */}
           <div className="bg-[#0B1120] py-8 md:py-10 relative overflow-hidden flex items-center justify-center min-h-[140px]">
               <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
               
               <div className="container mx-auto px-4 relative z-10 w-full flex flex-col md:flex-row items-center justify-between">
                 {/* Left spacer for perfect centering on desktop */}
                 <div className="hidden md:block w-48"></div>
                 
                 <div className="text-center mb-6 md:mb-0">
                   <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 tracking-wide uppercase">Properties</h1>
                   <div className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
                      <a href="/" className="hover:text-white transition-colors">Home</a>
                      <span>/</span>
                      <span className="text-brand-500">Properties</span>
                   </div>
                 </div>

                 {/* Top Right Action Button */}
                 <div className="w-full md:w-48 flex justify-center md:justify-end">
                    <a href="/submit" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 transform duration-300 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" className="lucide lucide-plus" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                      Submit Property
                    </a>
                 </div>
               </div>
           </div>

           {/* Client Layout Component */}
           <PropertiesClient
             initialProperties={properties}
             locations={locations}
             recentProperties={recentProperties}
             popularCategories={popularCategories}
             totalCount={totalCount}
           />
        </div>
      </main>
      <Footer />
    </>
  );
}
