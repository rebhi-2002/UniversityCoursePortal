import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  BookOpen, 
  Calendar, 
  ChevronsUpDown, 
  Download, 
  Edit, 
  FileText, 
  Filter, 
  LineChart,
  MoreVertical, 
  Plus, 
  RefreshCw, 
  Save, 
  Search, 
  Upload, 
  UserPlus,
  XCircle 
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function GradebookPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("cs301");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("assignment1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [editingCell, setEditingCell] = useState<{studentId: number, assignmentId: string} | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  
  // Sample course data
  const courses = [
    { id: "cs301", code: "CS 301", title: "Software Engineering", section: "Section 01", semester: "Fall 2024", students: 32 },
    { id: "cs401", code: "CS 401", title: "Advanced Database Systems", section: "Section 01", semester: "Fall 2024", students: 25 },
    { id: "cs210", code: "CS 210", title: "Data Structures and Algorithms", section: "Section 01", semester: "Fall 2024", students: 45 }
  ];
  
  // Sample assignments data
  const assignments = [
    { id: "assignment1", title: "Assignment 1: Requirements Document", maxPoints: 100, weight: 10, dueDate: new Date(2024, 8, 15), category: "Homework" },
    { id: "assignment2", title: "Assignment 2: System Design", maxPoints: 100, weight: 10, dueDate: new Date(2024, 9, 5), category: "Homework" },
    { id: "midterm", title: "Midterm Exam", maxPoints: 100, weight: 30, dueDate: new Date(2024, 9, 15), category: "Exam" },
    { id: "project", title: "Final Project", maxPoints: 200, weight: 20, dueDate: new Date(2024, 10, 20), category: "Project" },
    { id: "finalExam", title: "Final Exam", maxPoints: 100, weight: 30, dueDate: new Date(2024, 11, 10), category: "Exam" }
  ];
  
  // Sample students data
  const students = [
    { id: 1, name: "Jane Smith", studentId: "S10023456", email: "jane.smith@university.edu" },
    { id: 2, name: "John Doe", studentId: "S10023457", email: "john.doe@university.edu" },
    { id: 3, name: "Emily Johnson", studentId: "S10023458", email: "emily.j@university.edu" },
    { id: 4, name: "Michael Brown", studentId: "S10023459", email: "m.brown@university.edu" },
    { id: 5, name: "Sophia Williams", studentId: "S10023460", email: "s.williams@university.edu" },
    { id: 6, name: "Jacob Miller", studentId: "S10023461", email: "j.miller@university.edu" },
    { id: 7, name: "Olivia Davis", studentId: "S10023462", email: "o.davis@university.edu" },
    { id: 8, name: "Ethan Garcia", studentId: "S10023463", email: "e.garcia@university.edu" }
  ];
  
  // Sample grades data
  const grades = {
    "assignment1": {
      1: { score: 92, feedback: "Great work on the requirements breakdown.", submitted: true, graded: true },
      2: { score: 88, feedback: "Good requirements analysis, but missing some details.", submitted: true, graded: true },
      3: { score: 95, feedback: "Excellent work! Very thorough analysis.", submitted: true, graded: true },
      4: { score: 78, feedback: "Several key requirements missing. Please review feedback.", submitted: true, graded: true },
      5: { score: 90, feedback: "Strong requirements document with clear stakeholder needs.", submitted: true, graded: true },
      6: { score: 65, feedback: "Incomplete analysis. Missing functional requirements.", submitted: true, graded: true },
      7: { score: 87, feedback: "Good work, but could improve the non-functional requirements.", submitted: true, graded: true },
      8: { score: 82, feedback: "Solid work, but lacking some detail in user stories.", submitted: true, graded: true }
    },
    "assignment2": {
      1: { score: 90, feedback: "Great system architecture design!", submitted: true, graded: true },
      2: { score: 85, feedback: "Good design patterns, but some components need more detail.", submitted: true, graded: true },
      3: { score: 92, feedback: "Excellent class diagrams and sequence diagrams.", submitted: true, graded: true },
      4: { score: 88, feedback: "Well-thought-out design with good component separation.", submitted: true, graded: true },
      5: { score: 91, feedback: "Very thorough design with good justifications.", submitted: true, graded: true },
      6: { score: 70, feedback: "Design lacks cohesion. Component interactions unclear.", submitted: true, graded: true },
      7: { score: 86, feedback: "Good work on the architectural patterns.", submitted: true, graded: true },
      8: { score: 83, feedback: "Solid design but database schema needs work.", submitted: true, graded: true }
    },
    "midterm": {
      1: { score: 88, feedback: "", submitted: true, graded: true },
      2: { score: 92, feedback: "", submitted: true, graded: true },
      3: { score: 85, feedback: "", submitted: true, graded: true },
      4: { score: 90, feedback: "", submitted: true, graded: true },
      5: { score: 78, feedback: "", submitted: true, graded: true },
      6: { score: 72, feedback: "", submitted: true, graded: true },
      7: { score: 95, feedback: "", submitted: true, graded: true },
      8: { score: 87, feedback: "", submitted: true, graded: true }
    },
    "project": {
      1: { score: null, feedback: "", submitted: true, graded: false },
      2: { score: null, feedback: "", submitted: true, graded: false },
      3: { score: null, feedback: "", submitted: true, graded: false },
      4: { score: null, feedback: "", submitted: true, graded: false },
      5: { score: null, feedback: "", submitted: false, graded: false },
      6: { score: null, feedback: "", submitted: false, graded: false },
      7: { score: null, feedback: "", submitted: true, graded: false },
      8: { score: null, feedback: "", submitted: true, graded: false }
    },
    "finalExam": {
      1: { score: null, feedback: "", submitted: false, graded: false },
      2: { score: null, feedback: "", submitted: false, graded: false },
      3: { score: null, feedback: "", submitted: false, graded: false },
      4: { score: null, feedback: "", submitted: false, graded: false },
      5: { score: null, feedback: "", submitted: false, graded: false },
      6: { score: null, feedback: "", submitted: false, graded: false },
      7: { score: null, feedback: "", submitted: false, graded: false },
      8: { score: null, feedback: "", submitted: false, graded: false }
    }
  };
  
  // Get the current grades for a student
  const getGrade = (studentId: number, assignmentId: string) => {
    return grades[assignmentId as keyof typeof grades]?.[studentId] || { score: null, feedback: "", submitted: false, graded: false };
  };
  
  // Sort students based on the selected column and direction
  const sortedStudents = [...students].sort((a, b) => {
    if (sortColumn === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortColumn === "id") {
      return sortDirection === "asc" 
        ? a.studentId.localeCompare(b.studentId) 
        : b.studentId.localeCompare(a.studentId);
    } else {
      // Sorting by an assignment column
      const aGrade = getGrade(a.id, sortColumn).score || 0;
      const bGrade = getGrade(b.id, sortColumn).score || 0;
      return sortDirection === "asc" ? aGrade - bGrade : bGrade - aGrade;
    }
  });
  
  // Filter students based on search query
  const filteredStudents = sortedStudents.filter(student => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.studentId.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  });
  
  // Calculate statistics for an assignment
  const calculateStats = (assignmentId: string) => {
    const scores = Object.values(grades[assignmentId as keyof typeof grades] || {})
      .filter(g => g.graded && g.score !== null)
      .map(g => g.score as number);
    
    if (scores.length === 0) return { avg: 0, min: 0, max: 0, median: 0, submitted: 0, graded: 0 };
    
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = sum / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const sorted = [...scores].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 
      ? (sorted[middle - 1] + sorted[middle]) / 2 
      : sorted[middle];
    
    const assignment = grades[assignmentId as keyof typeof grades] || {};
    const submitted = Object.values(assignment).filter(g => g.submitted).length;
    const graded = Object.values(assignment).filter(g => g.graded).length;
    
    return { avg, min, max, median, submitted, graded };
  };
  
  // Calculate overall grade for a student
  const calculateOverallGrade = (studentId: number) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    assignments.forEach(assignment => {
      const grade = getGrade(studentId, assignment.id);
      if (grade.graded && grade.score !== null) {
        totalWeightedScore += (grade.score / assignment.maxPoints) * assignment.weight;
        totalWeight += assignment.weight;
      }
    });
    
    if (totalWeight === 0) return { percentage: 0, letter: "N/A" };
    
    const percentage = (totalWeightedScore / totalWeight) * 100;
    let letter = "F";
    
    if (percentage >= 93) letter = "A";
    else if (percentage >= 90) letter = "A-";
    else if (percentage >= 87) letter = "B+";
    else if (percentage >= 83) letter = "B";
    else if (percentage >= 80) letter = "B-";
    else if (percentage >= 77) letter = "C+";
    else if (percentage >= 73) letter = "C";
    else if (percentage >= 70) letter = "C-";
    else if (percentage >= 67) letter = "D+";
    else if (percentage >= 63) letter = "D";
    else if (percentage >= 60) letter = "D-";
    
    return { percentage, letter };
  };
  
  // Get stats for the currently selected assignment
  const currentAssignmentStats = calculateStats(selectedAssignment);
  const currentAssignment = assignments.find(a => a.id === selectedAssignment);
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  const handleCellEdit = (studentId: number, assignmentId: string) => {
    const grade = getGrade(studentId, assignmentId);
    if (grade.submitted) {
      setEditingCell({ studentId, assignmentId });
      setEditValue(grade.score?.toString() || "");
    }
  };
  
  const handleCellSave = () => {
    if (editingCell) {
      // This would update the grade in a real application
      console.log(`Saving grade ${editValue} for student ${editingCell.studentId} on assignment ${editingCell.assignmentId}`);
      setEditingCell(null);
    }
  };
  
  const handleCellCancel = () => {
    setEditingCell(null);
  };
  
  // Get proper styles for score cells based on grade
  const getScoreColor = (score: number | null, maxPoints: number) => {
    if (score === null) return "";
    const percentage = (score / maxPoints) * 100;
    if (percentage >= 90) return "text-green-600 dark:text-green-500";
    if (percentage >= 80) return "text-blue-600 dark:text-blue-500";
    if (percentage >= 70) return "text-yellow-600 dark:text-yellow-500";
    if (percentage >= 60) return "text-orange-600 dark:text-orange-500";
    return "text-red-600 dark:text-red-500";
  };

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gradebook</h1>
            <p className="text-slate-500 mt-1">
              Manage and record student grades for your courses
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Export Grades
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Upload className="h-4 w-4" /> Import Grades
            </Button>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Assignment
            </Button>
          </div>
        </div>
        
        {/* Course selector and tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-72">
              <Select 
                value={selectedCourse} 
                onValueChange={setSelectedCourse}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code}: {course.title} ({course.section})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Badge variant="outline" className="text-sm">
              {courses.find(c => c.id === selectedCourse)?.semester || ""}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {courses.find(c => c.id === selectedCourse)?.students || 0} Students
            </Badge>
          </div>
          
          <Tabs defaultValue="gradebook">
            <TabsList className="mb-4">
              <TabsTrigger value="gradebook">Gradebook</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Gradebook Tab */}
            <TabsContent value="gradebook" className="space-y-6">
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <Input 
                          placeholder="Search students..." 
                          className="pl-10" 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Filter className="h-4 w-4" /> Filter
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh
                      </Button>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-36 h-9">
                          <SelectValue placeholder="View" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Assignments</SelectItem>
                          <SelectItem value="homework">Homework Only</SelectItem>
                          <SelectItem value="exams">Exams Only</SelectItem>
                          <SelectItem value="projects">Projects Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2 px-0">
                  <div className="border rounded-md border-separate overflow-x-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-white dark:bg-slate-950">
                        <TableRow>
                          <TableHead 
                            className="w-[250px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center">
                              Student
                              {sortColumn === "name" && (
                                <ChevronsUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                              )}
                            </div>
                          </TableHead>
                          
                          <TableHead 
                            className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                            onClick={() => handleSort("id")}
                          >
                            <div className="flex items-center">
                              ID
                              {sortColumn === "id" && (
                                <ChevronsUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                              )}
                            </div>
                          </TableHead>
                          
                          {assignments.map(assignment => (
                            <TableHead 
                              key={assignment.id}
                              className="min-w-[120px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                              onClick={() => handleSort(assignment.id)}
                            >
                              <div className="flex items-center">
                                <div>
                                  <div className="font-medium truncate max-w-[150px]" title={assignment.title}>
                                    {assignment.title.substring(0, assignment.title.indexOf(":") > 0 ? assignment.title.indexOf(":") : assignment.title.length)}
                                  </div>
                                  <div className="flex items-center text-xs text-slate-500 mt-1">
                                    <span>{assignment.maxPoints} pts</span>
                                    <span className="px-1">•</span>
                                    <span>{assignment.weight}%</span>
                                  </div>
                                </div>
                                {sortColumn === assignment.id && (
                                  <ChevronsUpDown className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                                )}
                              </div>
                            </TableHead>
                          ))}
                          
                          <TableHead className="min-w-[100px] text-right">Overall</TableHead>
                        </TableRow>
                      </TableHeader>
                      
                      <TableBody>
                        {filteredStudents.map(student => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{student.name}</span>
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-slate-600 dark:text-slate-300">
                              {student.studentId}
                            </TableCell>
                            
                            {assignments.map(assignment => {
                              const grade = getGrade(student.id, assignment.id);
                              
                              return (
                                <TableCell 
                                  key={`${student.id}-${assignment.id}`}
                                  onClick={() => handleCellEdit(student.id, assignment.id)}
                                  className={`text-center ${grade.submitted ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800" : "bg-slate-50 dark:bg-slate-800/20"}`}
                                >
                                  {editingCell?.studentId === student.id && editingCell?.assignmentId === assignment.id ? (
                                    <div className="relative">
                                      <Input 
                                        type="number"
                                        className="w-16 mx-auto text-center p-1 h-8"
                                        value={editValue}
                                        onChange={e => setEditValue(e.target.value)}
                                        autoFocus
                                        min={0}
                                        max={assignment.maxPoints}
                                      />
                                      <div className="absolute top-1 -right-10 flex gap-0.5">
                                        <Button 
                                          size="icon" 
                                          variant="ghost"
                                          className="h-6 w-6" 
                                          onClick={handleCellSave}
                                        >
                                          <Save className="h-3.5 w-3.5 text-green-600" />
                                        </Button>
                                        <Button 
                                          size="icon" 
                                          variant="ghost"
                                          className="h-6 w-6" 
                                          onClick={handleCellCancel}
                                        >
                                          <XCircle className="h-3.5 w-3.5 text-red-600" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      {grade.submitted ? (
                                        <span className={getScoreColor(grade.score, assignment.maxPoints)}>
                                          {grade.graded ? grade.score : "—"}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 dark:text-slate-500 text-xs">
                                          Not Submitted
                                        </span>
                                      )}
                                    </>
                                  )}
                                </TableCell>
                              );
                            })}
                            
                            <TableCell className="text-right">
                              {(() => {
                                const { percentage, letter } = calculateOverallGrade(student.id);
                                return (
                                  <div className="flex flex-col items-end">
                                    <div className="flex items-center">
                                      <span className={getScoreColor(percentage, 100)}>
                                        {percentage.toFixed(1)}%
                                      </span>
                                      <Badge className="ml-2" variant="outline">
                                        {letter}
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              })()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-4">
                  <div className="text-sm text-slate-500">
                    Showing {filteredStudents.length} of {students.length} students
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <UserPlus className="h-4 w-4" /> Add Student
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Add Student</AlertDialogTitle>
                        <AlertDialogDescription>
                          Add a new student to this course. They will be automatically notified by email.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Student ID</label>
                          <Input placeholder="Enter student ID" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input placeholder="Enter student email" />
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Add Student</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
              
              {/* Assignment Stats Card */}
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Assignment Statistics</CardTitle>
                      <CardDescription>
                        Performance metrics for the current assignment
                      </CardDescription>
                    </div>
                    <Select 
                      value={selectedAssignment} 
                      onValueChange={setSelectedAssignment}
                    >
                      <SelectTrigger className="w-72">
                        <SelectValue placeholder="Select assignment" />
                      </SelectTrigger>
                      <SelectContent>
                        {assignments.map(assignment => (
                          <SelectItem key={assignment.id} value={assignment.id}>
                            {assignment.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{currentAssignment?.title}</h3>
                        <p className="text-sm text-slate-500">
                          Due: {currentAssignment ? format(currentAssignment.dueDate, 'MMMM d, yyyy') : "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-500">Assignment Weight</div>
                        <div className="font-medium">{currentAssignment?.weight}%</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid md:grid-cols-5 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-500 mb-1">Average Score</div>
                          <div className="text-2xl font-bold">{currentAssignmentStats.avg.toFixed(1)}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {((currentAssignmentStats.avg / (currentAssignment?.maxPoints || 100)) * 100).toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-500 mb-1">Median Score</div>
                          <div className="text-2xl font-bold">{currentAssignmentStats.median.toFixed(1)}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {((currentAssignmentStats.median / (currentAssignment?.maxPoints || 100)) * 100).toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-500 mb-1">Highest Score</div>
                          <div className="text-2xl font-bold text-green-600">{currentAssignmentStats.max.toFixed(1)}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {((currentAssignmentStats.max / (currentAssignment?.maxPoints || 100)) * 100).toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-500 mb-1">Lowest Score</div>
                          <div className="text-2xl font-bold text-red-500">{currentAssignmentStats.min.toFixed(1)}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {((currentAssignmentStats.min / (currentAssignment?.maxPoints || 100)) * 100).toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-slate-500 mb-1">Submission Rate</div>
                          <div className="text-2xl font-bold">
                            {`${currentAssignmentStats.submitted}/${students.length}`}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {((currentAssignmentStats.submitted / students.length) * 100).toFixed(1)}%
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Grade Distribution</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-primary mr-1"></div>
                          <span className="text-xs text-slate-500">Score</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700 mr-1"></div>
                          <span className="text-xs text-slate-500">Average</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* This would be a real chart in a production app */}
                    <div className="h-64 flex items-end gap-1 border-b border-l relative">
                      {/* Distribution bars simulation */}
                      <div className="w-full h-full flex items-end justify-between">
                        <div style={{ height: "10%" }} className="w-12 bg-primary/10 rounded-t"></div>
                        <div style={{ height: "20%" }} className="w-12 bg-primary/20 rounded-t"></div>
                        <div style={{ height: "45%" }} className="w-12 bg-primary/30 rounded-t"></div>
                        <div style={{ height: "65%" }} className="w-12 bg-primary/60 rounded-t"></div>
                        <div style={{ height: "85%" }} className="w-12 bg-primary/80 rounded-t"></div>
                        <div style={{ height: "55%" }} className="w-12 bg-primary/60 rounded-t"></div>
                        <div style={{ height: "30%" }} className="w-12 bg-primary/40 rounded-t"></div>
                        <div style={{ height: "15%" }} className="w-12 bg-primary/20 rounded-t"></div>
                        <div style={{ height: "5%" }} className="w-12 bg-primary/10 rounded-t"></div>
                        
                        {/* Average line */}
                        <div className="absolute left-0 right-0 border-t border-dashed border-slate-400 dark:border-slate-500" style={{ bottom: "60%" }}></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <div>0-9</div>
                      <div>10-19</div>
                      <div>20-29</div>
                      <div>30-39</div>
                      <div>40-49</div>
                      <div>50-59</div>
                      <div>60-69</div>
                      <div>70-79</div>
                      <div>80-89</div>
                      <div>90-100</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Grade Feedback</h3>
                      <div className="border rounded-md p-4">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium block mb-1">Student</label>
                            <Select defaultValue="">
                              <SelectTrigger>
                                <SelectValue placeholder="Select student" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Select a student</SelectItem>
                                {students.map(student => (
                                  <SelectItem key={student.id} value={student.id.toString()}>
                                    {student.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium block mb-1">Score</label>
                            <Input type="number" placeholder="Enter score" defaultValue="85" />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium block mb-1">Feedback</label>
                            <Textarea placeholder="Enter feedback..." className="min-h-24" defaultValue="Good work on this assignment. Your analysis was thorough and well-structured. Consider expanding on the implementation details next time." />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button>Save Feedback</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Bulk Actions</h3>
                      <div className="border rounded-md p-4">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium block mb-1">Action</label>
                            <Select defaultValue="curve">
                              <SelectTrigger>
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="curve">Apply Grade Curve</SelectItem>
                                <SelectItem value="email">Email Grades</SelectItem>
                                <SelectItem value="export">Export Grades</SelectItem>
                                <SelectItem value="drop">Drop Lowest Score</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium block mb-1">Curve Method</label>
                            <Select defaultValue="add">
                              <SelectTrigger>
                                <SelectValue placeholder="Select curve method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="add">Add Points</SelectItem>
                                <SelectItem value="multiply">Multiply by Factor</SelectItem>
                                <SelectItem value="set-mean">Set New Mean</SelectItem>
                                <SelectItem value="set-top">Set Highest Grade</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium block mb-1">Value</label>
                            <Input type="number" placeholder="Enter value" defaultValue="5" />
                          </div>
                          
                          <div>
                            <div className="flex items-start gap-2 mb-2">
                              <div className="bg-amber-50 p-2 rounded-full">
                                <BarChart className="h-4 w-4 text-amber-500" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Preview Effect</div>
                                <div className="text-xs text-slate-500">
                                  Current average: <span className="font-medium">85.3</span>
                                  <span className="mx-2">→</span>
                                  New average: <span className="font-medium text-green-600">90.3</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button>Apply</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Assignments Tab */}
            <TabsContent value="assignments">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>Assignments & Assessments</CardTitle>
                      <CardDescription>
                        Manage course assignments, exams, and other assessments
                      </CardDescription>
                    </div>
                    <Button className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Add Assignment
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead className="text-center">Max Points</TableHead>
                        <TableHead className="text-center">Weight (%)</TableHead>
                        <TableHead className="text-center">Submissions</TableHead>
                        <TableHead className="text-center">Average</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignments.map(assignment => {
                        const stats = calculateStats(assignment.id);
                        return (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{assignment.category}</Badge>
                            </TableCell>
                            <TableCell>{format(assignment.dueDate, 'MMM d, yyyy')}</TableCell>
                            <TableCell className="text-center">{assignment.maxPoints}</TableCell>
                            <TableCell className="text-center">{assignment.weight}%</TableCell>
                            <TableCell className="text-center">
                              {stats.submitted}/{students.length}
                              <div className="w-full mt-1">
                                <Progress value={stats.submitted} max={students.length} className="h-1" />
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {stats.avg > 0 ? (
                                <div className={getScoreColor(stats.avg, assignment.maxPoints)}>
                                  {stats.avg.toFixed(1)} 
                                  <span className="text-slate-500 text-xs ml-1">
                                    ({((stats.avg / assignment.maxPoints) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-500 text-xs">Not graded</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" /> Edit Assignment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="h-4 w-4 mr-2" /> View Submissions
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <LineChart className="h-4 w-4 mr-2" /> View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <XCircle className="h-4 w-4 mr-2" /> Delete Assignment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Course Analytics</CardTitle>
                  <CardDescription>
                    Performance metrics and trends for the course
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="py-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Users className="h-4 w-4 mr-2 text-primary" /> Class Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">83.7%</div>
                        <div className="flex items-center text-sm text-slate-500">
                          <span className="text-green-600">▲ 2.3%</span>
                          <span className="ml-1">from previous assessments</span>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">A (90-100%)</span>
                              <span className="font-medium">8 students</span>
                            </div>
                            <Progress value={8} max={students.length} className="h-2 bg-slate-100 dark:bg-slate-800" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">B (80-89%)</span>
                              <span className="font-medium">12 students</span>
                            </div>
                            <Progress value={12} max={students.length} className="h-2 bg-slate-100 dark:bg-slate-800" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">C (70-79%)</span>
                              <span className="font-medium">7 students</span>
                            </div>
                            <Progress value={7} max={students.length} className="h-2 bg-slate-100 dark:bg-slate-800" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">D (60-69%)</span>
                              <span className="font-medium">5 students</span>
                            </div>
                            <Progress value={5} max={students.length} className="h-2 bg-slate-100 dark:bg-slate-800" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">F (0-59%)</span>
                              <span className="font-medium">3 students</span>
                            </div>
                            <Progress value={3} max={students.length} className="h-2 bg-slate-100 dark:bg-slate-800" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-primary" /> Submission Timing
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">73%</div>
                        <p className="text-sm text-slate-500">
                          Submit on time
                        </p>
                        <div className="mt-4 space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Early (24h+)</span>
                              <span className="font-medium">18%</span>
                            </div>
                            <Progress value={18} max={100} className="h-2 bg-green-100 dark:bg-green-900" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">On time (last 24h)</span>
                              <span className="font-medium">55%</span>
                            </div>
                            <Progress value={55} max={100} className="h-2 bg-blue-100 dark:bg-blue-900" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Late (up to 24h)</span>
                              <span className="font-medium">21%</span>
                            </div>
                            <Progress value={21} max={100} className="h-2 bg-amber-100 dark:bg-amber-900" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Very late (24h+)</span>
                              <span className="font-medium">6%</span>
                            </div>
                            <Progress value={6} max={100} className="h-2 bg-red-100 dark:bg-red-900" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-primary" /> Course Content Engagement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">86%</div>
                        <p className="text-sm text-slate-500">
                          Overall content interaction rate
                        </p>
                        <div className="mt-4 space-y-3">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Lecture Slides</span>
                              <span className="font-medium">94%</span>
                            </div>
                            <Progress value={94} max={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Reading Materials</span>
                              <span className="font-medium">78%</span>
                            </div>
                            <Progress value={78} max={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Video Lectures</span>
                              <span className="font-medium">92%</span>
                            </div>
                            <Progress value={92} max={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600 dark:text-slate-400">Practice Exercises</span>
                              <span className="font-medium">81%</span>
                            </div>
                            <Progress value={81} max={100} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Performance Across Assignments</h3>
                    <div className="border rounded-md p-4 h-80 flex items-end justify-around">
                      {/* This would be a real chart in a production app */}
                      <div className="flex items-end justify-between w-full h-full">
                        {assignments.map((assignment, i) => {
                          const stats = calculateStats(assignment.id);
                          const percentage = stats.avg / assignment.maxPoints * 100;
                          const height = `${percentage}%`;
                          
                          return (
                            <div key={assignment.id} className="flex flex-col items-center">
                              <div 
                                className="w-16 bg-primary rounded-t relative"
                                style={{ height }}
                              >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-slate-500 max-w-24 text-center truncate" title={assignment.title}>
                                {assignment.title.substring(0, assignment.title.indexOf(":") > 0 ? assignment.title.indexOf(":") : assignment.title.length)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-8">At-Risk Students</h3>
                    <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Current Grade</TableHead>
                            <TableHead>Last Submission</TableHead>
                            <TableHead>Missing Assignments</TableHead>
                            <TableHead>Attendance</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>JM</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">Jacob Miller</div>
                                  <div className="text-xs text-slate-500">S10023461</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
                                65.2% (D)
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-slate-600 dark:text-slate-300">Assignment 2</div>
                              <div className="text-xs text-slate-500">2 weeks ago</div>
                            </TableCell>
                            <TableCell>
                              <Badge>3</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Progress value={65} max={100} className="h-2 w-24 mr-2" />
                                <span className="text-xs">65%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">Contact</Button>
                            </TableCell>
                          </TableRow>
                          
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>MB</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">Michael Brown</div>
                                  <div className="text-xs text-slate-500">S10023459</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50">
                                71.8% (C-)
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-slate-600 dark:text-slate-300">Midterm Exam</div>
                              <div className="text-xs text-slate-500">3 days ago</div>
                            </TableCell>
                            <TableCell>
                              <Badge>1</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Progress value={76} max={100} className="h-2 w-24 mr-2" />
                                <span className="text-xs">76%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm">Contact</Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Gradebook Settings</CardTitle>
                  <CardDescription>
                    Configure grading scheme, visibility, and other settings
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Grading Scale</h3>
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="grid md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">A+</label>
                          <Input placeholder="97-100%" defaultValue="97-100%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">A</label>
                          <Input placeholder="93-96%" defaultValue="93-96%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">A-</label>
                          <Input placeholder="90-92%" defaultValue="90-92%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">B+</label>
                          <Input placeholder="87-89%" defaultValue="87-89%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">B</label>
                          <Input placeholder="83-86%" defaultValue="83-86%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">B-</label>
                          <Input placeholder="80-82%" defaultValue="80-82%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">C+</label>
                          <Input placeholder="77-79%" defaultValue="77-79%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">C</label>
                          <Input placeholder="73-76%" defaultValue="73-76%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">C-</label>
                          <Input placeholder="70-72%" defaultValue="70-72%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">D+</label>
                          <Input placeholder="67-69%" defaultValue="67-69%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">D</label>
                          <Input placeholder="63-66%" defaultValue="63-66%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">D-</label>
                          <Input placeholder="60-62%" defaultValue="60-62%" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">F</label>
                          <Input placeholder="0-59%" defaultValue="0-59%" />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Save Scale</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Grade Visibility</h3>
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Show Points and Percentages</div>
                          <div className="text-sm text-slate-500">
                            Display both raw scores and percentage values to students
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Show Letter Grades</div>
                          <div className="text-sm text-slate-500">
                            Display letter grade equivalents to students
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Show Assignment Statistics</div>
                          <div className="text-sm text-slate-500">
                            Let students see class averages and distributions
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Show Feedback</div>
                          <div className="text-sm text-slate-500">
                            Make assignment feedback visible to students
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Release Grades Automatically</div>
                          <div className="text-sm text-slate-500">
                            Make grades visible to students as soon as they are entered
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Calculation Settings</h3>
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Drop Lowest Score</div>
                          <div className="text-sm text-slate-500">
                            Automatically drop each student's lowest score in each category
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Weight by Categories</div>
                          <div className="text-sm text-slate-500">
                            Calculate grades based on category weights instead of individual assignments
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Include Ungraded Items as Zero</div>
                          <div className="text-sm text-slate-500">
                            Count ungraded assignments as zero in grade calculations
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
                        <div>
                          <div className="font-medium">Round Final Grades</div>
                          <div className="text-sm text-slate-500">
                            Round up final grades to nearest whole number (e.g., 89.5% to 90%)
                          </div>
                        </div>
                        <div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save All Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  );
}