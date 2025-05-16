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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Printer, GraduationCap, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function TranscriptPage() {
  const { user } = useAuth();
  
  // Sample transcript data
  const studentInfo = {
    id: "S12345678",
    program: "Bachelor of Science in Computer Science",
    college: "College of Engineering and Computer Science",
    matriculation: "Fall 2022",
    anticipatedGraduation: "Spring 2026",
    academicStanding: "Good Standing",
    totalCredits: 61,
    cumulativeGPA: 3.56
  };
  
  const semesters = [
    {
      id: 1,
      name: "Fall 2022",
      courses: [
        { id: 1, code: "CS 101", title: "Introduction to Computer Science", credits: 3, grade: "A", gpa: 4.0 },
        { id: 2, code: "MATH 101", title: "College Algebra", credits: 3, grade: "A-", gpa: 3.7 },
        { id: 3, code: "ENG 101", title: "Composition I", credits: 3, grade: "B+", gpa: 3.3 },
        { id: 4, code: "HIST 101", title: "World History", credits: 3, grade: "B", gpa: 3.0 },
        { id: 5, code: "CHEM 101", title: "General Chemistry", credits: 4, grade: "B", gpa: 3.0 }
      ],
      totalCredits: 16,
      semesterGPA: 3.38,
      cumulativeGPA: 3.38
    },
    {
      id: 2,
      name: "Spring 2023",
      courses: [
        { id: 6, code: "CS 102", title: "Data Structures and Algorithms", credits: 3, grade: "A", gpa: 4.0 },
        { id: 7, code: "MATH 201", title: "Calculus I", credits: 4, grade: "B+", gpa: 3.3 },
        { id: 8, code: "ENG 102", title: "Composition II", credits: 3, grade: "A-", gpa: 3.7 },
        { id: 9, code: "PHYS 101", title: "Physics I", credits: 4, grade: "B", gpa: 3.0 },
        { id: 10, code: "PSYC 101", title: "Introduction to Psychology", credits: 3, grade: "A", gpa: 4.0 }
      ],
      totalCredits: 17,
      semesterGPA: 3.58,
      cumulativeGPA: 3.48
    },
    {
      id: 3,
      name: "Fall 2023",
      courses: [
        { id: 11, code: "CS 201", title: "Computer Organization", credits: 3, grade: "B+", gpa: 3.3 },
        { id: 12, code: "CS 203", title: "Database Systems", credits: 3, grade: "A", gpa: 4.0 },
        { id: 13, code: "MATH 202", title: "Calculus II", credits: 4, grade: "B", gpa: 3.0 },
        { id: 14, code: "PHYS 102", title: "Physics II", credits: 4, grade: "B+", gpa: 3.3 },
        { id: 15, code: "COMM 101", title: "Public Speaking", credits: 3, grade: "A-", gpa: 3.7 }
      ],
      totalCredits: 17,
      semesterGPA: 3.45,
      cumulativeGPA: 3.47
    },
    {
      id: 4,
      name: "Spring 2024",
      courses: [
        { id: 16, code: "CS 301", title: "Software Engineering", credits: 3, grade: "A", gpa: 4.0 },
        { id: 17, code: "CS 310", title: "Algorithms and Complexity", credits: 3, grade: "A-", gpa: 3.7 },
        { id: 18, code: "MATH 301", title: "Linear Algebra", credits: 3, grade: "B+", gpa: 3.3 },
        { id: 19, code: "STAT 201", title: "Statistics for Engineers", credits: 3, grade: "A", gpa: 4.0 },
        { id: 20, code: "PHIL 105", title: "Ethics in Technology", credits: 3, grade: "A", gpa: 4.0 }
      ],
      totalCredits: 15,
      semesterGPA: 3.80,
      cumulativeGPA: 3.56
    }
  ];
  
  // Transcript header - used like letterhead
  const TranscriptHeader = () => (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-primary mb-1">University of Technology</h1>
      <p className="text-slate-500">Office of the Registrar</p>
      <p className="text-slate-500">1234 University Avenue, Techville, CA 90210</p>
      <div className="mt-6 border-y-2 border-slate-200 py-2">
        <h2 className="text-xl font-bold">Official Academic Transcript</h2>
      </div>
    </div>
  );

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Academic Transcript</h1>
          <div className="space-x-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button className="flex items-center gap-1">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>
        
        <Card className="mb-8 border-2 print:border-0">
          <CardContent className="p-8">
            <TranscriptHeader />
            
            {/* Student Information */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Student Name</p>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Student ID</p>
                <p className="font-medium">{studentInfo.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Program</p>
                <p className="font-medium">{studentInfo.program}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">College</p>
                <p className="font-medium">{studentInfo.college}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Matriculation</p>
                <p className="font-medium">{studentInfo.matriculation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Anticipated Graduation</p>
                <p className="font-medium">{studentInfo.anticipatedGraduation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Academic Standing</p>
                <p className="font-medium">
                  <Badge variant="outline" className="font-normal">
                    {studentInfo.academicStanding}
                  </Badge>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-500">Cumulative GPA</p>
                <p className="font-medium">{studentInfo.cumulativeGPA.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Transcript Content */}
            <div className="space-y-6">
              {semesters.map((semester) => (
                <div key={semester.id} className="border rounded-md overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-b flex justify-between">
                    <h3 className="font-bold">{semester.name}</h3>
                    <div className="text-sm">
                      <span className="mr-4">Term GPA: <strong>{semester.semesterGPA.toFixed(2)}</strong></span>
                      <span>Cum. GPA: <strong>{semester.cumulativeGPA.toFixed(2)}</strong></span>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Course Code</TableHead>
                        <TableHead>Course Title</TableHead>
                        <TableHead className="text-center">Credits</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead className="text-center">Grade Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {semester.courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>{course.title}</TableCell>
                          <TableCell className="text-center">{course.credits}</TableCell>
                          <TableCell className="text-center font-semibold">{course.grade}</TableCell>
                          <TableCell className="text-center">{(course.gpa * course.credits).toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-slate-50 dark:bg-slate-800">
                        <TableCell colSpan={2} className="font-medium">
                          Semester Totals
                        </TableCell>
                        <TableCell className="text-center font-medium">{semester.totalCredits}</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-center font-medium">
                          {(semester.semesterGPA * semester.totalCredits).toFixed(1)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="mt-8 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-primary" /> Cumulative GPA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{studentInfo.cumulativeGPA.toFixed(2)}</div>
                    <p className="text-sm text-slate-500 mt-1">On a 4.0 scale</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" /> Total Credits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{studentInfo.totalCredits}</div>
                    <p className="text-sm text-slate-500 mt-1">Credits earned</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Degree Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">50.8%</div>
                    <p className="text-sm text-slate-500 mt-1">61/120 credits completed</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-4 border-t text-center text-sm text-slate-500">
              <p className="italic">This transcript is not valid without the university seal and signature of the registrar.</p>
              <p className="mt-2">Generated on {new Date().toLocaleDateString()} for verification purposes only.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}