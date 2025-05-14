import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, UserPlus, BookPlus, FileText, Users, Calendar, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export function AdminDashboard() {
  const { user } = useAuth();
  
  // Fetch system statistics
  const { 
    data: stats, 
    isLoading: isStatsLoading 
  } = useQuery({
    queryKey: ["/api/admin/stats"], 
    enabled: !!user
  });
  
  // Fetch registration activity
  const { 
    data: registrationActivity, 
    isLoading: isActivityLoading 
  } = useQuery({
    queryKey: ["/api/admin/registration-activity"], 
    enabled: !!user
  });
  
  // Fetch recent events
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

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">System Overview</p>
        </div>
        <div className="flex flex-wrap mt-4 gap-3 sm:mt-0">
          <Button asChild>
            <Link href="/user-management/create">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/course-management/create">
              <BookPlus className="mr-2 h-4 w-4" />
              Add Course
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 mt-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {isStatsLoading ? (
          <>
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats?.studentCount || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg text-amber-700 dark:bg-amber-900 dark:text-amber-100">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Faculty</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats?.facultyCount || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg text-green-700 dark:bg-green-900 dark:text-green-100">
                    <BookPlus className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Courses</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats?.courseCount || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Enrollments</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats?.enrollmentCount || 0}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Dashboard Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Activity Card */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Registration Activity</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/reports/registration">
                View Report
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isActivityLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : registrationActivity && registrationActivity.length > 0 ? (
              <div className="space-y-4">
                {registrationActivity.map((item: any) => (
                  <div 
                    key={item.id} 
                    className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {item.course?.code}: {item.course?.title}
                        </h3>
                        <div className="flex justify-between mt-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-green-700 dark:text-green-400">
                              {item.registeredCount}
                            </span> registered, 
                            <span className="font-medium text-amber-700 dark:text-amber-400">
                              {" "}{item.waitlistedCount}
                            </span> waitlisted
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {item.registeredCount}/{item.course?.capacity} seats filled
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 dark:bg-slate-700">
                      <div 
                        className="bg-primary-600 h-1.5 rounded-full dark:bg-primary-500" 
                        style={{ width: `${(item.registeredCount / item.course?.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                <Link href="/reports/registration">
                  <a className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    View all registration data <ChevronRight className="inline h-4 w-4" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">No registration activity to display.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions Card */}
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Administrative Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/user-management">
                <a className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg text-primary-700 mb-2 dark:bg-primary-900 dark:text-primary-100">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">User Management</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Manage student and faculty accounts</p>
                  </div>
                </a>
              </Link>
              
              <Link href="/course-management">
                <a className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg text-primary-700 mb-2 dark:bg-primary-900 dark:text-primary-100">
                      <BookPlus className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Course Management</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Create and edit course offerings</p>
                  </div>
                </a>
              </Link>
              
              <Link href="/reports">
                <a className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg text-primary-700 mb-2 dark:bg-primary-900 dark:text-primary-100">
                      <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Reports</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Generate enrollment and grade reports</p>
                  </div>
                </a>
              </Link>
              
              <Link href="/system-settings">
                <a className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg text-primary-700 mb-2 dark:bg-primary-900 dark:text-primary-100">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">System Settings</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Configure system parameters</p>
                  </div>
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Calendar Events Card */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Academic Calendar</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/events/create">
                Add Event
              </Link>
            </Button>
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
                      <div className="ml-auto">
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/events/${event.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/events">
                  <a className="inline-block mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                    View all events <ChevronRight className="inline h-4 w-4" />
                  </a>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">No events to display.</p>
                <Button className="mt-2" asChild>
                  <Link href="/events/create">Create Event</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
