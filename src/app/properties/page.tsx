import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { prisma } from "@/lib/prisma";
import { Building2, SlidersHorizontal } from "lucide-react";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "SALE", label: "For Sale" },
  { value: "SOLD", label: "Sold" },
  { value: "RENT", label: "For Rent" },
];

const BHK_OPTIONS = [1, 2, 3, 4];

export default async function PropertiesPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  // ── Build WHERE clause from filters ────────────────────────────
  const whereClause: any = {};

  const statusFilter =
    typeof searchParams.status === "string" ? searchParams.status : "";
  if (statusFilter) whereClause.status = statusFilter;

  const bhkFilter =
    typeof searchParams.bhk === "string" ? parseInt(searchParams.bhk) : null;
  if (bhkFilter) whereClause.bedrooms = bhkFilter;

  const locationFilter =
    typeof searchParams.location === "string" ? searchParams.location : "";
  if (locationFilter) whereClause.location = { contains: locationFilter };

  const sortParam =
    typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const orderBy =
    sortParam === "price_asc"
      ? { price: "asc" as const }
      : sortParam === "price_desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  // ── Fetch filtered properties ───────────────────────────────────
  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy,
  });

  // ── Fetch all for filter options ────────────────────────────────
  const allProperties = await prisma.property.findMany({
    select: { location: true, bedrooms: true },
  });
  const locations = Array.from(
    new Set(allProperties.map((p) => p.location).filter(Boolean))
  ).sort();

  const totalCount = await prisma.property.count();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50">
        {/* ── PAGE HEADER ─────────────────────────────────────────── */}
        <section className="bg-[#0B1120] pt-36 pb-16 relative overflow-hidden">
          {/* Subtle grid background */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-indigo-400" size={22} />
              <span className="text-indigo-400 text-sm font-semibold tracking-widest uppercase">
                All Listings
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                Properties
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Browse our complete collection of{" "}
              <span className="text-white font-medium">{totalCount}</span>{" "}
              premium properties — apartments, villas, plots &amp; more.
            </p>
          </div>
        </section>

        {/* ── FILTER BAR ──────────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-200 sticky top-[96px] z-30 shadow-sm">
          <div className="container mx-auto px-4">
            <form
              method="GET"
              action="/properties"
              className="flex flex-wrap items-center gap-3 py-3"
            >
              {/* Status filter */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <SlidersHorizontal size={15} className="text-gray-400" />
                <select
                  name="status"
                  defaultValue={statusFilter}
                  className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* BHK filter */}
              <select
                name="bhk"
                defaultValue={bhkFilter?.toString() ?? ""}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="">Any BHK</option>
                {BHK_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b} BHK
                  </option>
                ))}
              </select>

              {/* Location filter */}
              <select
                name="location"
                defaultValue={locationFilter}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                name="sort"
                defaultValue={sortParam}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price ↑ Low to High</option>
                <option value="price_desc">Price ↓ High to Low</option>
              </select>

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                Apply
              </button>

              {/* Clear filters */}
              {(statusFilter || bhkFilter || locationFilter) && (
                <a
                  href="/properties"
                  className="text-sm text-gray-500 hover:text-gray-800 underline transition-colors"
                >
                  Clear filters
                </a>
              )}

              {/* Result count */}
              <span className="ml-auto text-sm text-gray-500 hidden md:block">
                {properties.length} result{properties.length !== 1 ? "s" : ""}
                {statusFilter || bhkFilter || locationFilter
                  ? " (filtered)"
                  : ""}
              </span>
            </form>
          </div>
        </section>

        {/* ── PROPERTY GRID ───────────────────────────────────────── */}
        <section className="container mx-auto px-4 py-12">
          {properties.length > 0 ? (
            <>
              {/* Mobile result count */}
              <p className="text-sm text-gray-500 mb-6 md:hidden">
                {properties.length} result
                {properties.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Building2 size={36} className="text-gray-300" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No properties found
              </h2>
              <p className="text-gray-500 mb-6">
                {statusFilter || bhkFilter || locationFilter
                  ? "Try adjusting your filters."
                  : "No properties have been listed yet."}
              </p>
              {(statusFilter || bhkFilter || locationFilter) && (
                <a
                  href="/properties"
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Clear all filters
                </a>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
