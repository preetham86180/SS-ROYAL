import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, LayoutDashboard, PlusCircle, Globe } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2 text-brand-600">
            <Building2 size={24} />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-gray-900 leading-none">
                SS ROYAL Admin
              </span>
              <span className="text-[10px] font-semibold text-gray-500 tracking-widest mt-0.5">
                PROPERTIES & DEVELOPERS
              </span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LayoutDashboard size={20} className="text-gray-500" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            href="/admin/new"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <PlusCircle size={20} className="text-gray-500" />
            <span className="font-medium">New Listing</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Globe size={20} />
            <span className="font-medium">View Live Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
