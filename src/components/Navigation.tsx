"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Search, User, Grid } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "#", label: "About" },
    { href: "#", label: "Property" },
    { href: "#", label: "Pages" },
    { href: "#", label: "Blog" },
    { href: "#", label: "Contact" },
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-colors duration-300 ${scrolled ? 'bg-[#0B1120]/95 backdrop-blur-md shadow-lg' : 'bg-transparent border-b border-white/10'}`}>
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-white text-gray-900 p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
            <Building2 size={28} />
          </div>
          <div className="flex flex-col ml-1">
            <span className="font-display font-bold text-2xl tracking-tight text-white leading-none mb-0.5">
              SS ROYAL
            </span>
            <span className="text-[10px] font-semibold text-gray-300 tracking-[0.2em]">
              PROPERTIES & DEVELOPERS
            </span>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative text-[15px] font-medium transition-colors hover:text-white ${
                pathname === link.href ? "text-white" : "text-gray-300"
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 top-full mt-1.5 h-0.5 w-full bg-white rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-3 md:gap-5">
          <Link href="/admin" className="w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors">
             <Grid size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
}
