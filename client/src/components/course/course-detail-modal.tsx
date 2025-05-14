import React from "react";
import { BookOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatSchedule } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CourseDetailModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: () => void;
  onWaitlist: () => void;
  isEnrolling: boolean;
  isWaitlisting: boolean;
}

export function CourseDetailModal({
  course,
  isOpen,
  onClose,
  onEnroll,
  onWaitlist,
  isEnrolling,
  isWaitlisting
}: CourseDetailModalProps) {
  const isFull = (course.enrollmentCount || 0) >= course.capacity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100 mr-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-medium">
                {course.code}: {course.title}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {course.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 my-2">
          <div className="flex flex-col px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-md">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Instructor:</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'TBA'}
              </span>
            </div>
          </div>
          
          {course.schedules && course.schedules.length > 0 && (
            <div className="flex flex-col px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Schedule:</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {formatSchedule(course.schedules)}
                </span>
              </div>
            </div>
          )}
          
          {course.schedules && course.schedules.length > 0 && (
            <div className="flex flex-col px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-md">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Location:</span>
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {course.schedules[0].location}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-md">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Credits:</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">{course.credits}</span>
            </div>
          </div>
          
          <div className="flex flex-col px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-md">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Department:</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {course.department?.name || course.departmentId}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-md">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Delivery Mode:</span>
              <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                {course.deliveryMode}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-md">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Enrollment:</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {course.enrollmentCount || 0}/{course.capacity} ({course.capacity - (course.enrollmentCount || 0)} seats available)
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex space-x-2">
            {!isFull ? (
              <Button onClick={onEnroll} disabled={isEnrolling}>
                {isEnrolling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  "Register for Course"
                )}
              </Button>
            ) : (
              <Button onClick={onWaitlist} disabled={isWaitlisting}>
                {isWaitlisting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
