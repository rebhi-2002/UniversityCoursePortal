import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { 
  Book, 
  FileText, 
  Video, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ExternalLink 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function MoodlePage() {
  const { user } = useAuth();
  
  // Fetch student enrollments or faculty courses
  const { 
    data: courses, 
    isLoading: isCoursesLoading 
  } = useQuery({
    queryKey: [user?.role === "student" ? "/api/student/enrollments" : "/api/faculty/courses"],
    enabled: !!user,
  });

  // Simulated due dates formatting
  const formatDueDate = (date: string) => {
    const dueDate = new Date(date);
    const now = new Date();
    
    // Calculate difference in days
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return (
        <Badge variant="danger" className="ml-2">
          Overdue
        </Badge>
      );
    } else if (diffDays === 0) {
      return (
        <Badge variant="danger" className="ml-2">
          Due Today
        </Badge>
      );
    } else if (diffDays === 1) {
      return (
        <Badge variant="warning" className="ml-2">
          Due Tomorrow
        </Badge>
      );
    } else if (diffDays <= 3) {
      return (
        <Badge variant="warning" className="ml-2">
          Due in {diffDays} days
        </Badge>
      );
    }
    
    return (
      <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
        Due {dueDate.toLocaleDateString()}
      </span>
    );
  };

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Moodle Learning Platform</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Access course materials, assignments, and discussions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Open in Full Moodle
          </Button>
        </div>
      </div>

      {isCoursesLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading course content...</span>
        </div>
      ) : courses && courses.length > 0 ? (
        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="materials">Course Materials</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>
          
          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course: any) => (
                <Card key={course.id} className="overflow-hidden">
                  <CardHeader className="bg-primary-50 dark:bg-primary-900/20 pb-2">
                    <CardTitle>
                      {course.course ? (
                        // Student view
                        <>{course.course.code}: {course.course.title}</>
                      ) : (
                        // Faculty view
                        <>{course.code}: {course.title}</>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {course.course ? (
                        // Student view - show instructor
                        <>Instructor: {course.course.instructor?.firstName} {course.course.instructor?.lastName || "TBA"}</>
                      ) : (
                        // Faculty view - show student count
                        <>{course.enrollmentCount || 0} students enrolled</>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">
                          {course.course?.semester || course.semester} {course.course?.year || course.year}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">5 course materials</span>
                      </div>
                      
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">3 assignments</span>
                        {user?.role === "student" && (
                          <Badge variant="warning" className="ml-2">1 due soon</Badge>
                        )}
                      </div>
                      
                      {user?.role === "faculty" && (
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-primary mr-2" />
                          <span className="text-sm">7 submissions to grade</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50 dark:bg-slate-800/50 pt-3">
                    <Button variant="outline" className="w-full">
                      Enter Course
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Assignments</CardTitle>
                <CardDescription>
                  {user?.role === "student" 
                    ? "Assignments you need to complete" 
                    : "Assignments for your courses"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample assignments */}
                  <div className="p-4 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Problem Set 2: Derivatives</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          MATH 201: Calculus II
                        </p>
                      </div>
                      {formatDueDate("2023-09-15")}
                    </div>
                    <div className="flex items-center mt-3">
                      <Clock className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Due Sep 15, 2023 • 11:59 PM
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">
                        {user?.role === "student" ? "Submit Assignment" : "View Submissions"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Programming Assignment 1: Algorithms</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          CS 101: Introduction to Computer Science
                        </p>
                      </div>
                      {formatDueDate("2023-09-20")}
                    </div>
                    <div className="flex items-center mt-3">
                      <Clock className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Due Sep 20, 2023 • 11:59 PM
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">
                        {user?.role === "student" ? "Submit Assignment" : "View Submissions"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Essay Draft: Literary Analysis</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          ENG 105: Academic Writing
                        </p>
                      </div>
                      {formatDueDate("2023-09-25")}
                    </div>
                    <div className="flex items-center mt-3">
                      <Clock className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Due Sep 25, 2023 • 11:59 PM
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">
                        {user?.role === "student" ? "Submit Assignment" : "View Submissions"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50 dark:bg-slate-800/50 flex justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Showing 3 of 8 assignments
                </span>
                <Button variant="link" size="sm">View All Assignments</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Course Materials Tab */}
          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
                <CardDescription>
                  Lectures, readings, and resources for your courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* CS 101 Materials */}
                  <div>
                    <h3 className="font-medium mb-3">CS 101: Introduction to Computer Science</h3>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Syllabus and Course Schedule</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">PDF • 245 KB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Download
                        </Button>
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Video className="h-5 w-5 text-red-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Lecture 1: Introduction to Programming</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">MP4 • 1.2 GB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Watch
                        </Button>
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Book className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Reading: Introduction to Algorithms</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">PDF • 3.5 MB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* MATH 201 Materials */}
                  <div>
                    <h3 className="font-medium mb-3">MATH 201: Calculus II</h3>
                    <div className="space-y-2">
                      <div className="flex items-center p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Calculus II Course Syllabus</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">PDF • 190 KB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Download
                        </Button>
                      </div>
                      
                      <div className="flex items-center p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Book className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <h4 className="font-medium">Chapter 5: Integration Techniques</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">PDF • 2.1 MB</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50 dark:bg-slate-800/50">
                {user?.role === "faculty" && (
                  <Button>Upload New Material</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Grades Tab */}
          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Course Grades</CardTitle>
                <CardDescription>
                  {user?.role === "student" 
                    ? "Your grades for all assignments" 
                    : "Manage student grades"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.role === "student" ? (
                  <div className="space-y-6">
                    {/* CS 101 Grades */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">CS 101: Introduction to Computer Science</h3>
                        <Badge variant="success">92% (A-)</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div>
                            <h4 className="font-medium">Quiz 1: Python Basics</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Submitted Sep 5, 2023</p>
                          </div>
                          <Badge variant="success">92%</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div>
                            <h4 className="font-medium">Programming Assignment 1</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Due Sep 20, 2023</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* MATH 201 Grades */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">MATH 201: Calculus II</h3>
                        <Badge variant="warning">78% (C+)</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div>
                            <h4 className="font-medium">Problem Set 1: Limits</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Submitted Sep 3, 2023</p>
                          </div>
                          <Badge variant="warning">78%</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div>
                            <h4 className="font-medium">Problem Set 2: Derivatives</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Due Sep 15, 2023</p>
                          </div>
                          <Badge variant="secondary">Not Submitted</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Faculty view of grades */}
                    <div>
                      <h3 className="font-medium mb-3">CS 101: Introduction to Computer Science</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div>
                            <h4 className="font-medium">Quiz 1: Python Basics</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">25 Submissions, 2 Pending</p>
                          </div>
                          <Button size="sm">Grade Submissions</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div>
                            <h4 className="font-medium">Programming Assignment 1</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Due Sep 20, 2023</p>
                          </div>
                          <Button size="sm" variant="outline">Manage Assignment</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Discussions Tab */}
          <TabsContent value="discussions">
            <Card>
              <CardHeader>
                <CardTitle>Course Discussions</CardTitle>
                <CardDescription>
                  Participate in course forums and discussions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-primary mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Week 3 Discussion: Algorithm Efficiency</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          CS 101: Introduction to Computer Science
                        </p>
                        <div className="flex items-center mt-2 text-sm text-slate-500 dark:text-slate-400">
                          <span>12 replies</span>
                          <span className="mx-2">•</span>
                          <span>Last post 2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-primary mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Questions about Integration Techniques</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          MATH 201: Calculus II
                        </p>
                        <div className="flex items-center mt-2 text-sm text-slate-500 dark:text-slate-400">
                          <span>8 replies</span>
                          <span className="mx-2">•</span>
                          <span>Last post yesterday</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-primary mt-1 mr-3" />
                      <div>
                        <h3 className="font-medium">Essay Topics Discussion</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          ENG 105: Academic Writing
                        </p>
                        <div className="flex items-center mt-2 text-sm text-slate-500 dark:text-slate-400">
                          <span>15 replies</span>
                          <span className="mx-2">•</span>
                          <span>Last post 3 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50 dark:bg-slate-800/50">
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Create New Discussion
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="flex flex-col items-center p-8">
          <Book className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Courses Found</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
            {user?.role === "student" 
              ? "You are not enrolled in any courses. Register for courses to access Moodle content." 
              : "You are not teaching any courses this semester."
            }
          </p>
          {user?.role === "student" && (
            <Button asChild>
              <a href="/registration">Register for Courses</a>
            </Button>
          )}
        </Card>
      )}
    </AppShell>
  );
}
