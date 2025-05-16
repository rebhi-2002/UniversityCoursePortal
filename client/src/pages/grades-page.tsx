import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, BookOpen, AlertCircle } from "lucide-react";

export default function GradesPage() {
  // Fetch grades
  const { data: grades = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/student/grades"],
  });
  
  // Sample course grades data
  const sampleCourses = [
    {
      id: 1,
      code: "CS 101",
      title: "Introduction to Computer Science",
      instructor: "Dr. Smith",
      semester: "Fall 2024",
      finalGrade: "A",
      gpa: 4.0,
      credits: 3,
      gradePoints: 12,
      assignments: [
        { id: 1, name: "Homework 1", score: 95, weight: 10, max: 100 },
        { id: 2, name: "Homework 2", score: 88, weight: 10, max: 100 },
        { id: 3, name: "Midterm Exam", score: 92, weight: 30, max: 100 },
        { id: 4, name: "Final Project", score: 94, weight: 20, max: 100 },
        { id: 5, name: "Final Exam", score: 90, weight: 30, max: 100 }
      ]
    },
    {
      id: 2,
      code: "MATH 201",
      title: "Calculus I",
      instructor: "Dr. Johnson",
      semester: "Fall 2024",
      finalGrade: "B+",
      gpa: 3.3,
      credits: 4,
      gradePoints: 13.2,
      assignments: [
        { id: 6, name: "Quiz 1", score: 85, weight: 5, max: 100 },
        { id: 7, name: "Quiz 2", score: 78, weight: 5, max: 100 },
        { id: 8, name: "Homework Assignments", score: 90, weight: 20, max: 100 },
        { id: 9, name: "Midterm Exam", score: 82, weight: 30, max: 100 },
        { id: 10, name: "Final Exam", score: 88, weight: 40, max: 100 }
      ]
    },
    {
      id: 3,
      code: "ENG 102",
      title: "Composition and Rhetoric",
      instructor: "Prof. Williams",
      semester: "Fall 2024",
      finalGrade: "A-",
      gpa: 3.7,
      credits: 3,
      gradePoints: 11.1,
      assignments: [
        { id: 11, name: "Essay 1", score: 91, weight: 15, max: 100 },
        { id: 12, name: "Essay 2", score: 88, weight: 15, max: 100 },
        { id: 13, name: "Research Paper Outline", score: 95, weight: 10, max: 100 },
        { id: 14, name: "Research Paper Draft", score: 89, weight: 20, max: 100 },
        { id: 15, name: "Final Research Paper", score: 92, weight: 30, max: 100 },
        { id: 16, name: "Participation", score: 85, weight: 10, max: 100 }
      ]
    },
    {
      id: 4,
      code: "HIST 105",
      title: "World History",
      instructor: "Dr. Brown",
      semester: "Fall 2024",
      finalGrade: "B",
      gpa: 3.0,
      credits: 3,
      gradePoints: 9.0,
      assignments: [
        { id: 17, name: "Reading Responses", score: 88, weight: 20, max: 100 },
        { id: 18, name: "Midterm Exam", score: 79, weight: 25, max: 100 },
        { id: 19, name: "Research Paper", score: 85, weight: 30, max: 100 },
        { id: 20, name: "Final Exam", score: 82, weight: 25, max: 100 }
      ]
    }
  ];

  // Calculate cumulative GPA
  const calculateCumulativeGPA = () => {
    const totalGradePoints = sampleCourses.reduce((sum, course) => sum + course.gradePoints, 0);
    const totalCredits = sampleCourses.reduce((sum, course) => sum + course.credits, 0);
    return totalGradePoints / totalCredits;
  };
  
  // Helper function to calculate weighted average for a course
  const calculateCourseAverage = (assignments: any[]) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    assignments.forEach(assignment => {
      totalWeightedScore += (assignment.score / assignment.max) * assignment.weight;
      totalWeight += assignment.weight;
    });
    
    return totalWeight > 0 ? totalWeightedScore : 0;
  };
  
  // Get color based on grade percentage
  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-500";
    if (percentage >= 80) return "text-blue-600 dark:text-blue-500";
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-500";
    if (percentage >= 60) return "text-orange-600 dark:text-orange-500";
    return "text-red-600 dark:text-red-500";
  };
  
  const getGradeProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-600";
    if (percentage >= 80) return "bg-blue-600";
    if (percentage >= 70) return "bg-yellow-600";
    if (percentage >= 60) return "bg-orange-600";
    return "bg-red-600";
  };

  const cumGPA = calculateCumulativeGPA();

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Grades</h1>
          <Badge variant="outline" className="text-base py-1 px-3">
            Cumulative GPA: <span className="font-bold ml-1">{cumGPA.toFixed(2)}</span>
          </Badge>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Grade Summary</CardTitle>
              <CardDescription>
                Your current academic performance across all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Course</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Grade Points</TableHead>
                    <TableHead className="text-right">Current Average</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleCourses.map((course) => {
                    const courseAverage = calculateCourseAverage(course.assignments);
                    
                    return (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          <div>{course.code}: {course.title}</div>
                          <div className="text-sm text-slate-500">{course.instructor}</div>
                        </TableCell>
                        <TableCell>{course.credits}</TableCell>
                        <TableCell className="font-semibold">{course.finalGrade}</TableCell>
                        <TableCell>{course.gpa.toFixed(1)}</TableCell>
                        <TableCell>{course.gradePoints}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className={`font-semibold ${getGradeColor(courseAverage)}`}>
                              {courseAverage.toFixed(1)}%
                            </span>
                            <Progress 
                              value={courseAverage} 
                              max={100} 
                              className={`h-2 w-24 mt-1 ${getGradeProgressColor(courseAverage)}`}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue={sampleCourses[0].id.toString()}>
          <TabsList className="mb-4">
            {sampleCourses.map((course) => (
              <TabsTrigger key={course.id} value={course.id.toString()}>
                {course.code}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {sampleCourses.map((course) => (
            <TabsContent key={course.id} value={course.id.toString()}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.code}: {course.title}</CardTitle>
                      <CardDescription>
                        {course.instructor} • {course.semester}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Final Grade</div>
                      <div className="text-3xl font-bold">{course.finalGrade}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Assignment</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Weighted Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {course.assignments.map((assignment) => {
                        const percentage = (assignment.score / assignment.max) * 100;
                        const weightedScore = (assignment.score / assignment.max) * assignment.weight;
                        
                        return (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">
                              {assignment.name}
                            </TableCell>
                            <TableCell>{assignment.weight}%</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={getGradeColor(percentage)}>
                                  {assignment.score}/{assignment.max}
                                </span>
                                <span className="text-sm text-slate-500">
                                  ({percentage.toFixed(1)}%)
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {weightedScore.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell>100%</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-bold">
                          {calculateCourseAverage(course.assignments).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  {course.id === 2 && (
                    <div className="mt-6 p-4 border rounded-md bg-amber-50 border-amber-200 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-800">Grading Note</h3>
                        <p className="text-sm text-amber-700">
                          The Final Exam for this course is yet to be taken. The current grade calculation is based on completed assignments only.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppShell>
  );
}