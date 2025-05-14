import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { CourseFilter, CourseFilters } from "@/components/course/course-filter";
import { CourseCard } from "@/components/course/course-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Filter } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

export default function CourseCatalog() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<CourseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch departments for nav
  const { data: departments } = useQuery({
    queryKey: ["/api/departments"],
  });

  // Fetch courses based on filters
  const { 
    data: coursesData, 
    isLoading: isCoursesLoading 
  } = useQuery({
    queryKey: ["/api/courses", filters, currentPage, searchQuery],
    queryFn: async () => {
      // Convert filters to query params
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }
      
      queryParams.append("page", currentPage.toString());
      
      const response = await fetch(`/api/courses?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      return response.json();
    },
  });

  // Handle filter application
  const handleApplyFilters = (newFilters: CourseFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when search changes
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Course Catalog</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse all available courses for Fall Semester 2023
          </p>
        </div>
        
        {user && user.role === "student" && (
          <div className="mt-4 sm:mt-0">
            <Button asChild>
              <Link href="/registration">Register for Courses</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="relative flex-grow">
              <Input
                type="text"
                placeholder="Search courses by name, code, or instructor..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              <Button type="submit" onClick={handleSearch}>Search</Button>
            </div>
          </div>
          
          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4">
              <CourseFilter 
                onApplyFilters={handleApplyFilters} 
                defaultValues={filters} 
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Tabs */}
      {departments && departments.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <Tabs 
            defaultValue="all" 
            onValueChange={(value) => {
              if (value === "all") {
                setFilters(current => ({ ...current, departmentId: "" }));
              } else {
                setFilters(current => ({ ...current, departmentId: value }));
              }
              setCurrentPage(1);
            }}
          >
            <TabsList className="inline-flex w-auto">
              <TabsTrigger value="all">All Departments</TabsTrigger>
              {departments.map((dept: any) => (
                <TabsTrigger key={dept.id} value={dept.id.toString()}>
                  {dept.code}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Course Grid */}
      {isCoursesLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-36 w-full" />
          ))}
        </div>
      ) : coursesData?.courses && coursesData.courses.length > 0 ? (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {coursesData.courses.map((course: any) => (
              <CourseCard 
                key={course.id} 
                course={{
                  ...course,
                  enrollmentStatus: course.enrollmentCount >= course.capacity ? "closed" : "open"
                }}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {coursesData.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, coursesData.totalPages) }).map((_, i) => {
                  let pageNum = i + 1;
                  if (coursesData.totalPages > 5) {
                    if (currentPage > 3 && currentPage < coursesData.totalPages - 1) {
                      pageNum = currentPage - 2 + i;
                    } else if (currentPage >= coursesData.totalPages - 1) {
                      pageNum = coursesData.totalPages - 4 + i;
                    }
                  }
                  
                  if (pageNum <= coursesData.totalPages) {
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNum);
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
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < coursesData.totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={currentPage >= coursesData.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground text-center mb-4">
              We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={() => {
              setFilters({});
              setSearchQuery("");
              setCurrentPage(1);
            }}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
