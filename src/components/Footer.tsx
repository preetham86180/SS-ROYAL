import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="text-brand-500" size={20} />
          <div className="flex flex-col">
            <span className="font-display font-medium text-lg text-gray-900 leading-none">
              SS ROYAL
            </span>
            <span className="text-[10px] font-semibold text-gray-500 tracking-widest mt-0.5">
              PROPERTIES & DEVELOPERS
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} SS ROYAL PROPERTIES & DEVELOPERS. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-brand-600 transition-colors">Privacy</Link>
          <Link href="/terms" className="text-sm text-gray-500 hover:text-brand-600 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
