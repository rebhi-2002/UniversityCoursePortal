import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats course schedules into a readable string
 * 
 * @param schedules An array of schedule objects with dayOfWeek, startTime, and endTime properties
 * @returns A formatted string like "Mon, Wed, Fri • 9:00 AM - 10:30 AM"
 */
export function formatSchedule(schedules?: Array<{
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  location: string;
}>) {
  if (!schedules || schedules.length === 0) return "Schedule not available";
  
  const daysMap: Record<string, string> = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun"
  };
  
  const days = schedules.map(s => daysMap[s.dayOfWeek.toLowerCase()] || s.dayOfWeek);
  return `${days.join(", ")} • ${schedules[0].startTime} - ${schedules[0].endTime}`;
}
