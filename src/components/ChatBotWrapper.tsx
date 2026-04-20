"use client";

import { usePathname } from "next/navigation";
import { ChatBot } from "@/components/ChatBot";

export function ChatBotWrapper() {
  const pathname = usePathname();

  // Don't show chatbot on admin or login pages
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return <ChatBot />;
}
