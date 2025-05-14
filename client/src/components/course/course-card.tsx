import React from "react";
import { Link } from "wouter";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: {
    id: number;
    code: string;
    title: string;
    instructor?: {
      firstName: string;
      lastName: string;
    };
    schedules?: {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      location: string;
    }[];
    enrollmentStatus?: "registered" | "waitlisted" | "dropped" | "open" | "closed" | "waitlist";
    enrollmentCount?: number;
    capacity?: number;
  };
  className?: string;
  showEnrollmentStatus?: boolean;
}

export function CourseCard({ course, className, showEnrollmentStatus = true }: CourseCardProps) {
  // Format days of week into readable format
  const formatDaysOfWeek = (schedules?: any[]) => {
    if (!schedules || schedules.length === 0) return "";
    
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
    return days.join(", ");
  };
  
  // Get status badge variant and text
  const getStatusBadge = () => {
    if (!course.enrollmentStatus) return null;
    
    const statusMap: Record<string, { variant: string; text: string }> = {
      registered: { variant: "success", text: "Registered" },
      waitlisted: { variant: "warning", text: "Waitlisted" },
      dropped: { variant: "danger", text: "Dropped" },
      open: { 
        variant: "success", 
        text: course.enrollmentCount !== undefined && course.capacity !== undefined
          ? `Open (${course.enrollmentCount}/${course.capacity})`
          : "Open"
      },
      waitlist: { variant: "warning", text: "Waitlist" },
      closed: { variant: "danger", text: "Closed" }
    };
    
    const status = statusMap[course.enrollmentStatus] || { variant: "secondary", text: course.enrollmentStatus };
    
    return (
      <Badge variant={status.variant as any}>
        {status.text}
      </Badge>
    );
  };

  return (
    <div 
      className={cn(
        "p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors",
        className
      )}
    >
      <Link href={`/courses/${course.id}`}>
        <a className="block">
          <div className="flex justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {course.code}: {course.title}
              </h3>
              {course.instructor && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Dr. {course.instructor.firstName} {course.instructor.lastName}
                </p>
              )}
            </div>
            {showEnrollmentStatus && getStatusBadge()}
          </div>
          
          {course.schedules && course.schedules.length > 0 && (
            <>
              <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3 mr-1" />
                <span>
                  {formatDaysOfWeek(course.schedules)} • {course.schedules[0].startTime} - {course.schedules[0].endTime}
                </span>
              </div>
              <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{course.schedules[0].location}</span>
              </div>
            </>
          )}
        </a>
      </Link>
    </div>
  );
}
