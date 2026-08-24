"use client";
import Image from "next/image";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 48, showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          y: [0, -3, 0],
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt="SS Royal Logo"
          fill
          className="object-contain drop-shadow-md"
          priority
        />
      </motion.div>
      {showText && (
        <div className="flex flex-col ml-1">
          <span className="font-display font-bold tracking-tight text-current leading-none mb-0.5" style={{ fontSize: size * 0.45 }}>
            SS ROYAL
          </span>
          <span className="font-semibold text-current opacity-80 tracking-[0.2em]" style={{ fontSize: size * 0.2 }}>
            SOLUTIONS OPC PVT. LTD.
          </span>
        </div>
      )}
    </div>
  );
}
