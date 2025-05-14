import React, { useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseDetailModal } from "./course-detail-modal";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatSchedule } from "@/lib/utils";

interface CourseTableProps {
  courses: any[];
  isLoading: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function CourseTable({ 
  courses, 
  isLoading, 
  totalPages = 1, 
  currentPage = 1, 
  onPageChange = () => {} 
}: CourseTableProps) {
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await apiRequest("POST", "/api/enrollments", { 
        courseId,
        status: "registered" 
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Successfully enrolled in course${selectedCourse ? `: ${selectedCourse.code}` : ''}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/student/enrollments"] });
      setModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Enrollment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Waitlist mutation
  const waitlistMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const res = await apiRequest("POST", "/api/enrollments", { 
        courseId,
        status: "waitlisted" 
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Added to waitlist",
        description: `Successfully added to waitlist for course${selectedCourse ? `: ${selectedCourse.code}` : ''}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/student/enrollments"] });
      setModalOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Waitlist Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  const handleEnroll = () => {
    if (selectedCourse) {
      enrollMutation.mutate(selectedCourse.id);
    }
  };

  const handleWaitlist = () => {
    if (selectedCourse) {
      waitlistMutation.mutate(selectedCourse.id);
    }
  };

  const getStatusBadge = (course: any) => {
    const registeredCount = course.enrollmentCount || 0;
    
    if (registeredCount >= course.capacity) {
      return <Badge variant="danger">Closed ({registeredCount}/{course.capacity})</Badge>;
    } else if (registeredCount >= course.capacity * 0.8) {
      return <Badge variant="warning">Limited ({registeredCount}/{course.capacity})</Badge>;
    } else {
      return <Badge variant="success">Open ({registeredCount}/{course.capacity})</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No courses found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <TableCell className="font-medium">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-primary font-medium"
                        onClick={() => handleCourseClick(course)}
                      >
                        {course.code}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                      {course.title}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                      {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'TBA'}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                      {course.schedules && course.schedules.length > 0 
                        ? formatSchedule(course.schedules) 
                        : 'TBA'
                      }
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                      {course.credits}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(course)}
                    </TableCell>
                    <TableCell className="text-right">
                      {user && user.role === "student" && (
                        <>
                          {course.enrollmentCount < course.capacity ? (
                            <Button 
                              variant="link" 
                              size="sm"
                              className="text-primary font-medium"
                              onClick={() => handleCourseClick(course)}
                            >
                              Add
                            </Button>
                          ) : (
                            <Button 
                              variant="link" 
                              size="sm"
                              className="text-primary font-medium"
                              onClick={() => handleCourseClick(course)}
                            >
                              Join Waitlist
                            </Button>
                          )}
                        </>
                      )}
                      
                      {user && user.role === "faculty" && (
                        <Button 
                          variant="link" 
                          size="sm"
                          className="text-primary font-medium"
                          asChild
                        >
                          <Link href={`/courses/${course.id}`}>View</Link>
                        </Button>
                      )}
                      
                      {user && user.role === "admin" && (
                        <Button 
                          variant="link" 
                          size="sm"
                          className="text-primary font-medium"
                          asChild
                        >
                          <Link href={`/course-management/${course.id}`}>Edit</Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-700">
            <div className="text-sm text-slate-700 dark:text-slate-400">
              Showing page {currentPage} of {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        onPageChange(currentPage - 1);
                      }
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3 && currentPage < totalPages - 1) {
                      pageNum = currentPage - 2 + i;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 4 + i;
                    }
                  }
                  
                  if (pageNum <= totalPages) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        onPageChange(currentPage + 1);
                      }
                    }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      
      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse}
          isOpen={modalOpen}
          onClose={closeModal}
          onEnroll={handleEnroll}
          onWaitlist={handleWaitlist}
          isEnrolling={enrollMutation.isPending}
          isWaitlisting={waitlistMutation.isPending}
        />
      )}
    </>
  );
}
