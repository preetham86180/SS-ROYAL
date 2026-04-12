import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function deleteProperty(id: string) {
  "use server";
  await prisma.property.delete({ where: { id } });
  revalidatePath("/admin");
}

export default async function AdminDashboard() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Dashboard
        </h1>
        <Link
          href="/admin/new"
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          Add Property
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 line-clamp-1">{property.title}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{property.location}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">₹{property.price.toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <form action={deleteProperty.bind(null, property.id)}>
                      <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No properties found. Click "Add Property" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
