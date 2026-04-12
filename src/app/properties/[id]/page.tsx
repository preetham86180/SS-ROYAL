import { notFound } from "next/navigation";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Bed, Bath, Square, MapPin, CheckCircle2 } from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    notFound();
  }

  const features = property.features?.split(",").map(f => f.trim()).filter(Boolean) || [];
  const gallery: string[] = property.galleryImages ? JSON.parse(property.galleryImages) : [];

  return (
    <>
      <Navigation />
      <main className="flex-1 bg-white">
        {/* Hero Section */}
        <div className="relative w-full h-[50vh] md:h-[60vh] bg-gray-100">
          <Image
            src={property.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600"}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-full">
            <div className="container mx-auto px-4 pb-8 md:pb-12 text-white">
              <div className="inline-flex items-center gap-1.5 bg-brand-600/90 backdrop-blur px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
                For Sale
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-display mb-2 drop-shadow-sm max-w-4xl">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-200 text-lg md:text-xl">
                <MapPin size={20} />
                <span>{property.location}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <section className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-wrap gap-6 md:gap-12 justify-between">
                <div className="text-center">
                  <span className="block text-gray-500 mb-1 text-sm">Price</span>
                  <span className="font-display text-2xl md:text-3xl font-bold text-brand-600">₹{property.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-px bg-gray-200 hidden md:block"></div>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="text-center">
                    <Bed className="text-gray-400 mx-auto mb-1" size={24} />
                    <span className="block font-semibold text-lg">{property.bedrooms}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Beds</span>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="text-center">
                    <Bath className="text-gray-400 mx-auto mb-1" size={24} />
                    <span className="block font-semibold text-lg">{property.bathrooms}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Baths</span>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="text-center">
                    <Square className="text-gray-400 mx-auto mb-1" size={24} />
                    <span className="block font-semibold text-lg">{property.area}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Sqft</span>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold font-display text-gray-900 mb-4">About this Property</h2>
                <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed">
                  {property.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </section>

              {features.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold font-display text-gray-900 mb-6">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="text-brand-500 shrink-0" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Photo Gallery */}
              {gallery.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold font-display text-gray-900 mb-6">Photo Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((src, idx) => (
                      <div key={idx} className="aspect-square relative overflow-hidden rounded-xl bg-gray-100 group">
                        <Image
                          src={src}
                          alt={`Gallery image ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Interested?</h3>
                <p className="text-gray-600 mb-6">Contact our agents to schedule a viewing or ask a question about this property.</p>
                <button className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-3 px-4 rounded-xl transition-colors">
                  Schedule Tour
                </button>
                <button className="w-full mt-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
