import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CheckCircle, Trash2, ArrowLeft, User, Mail, Phone,
  MapPin, IndianRupee, BedDouble, Maximize2, Tag,
  Building2, Layers, Sofa, Calendar, Link2, FileText, Image as ImageIcon
} from "lucide-react";

export const dynamic = "force-dynamic";

async function approveProperty(id: string) {
  "use server";
  await prisma.property.update({ where: { id }, data: { isApproved: true } });
  revalidatePath("/admin/pending");
  revalidatePath("/admin");
  revalidatePath("/properties");
  revalidatePath("/");
  redirect("/admin/pending");
}

async function deleteProperty(id: string) {
  "use server";
  await prisma.property.delete({ where: { id } });
  revalidatePath("/admin/pending");
  redirect("/admin/pending");
}

export default async function PendingPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property || property.isApproved) notFound();

  const galleryImages: string[] = (() => {
    try { return JSON.parse(property.galleryImages || "[]"); }
    catch { return []; }
  })();

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number | null }) =>
    value ? (
      <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="text-gray-400 mt-0.5 shrink-0">{icon}</div>
        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">{label}</p>
          <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
        </div>
      </div>
    ) : null;

  return (
    <div>
      {/* Back link */}
      <Link href="/admin/pending" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Pending Submissions
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">{property.title}</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <MapPin size={13} /> {property.location}{property.city ? `, ${property.city}` : ""}
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-3 shrink-0">
          <form action={approveProperty.bind(null, property.id)}>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors shadow-sm">
              <CheckCircle size={16} /> Approve & List
            </button>
          </form>
          <form action={deleteProperty.bind(null, property.id)}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors">
              <Trash2 size={15} /> Reject
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Main details ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Thumbnail */}
          {property.imageUrl && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <img src={property.imageUrl} alt={property.title} className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ImageIcon size={15} /> Gallery Photos ({galleryImages.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((src, i) => (
                  <img key={i} src={src} alt={`Gallery ${i + 1}`} className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={15} /> Description
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{property.description}</p>
            </div>
          )}

          {/* Property Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Building2 size={15} /> Property Information
            </h2>
            <InfoRow icon={<Tag size={15}/>} label="Status" value={property.status} />
            <InfoRow icon={<Layers size={15}/>} label="Property Type" value={property.propertyType} />
            <InfoRow icon={<IndianRupee size={15}/>} label="Price" value={`₹${property.price.toLocaleString("en-IN")}`} />
            <InfoRow icon={<Maximize2 size={15}/>} label="Built-up Area" value={property.area ? `${property.area} sq.ft` : null} />
            <InfoRow icon={<Maximize2 size={15}/>} label="Plot Area" value={property.plotArea ? `${property.plotArea} sq.ft` : null} />
            <InfoRow icon={<BedDouble size={15}/>} label="Bedrooms" value={property.bedrooms ? `${property.bedrooms} BHK` : null} />
            <InfoRow icon={<Tag size={15}/>} label="Transaction" value={property.transaction} />
            <InfoRow icon={<Sofa size={15}/>} label="Furnishing" value={property.furnishing} />
            <InfoRow icon={<Calendar size={15}/>} label="Property Age" value={property.propertyAge} />
            {property.features && <InfoRow icon={<Tag size={15}/>} label="Amenities" value={property.features} />}
            {property.youtubeUrl && (
              <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                <Link2 size={15} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">YouTube Video</p>
                  <a href={property.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">{property.youtubeUrl}</a>
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin size={15} /> Location Information
            </h2>
            <InfoRow icon={<Building2 size={15}/>} label="Flat / Unit No." value={property.flatUnitNo} />
            <InfoRow icon={<Building2 size={15}/>} label="Building Name" value={property.buildingName} />
            <InfoRow icon={<MapPin size={15}/>} label="Street" value={property.street} />
            <InfoRow icon={<MapPin size={15}/>} label="Landmark" value={property.landmark} />
            <InfoRow icon={<MapPin size={15}/>} label="Pin Code" value={property.pinCode} />
            <InfoRow icon={<MapPin size={15}/>} label="Address" value={property.address} />
            <InfoRow icon={<MapPin size={15}/>} label="City" value={property.city} />
            <InfoRow icon={<MapPin size={15}/>} label="Location / Area" value={property.location} />
          </div>
        </div>

        {/* ── Right: Contact card + meta ── */}
        <div className="space-y-6">

          {/* Submitter contact card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={15} /> Submitted By
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <User size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{property.ownerName || "Unknown"}</p>
                  <p className="text-xs text-gray-400">Property Owner</p>
                </div>
              </div>
              {property.ownerPhone && (
                <a href={`tel:${property.ownerPhone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                  <Phone size={15} className="text-gray-400" /> {property.ownerPhone}
                </a>
              )}
              {property.ownerEmail && (
                <a href={`mailto:${property.ownerEmail}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600 transition-colors break-all">
                  <Mail size={15} className="text-gray-400" /> {property.ownerEmail}
                </a>
              )}
            </div>
          </div>

          {/* Quick summary card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-400">Quick Summary</h2>
            <p className="text-2xl font-bold mb-1">₹{property.price.toLocaleString("en-IN")}</p>
            <p className="text-sm text-gray-300 mb-4">{property.propertyType} · {property.status}</p>
            <div className="space-y-2 text-sm text-gray-300">
              {property.bedrooms && <p>🛏 {property.bedrooms} BHK</p>}
              {property.area && <p>📐 {property.area} sq.ft</p>}
              {property.city && <p>📍 {property.city}</p>}
              {property.furnishing && <p>🛋 {property.furnishing}</p>}
            </div>
            <div className="mt-5 pt-4 border-t border-gray-700 flex flex-col gap-2">
              <form action={approveProperty.bind(null, property.id)}>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors">
                  <CheckCircle size={15} /> Approve & List
                </button>
              </form>
              <form action={deleteProperty.bind(null, property.id)}>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 text-red-400 text-sm font-bold hover:bg-white/20 transition-colors">
                  <Trash2 size={14} /> Reject
                </button>
              </form>
            </div>
          </div>

          {/* Submitted at */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Submitted</p>
            <p className="text-sm text-gray-700 font-medium">
              {new Date(property.createdAt).toLocaleString("en-IN", {
                dateStyle: "long", timeStyle: "short"
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
