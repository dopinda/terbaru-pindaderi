import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan kelas CSS dengan benar menggunakan clsx dan tailwind-merge
 * @param inputs - Array dari nilai kelas yang akan digabungkan
 * @returns String kelas CSS yang digabungkan
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
