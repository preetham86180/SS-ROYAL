import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Star, MapPin, IndianRupee, PlusCircle, Trash2, Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ─── Server Actions ───────────────────────────────────────────────────────────

async function deleteProperty(id: string) {
  "use server";
  await prisma.property.delete({ where: { id } });
  revalidatePath("/admin");
}

async function setPropertyStatus(id: string, status: string) {
  "use server";
  await prisma.property.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

async function toggleFeatureProperty(id: string, currentStatus: boolean) {
  "use server";
  await prisma.property.update({
    where: { id },
    data: { isFeatured: !currentStatus },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

// ─── Status badge config ──────────────────────────────────────────────────────

type StatusKey = "SALE" | "SOLD" | "RENT";

const STATUS_CONFIG: Record<
  StatusKey,
  { label: string; active: string; inactive: string }
> = {
  SALE: {
    label: "Sale",
    active: "bg-green-500 text-white border-green-500 shadow-sm",
    inactive: "bg-white text-green-600 border-green-300 hover:bg-green-50",
  },
  SOLD: {
    label: "Sold",
    active: "bg-red-500 text-white border-red-500 shadow-sm",
    inactive: "bg-white text-red-500 border-red-300 hover:bg-red-50",
  },
  RENT: {
    label: "Rent",
    active: "bg-blue-500 text-white border-blue-500 shadow-sm",
    inactive: "bg-white text-blue-600 border-blue-300 hover:bg-blue-50",
  },
};

const STATUSES: StatusKey[] = ["SALE", "SOLD", "RENT"];

// ─── StatusButtons component (server-side forms) ──────────────────────────────

function StatusButtons({
  id,
  current,
  size = "sm",
}: {
  id: string;
  current: string | null;
  size?: "sm" | "xs";
}) {
  const pad = size === "xs" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs";
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STATUSES.map((s) => {
        const cfg = STATUS_CONFIG[s];
        const isActive = current === s;
        return (
          <form key={s} action={setPropertyStatus.bind(null, id, s)}>
            <button
              type="submit"
              className={`${pad} rounded-md border font-semibold tracking-wide transition-all ${
                isActive ? cfg.active : cfg.inactive
              }`}
              title={isActive ? `Status: ${cfg.label}` : `Mark as ${cfg.label}`}
            >
              {cfg.label.toUpperCase()}
            </button>
          </form>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDashboard() {
  const properties = await prisma.property.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900">
          Dashboard
        </h1>
        <Link
          href="/admin/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-medium transition-colors shadow-sm text-sm md:text-base"
        >
          <PlusCircle size={16} />
          <span>Add Property</span>
        </Link>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        {properties.length} propert{properties.length === 1 ? "y" : "ies"} listed
      </p>

      {/* ─── MOBILE: Card List ───────────────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {properties.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
            No properties found. Tap &quot;Add Property&quot; to create one.
          </div>
        )}
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3"
          >
            {/* Title + Featured */}
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-gray-900 leading-snug line-clamp-2 flex-1">
                {property.title}
              </p>
              <form
                action={toggleFeatureProperty.bind(
                  null,
                  property.id,
                  property.isFeatured
                )}
              >
                <button
                  type="submit"
                  className={`shrink-0 flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border transition-colors ${
                    property.isFeatured
                      ? "text-yellow-600 bg-yellow-50 border-yellow-300"
                      : "text-gray-400 bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  title={property.isFeatured ? "Unfeature" : "Feature"}
                >
                  <Star
                    size={11}
                    fill={property.isFeatured ? "currentColor" : "none"}
                  />
                  {property.isFeatured ? "Featured" : "Feature"}
                </button>
              </form>
            </div>

            {/* Location & Price */}
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-gray-400" />
                {property.location}
              </span>
              <span className="flex items-center gap-1 font-medium text-gray-800">
                <IndianRupee size={13} className="text-gray-400" />
                {property.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Status + Edit + Delete */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <StatusButtons id={property.id} current={property.status} size="xs" />
              <div className="flex gap-2">
                <Link
                  href={`/admin/edit/${property.id}`}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </Link>
                <form action={deleteProperty.bind(null, property.id)} className="flex-1">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-red-500 bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── DESKTOP: Table ──────────────────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Featured</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((property) => (
              <tr
                key={property.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 line-clamp-1">
                    {property.title}
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{property.location}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">
                  ₹{property.price.toLocaleString("en-IN")}
                </td>

                {/* Featured star */}
                <td className="px-6 py-4">
                  <form
                    action={toggleFeatureProperty.bind(
                      null,
                      property.id,
                      property.isFeatured
                    )}
                  >
                    <button
                      type="submit"
                      className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                        property.isFeatured
                          ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                          : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                      }`}
                      title={property.isFeatured ? "Unfeature" : "Feature"}
                    >
                      <Star
                        size={18}
                        fill={property.isFeatured ? "currentColor" : "none"}
                      />
                    </button>
                  </form>
                </td>

                {/* Status toggle buttons */}
                <td className="px-6 py-4">
                  <StatusButtons id={property.id} current={property.status} />
                </td>

                {/* Delete + Edit */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/edit/${property.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors"
                    >
                      <Pencil size={13} />
                      Edit
                    </Link>
                    <form action={deleteProperty.bind(null, property.id)}>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-500 bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No properties found. Click &quot;Add Property&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
