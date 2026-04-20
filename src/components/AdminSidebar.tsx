"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, PlusCircle, Globe, Menu, X, LogOut, Inbox } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const NavLinks = () => (
    <>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin' ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <LayoutDashboard size={20} className={pathname === '/admin' ? 'text-brand-600' : 'text-gray-500'} />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link
          href="/admin/new"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/new' ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <PlusCircle size={20} className={pathname === '/admin/new' ? 'text-brand-600' : 'text-gray-500'} />
          <span className="font-medium">New Listing</span>
        </Link>
        <Link
          href="/admin/pending"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === '/admin/pending' ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          <Inbox size={20} className={pathname === '/admin/pending' ? 'text-brand-600' : 'text-gray-500'} />
          <span className="font-medium">Pending Submissions</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Globe size={20} />
          <span className="font-medium">View Live Site</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header (Hamburger) */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 h-16 shrink-0 z-30">
        <Link href="/admin" className="flex items-center gap-2 text-brand-600">
          <Building2 size={24} />
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-gray-900 leading-none">
              SS ROYAL
            </span>
          </div>
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 text-gray-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                <Link href="/admin" className="flex items-center gap-2 text-brand-600">
                  <Building2 size={24} />
                  <span className="font-display font-bold text-lg text-gray-900 leading-none">Admin</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <NavLinks />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0 overflow-y-auto">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
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
        <NavLinks />
      </aside>
    </>
  );
}
