"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true); // default true for SSR, we'll check properly below

  useEffect(() => {
    // Only run on desktop devices (don't show custom cursor on touch devices)
    if (typeof window !== "undefined") {
      const checkDesktop = () => window.innerWidth > 768 && !window.matchMedia("(pointer: coarse)").matches;
      setIsDesktop(checkDesktop());
      
      const updateMousePosition = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };

      const updateHoverState = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isHoverable = 
          target.tagName.toLowerCase() === 'a' ||
          target.tagName.toLowerCase() === 'button' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.hoverable') ||
          window.getComputedStyle(target).cursor === 'pointer';
          
        setIsHovering(!!isHoverable);
      };

      if (checkDesktop()) {
        window.addEventListener("mousemove", updateMousePosition);
        window.addEventListener("mouseover", updateHoverState);
        document.body.classList.add("custom-cursor-enabled");
      }

      return () => {
        window.removeEventListener("mousemove", updateMousePosition);
        window.removeEventListener("mouseover", updateHoverState);
        document.body.classList.remove("custom-cursor-enabled");
      };
    }
  }, []);

  if (!isDesktop) return null;

  return (
    <>
      {/* Small dot that follows exactly */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-brand-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      {/* Larger circle that trails and expands on hover */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] border-2 border-brand-400 mix-blend-difference"
        animate={{
          x: mousePosition.x - (isHovering ? 24 : 16),
          y: mousePosition.y - (isHovering ? 24 : 16),
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          backgroundColor: isHovering ? "rgba(14, 165, 233, 0.2)" : "rgba(14, 165, 233, 0)",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
      />
    </>
  );
}
