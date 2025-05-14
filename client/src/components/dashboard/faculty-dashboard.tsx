import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, Calendar, Users, FileText, PenTool } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export function FacultyDashboard() {
  const { user } = useAuth();
  
  // Fetch teaching courses
  const { 
    data: courses, 
    isLoading: isCoursesLoading 
  } = useQuery({
    queryKey: ["/api/faculty/courses"], 
    enabled: !!user
  });
  
  // Fetch upcoming assignments to grade
  const { 
    data: pendingGrades, 
    isLoading: isPendingGradesLoading 
  } = useQuery({
    queryKey: ["/api/faculty/pending-grades"], 
    enabled: !!user
  });
  
  // Fetch upcoming office hours
  const { 
    data: officeHours, 
    isLoading: isOfficeHoursLoading 
  } = useQuery({
    queryKey: ["/api/faculty/office-hours"], 
    enabled: !!user
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Faculty Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fall Semester 2023</p>
        </div>
        <div className="flex mt-4 space-x-3 sm:mt-0">
          <Button asChild>
            <Link href="/assignments/create">Create Assignment</Link>
          </Button>
        </div>
      </div>
      
      {/* Dashboard Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* My Courses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {isCoursesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course: any) => (
                  <div 
                    key={course.id} 
                    className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Link href={`/courses/${course.id}`}>
                      <a className="block">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {course.code}: {course.title}
                            </h3>
                            <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{course.enrollmentCount || 0} students enrolled</span>
                            </div>
                          </div>
                          <Badge variant="secondary">{course.semester} {course.year}</Badge>
                        </div>
                        {course.schedules && course.schedules.length > 0 && (
                          <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>
                              {course.schedules.map((schedule: any) => schedule.dayOfWeek).join(", ")} • {course.schedules[0].startTime} - {course.schedules[0].endTime}
                            </span>
                          </div>
                        )}
                      </a>
                    </Link>
                  </div>
                ))}
                <Link href="/my-courses">
                  <a className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Manage all courses <ChevronRight className="inline h-4 w-4" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">You're not teaching any courses this semester.</p>
                <Button className="mt-2" variant="outline" asChild>
                  <Link href="/help">Contact Administration</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pending Assignments to Grade */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Pending Grades</CardTitle>
          </CardHeader>
          <CardContent>
            {isPendingGradesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : pendingGrades && pendingGrades.length > 0 ? (
              <div className="space-y-3">
                {pendingGrades.map((item: any) => (
                  <div 
                    key={item.id} 
                    className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Link href={`/gradebook/${item.assignmentId}`}>
                      <a className="block">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {item.assignment?.title}
                            </h3>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                              {item.course?.code}: {item.course?.title}
                            </p>
                          </div>
                          <Badge variant="warning">{item.pendingCount} Submissions</Badge>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Due date: {formatDate(item.assignment?.dueDate)}</span>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
                <Link href="/gradebook">
                  <a className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    Open gradebook <ChevronRight className="inline h-4 w-4" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">No pending assignments to grade.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Office Hours Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Office Hours</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/office-hours/schedule">
                Edit Schedule
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isOfficeHoursLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : officeHours && officeHours.length > 0 ? (
              <div className="space-y-3">
                {officeHours.map((session: any) => (
                  <div 
                    key={session.id} 
                    className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-primary-100 rounded-md text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {session.dayOfWeek}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {session.startTime} - {session.endTime}
                        </p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          {session.location || 'Virtual'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">No office hours scheduled.</p>
                <Button className="mt-2" asChild>
                  <Link href="/office-hours/schedule">Schedule Office Hours</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Course Materials Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Course Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                <Link href="/moodle">
                  <a className="block">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-primary-100 rounded-md text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Moodle Course Materials
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          Upload and manage lectures, readings, and resources
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
              
              <div className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                <Link href="/assignments/create">
                  <a className="block">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-primary-100 rounded-md text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                        <PenTool className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Create Assignments
                        </h3>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          Create and publish new assignments and quizzes
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
