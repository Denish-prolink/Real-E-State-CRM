import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("blob:") || url.startsWith("data:") || url.startsWith("http:") || url.startsWith("https:")) {
    return url;
  }
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};
