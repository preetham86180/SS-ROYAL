import Link from "next/link";
import { revalidatePath } from "next/cache";
import { CheckCircle, MapPin, IndianRupee, Trash2, User, Phone, Mail, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ─── Server Actions ───────────────────────────────────────────────────────────

async function approveProperty(id: string) {
  "use server";
  await prisma.property.update({
    where: { id },
    data: { isApproved: true },
  });
  revalidatePath("/admin/pending");
  revalidatePath("/admin");
  revalidatePath("/properties");
  revalidatePath("/");
}

async function deleteProperty(id: string) {
  "use server";
  await prisma.property.delete({ where: { id } });
  revalidatePath("/admin/pending");
}

export default async function PendingPropertiesPage() {
  const properties = await prisma.property.findMany({
    where: { isApproved: false },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
          Pending Submissions
        </h1>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {properties.length} propert{properties.length === 1 ? "y" : "ies"} waiting for approval.
      </p>

      {/* ─── MOBILE: Card List ───────────────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {properties.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
            No pending submissions right now.
          </div>
        )}
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
            <p className="font-semibold text-gray-900 leading-snug line-clamp-2">
              {property.title}
            </p>
            
            <div className="bg-gray-50 p-3 rounded border border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2"><User size={12} className="text-gray-400"/> {property.ownerName || "Unknown"}</div>
              <div className="flex items-center gap-2"><Phone size={12} className="text-gray-400"/> {property.ownerPhone || "Unknown"}</div>
              <div className="flex items-center gap-2"><Mail size={12} className="text-gray-400"/> {property.ownerEmail || "Unknown"}</div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1"><MapPin size={13} className="text-gray-400" />{property.location}</span>
              <span className="flex items-center gap-1 font-medium text-gray-800"><IndianRupee size={13} className="text-gray-400" />{property.price.toLocaleString("en-IN")}</span>
            </div>

            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <Link href={`/admin/pending/${property.id}`} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
                <Eye size={12} /> View
              </Link>
              <form action={approveProperty.bind(null, property.id)} className="flex-1">
                <button type="submit" className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-white bg-green-500 hover:bg-green-600 text-xs font-semibold transition-colors">
                  <CheckCircle size={12} /> Approve
                </button>
              </form>
              <form action={deleteProperty.bind(null, property.id)} className="flex-1">
                <button type="submit" className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-red-500 bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors">
                  <Trash2 size={12} /> Reject
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* ─── DESKTOP: Table ──────────────────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="px-6 py-4 font-medium">Property Details</th>
              <th className="px-6 py-4 font-medium">Contact Info</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 mb-1">{property.title}</div>
                  <div className="text-sm text-gray-500 flex gap-4">
                    <span className="flex items-center gap-1"><MapPin size={12}/>{property.location}</span>
                    <span className="flex items-center gap-1 font-medium"><IndianRupee size={12}/>{property.price.toLocaleString("en-IN")}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">{property.ownerName || "Unknown"}</div>
                  <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                    <span>{property.ownerPhone || "-"}</span>
                    <span>{property.ownerEmail || "-"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/pending/${property.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-md border border-gray-200 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                      <Eye size={14} /> View
                    </Link>
                    <form action={approveProperty.bind(null, property.id)}>
                      <button type="submit" className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-green-500 text-white text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">
                        <CheckCircle size={14} /> Approve
                      </button>
                    </form>
                    <form action={deleteProperty.bind(null, property.id)}>
                      <button type="submit" className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 bg-white text-red-600 text-xs font-bold hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm">
                        <Trash2 size={13} /> Reject
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No pending submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
