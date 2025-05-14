import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { CourseFilter, CourseFilters } from "@/components/course/course-filter";
import { CourseTable } from "@/components/course/course-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseCard } from "@/components/course/course-card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";

export default function CourseRegistration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState<CourseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("new-registration");

  // If not a student, redirect to home
  if (user && user.role !== "student") {
    toast({
      title: "Access Denied",
      description: "Only students can access course registration",
      variant: "destructive",
    });
    return <Redirect to="/" />;
  }

  // Fetch courses based on filters
  const { 
    data: coursesData, 
    isLoading: isCoursesLoading 
  } = useQuery({
    queryKey: ["/api/courses", filters, currentPage],
    queryFn: async () => {
      // Convert filters to query params
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append("page", currentPage.toString());
      
      const response = await fetch(`/api/courses?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      return response.json();
    },
  });

  // Fetch current enrollments
  const { 
    data: enrollments, 
    isLoading: isEnrollmentsLoading 
  } = useQuery({
    queryKey: ["/api/student/enrollments"],
    enabled: !!user,
  });

  // Handle filter application
  const handleApplyFilters = (newFilters: CourseFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Course Registration</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse and register for Fall Semester 2023 courses
          </p>
        </div>
      </div>

      {/* Tabs for Registration Workflow */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full md:w-auto">
          <TabsTrigger value="new-registration">Find Courses</TabsTrigger>
          <TabsTrigger value="current-schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="registration-history">History</TabsTrigger>
        </TabsList>
        
        {/* Find Courses Tab */}
        <TabsContent value="new-registration" className="space-y-6">
          {/* Filters */}
          <CourseFilter onApplyFilters={handleApplyFilters} defaultValues={filters} />
          
          {/* Courses Table */}
          <CourseTable 
            courses={coursesData?.courses || []} 
            isLoading={isCoursesLoading}
            totalPages={coursesData?.totalPages || 1}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </TabsContent>
        
        {/* Current Schedule Tab */}
        <TabsContent value="current-schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Schedule</CardTitle>
              <CardDescription>
                Your enrolled courses for Fall Semester 2023
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEnrollmentsLoading ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Loading your enrolled courses...</p>
                </div>
              ) : enrollments && enrollments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {enrollments.map((enrollment: any) => (
                    <CourseCard 
                      key={enrollment.id} 
                      course={{
                        ...enrollment.course,
                        enrollmentStatus: enrollment.status
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    You are not enrolled in any courses for the current semester.
                  </p>
                  <Button onClick={() => setActiveTab("new-registration")}>
                    Browse Available Courses
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Registration History Tab */}
        <TabsContent value="registration-history">
          <Card>
            <CardHeader>
              <CardTitle>Registration History</CardTitle>
              <CardDescription>
                Your past course registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No previous registration history available.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
