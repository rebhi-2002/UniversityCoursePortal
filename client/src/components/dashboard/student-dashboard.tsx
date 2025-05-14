import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AlertCircle, ChevronRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export function StudentDashboard() {
  const { user } = useAuth();
  
  // Fetch enrolled courses
  const { 
    data: enrollments, 
    isLoading: isEnrollmentsLoading 
  } = useQuery({
    queryKey: ["/api/student/enrollments"], 
    enabled: !!user
  });
  
  // Fetch upcoming assignments
  const { 
    data: assignments, 
    isLoading: isAssignmentsLoading 
  } = useQuery({
    queryKey: ["/api/student/assignments"], 
    enabled: !!user
  });
  
  // Fetch recent grades
  const { 
    data: grades, 
    isLoading: isGradesLoading 
  } = useQuery({
    queryKey: ["/api/student/grades"], 
    enabled: !!user
  });
  
  // Fetch events
  const { 
    data: events, 
    isLoading: isEventsLoading 
  } = useQuery({
    queryKey: ["/api/events"], 
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
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return <Badge variant="success">Registered</Badge>;
      case "waitlisted":
        return <Badge variant="warning">Waitlisted</Badge>;
      case "dropped":
        return <Badge variant="danger">Dropped</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  // Get due date urgency badge
  const getDueDateBadge = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return <Badge variant="danger">Overdue</Badge>;
    } else if (diffDays === 0) {
      return <Badge variant="danger">Due Today</Badge>;
    } else if (diffDays === 1) {
      return <Badge variant="danger">Due Tomorrow</Badge>;
    } else if (diffDays <= 3) {
      return <Badge variant="warning">Due in {diffDays} days</Badge>;
    } else {
      return <Badge variant="secondary">Due in {diffDays} days</Badge>;
    }
  };
  
  // Get grade color based on score
  const getGradeColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "text-green-800";
    if (percentage >= 80) return "text-green-700";
    if (percentage >= 70) return "text-amber-700";
    if (percentage >= 60) return "text-amber-800";
    return "text-red-800";
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Student Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fall Semester 2023</p>
        </div>
        <div className="flex mt-4 space-x-3 sm:mt-0">
          <Button asChild>
            <Link href="/registration">Register for Courses</Link>
          </Button>
        </div>
      </div>
      
      {/* Registration Alert */}
      <Alert variant="warning" className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Registration Alert</AlertTitle>
        <AlertDescription>
          The Fall 2023 course registration period ends in 5 days (September 15, 2023). Complete your registration before the deadline.
          <Link href="/registration">
            <a className="inline-block mt-2 font-medium underline hover:text-amber-900">
              Go to Registration
            </a>
          </Link>
        </AlertDescription>
      </Alert>
      
      {/* Dashboard Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Enrolled Courses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Enrolled Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {isEnrollmentsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : enrollments && enrollments.length > 0 ? (
              <div className="space-y-4">
                {enrollments.map((enrollment: any) => (
                  <div 
                    key={enrollment.id} 
                    className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Link href={`/courses/${enrollment.courseId}`}>
                      <a className="block">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {enrollment.course?.code}: {enrollment.course?.title}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                            </p>
                          </div>
                          {getStatusBadge(enrollment.status)}
                        </div>
                        {enrollment.course?.schedules && enrollment.course.schedules.length > 0 && (
                          <>
                            <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>
                                {enrollment.course.schedules.map((schedule: any) => schedule.dayOfWeek).join(", ")} • {enrollment.course.schedules[0].startTime} - {enrollment.course.schedules[0].endTime}
                              </span>
                            </div>
                            <div className="flex items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{enrollment.course.schedules[0].location}</span>
                            </div>
                          </>
                        )}
                      </a>
                    </Link>
                  </div>
                ))}
                <Link href="/courses">
                  <a className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    View all courses <ChevronRight className="inline h-4 w-4" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">You're not enrolled in any courses yet.</p>
                <Button className="mt-2" asChild>
                  <Link href="/registration">Browse Courses</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Upcoming Assignments Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {isAssignmentsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : assignments && assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment: any) => (
                  <div 
                    key={assignment.id} 
                    className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Link href={`/assignments/${assignment.id}`}>
                      <a className="block">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {assignment.title}
                            </h3>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                              {assignment.course?.code}: {assignment.course?.title}
                            </p>
                          </div>
                          {getDueDateBadge(assignment.dueDate)}
                        </div>
                        <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Due {formatDate(assignment.dueDate)} • 11:59 PM</span>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
                <Link href="/assignments">
                  <a className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    View all assignments <ChevronRight className="inline h-4 w-4" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming assignments.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Grades Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            {isGradesLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : grades && grades.length > 0 ? (
              <div className="space-y-3">
                {grades.map((grade: any) => (
                  <div 
                    key={grade.id} 
                    className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Link href={`/grades/${grade.id}`}>
                      <a className="block">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {grade.assignment?.title}
                            </h3>
                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                              {grade.assignment?.course?.code}: {grade.assignment?.course?.title}
                            </p>
                          </div>
                          <span className={`flex-shrink-0 px-2 py-1 text-sm font-medium ${getGradeColor(grade.score, grade.assignment?.totalPoints)}`}>
                            {grade.score}/{grade.assignment?.totalPoints} ({Math.round((grade.score / grade.assignment?.totalPoints) * 100)}%)
                          </span>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Graded {formatDate(grade.gradedAt)}</span>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
                <Link href="/grades">
                  <a className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    View all grades <ChevronRight className="inline h-4 w-4" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">No grades to display yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Academic Calendar Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Academic Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            {isEventsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : events && events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event: any) => (
                  <div 
                    key={event.id} 
                    className={`p-3 border border-slate-200 rounded-md ${event.type === 'deadline' ? 'bg-primary-50 dark:bg-primary-900/20' : ''} dark:border-slate-700`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-primary-100 rounded-md text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                        <span className="text-sm font-semibold">
                          {new Date(event.startDate).getDate()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {event.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(event.startDate)}
                          {event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/calendar">
                  <a className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    View full calendar <ChevronRight className="inline h-4 w-4" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming events on the calendar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
