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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit, 
  FileText, 
  MessageSquare, 
  BarChart, 
  File, 
  Plus, 
  MoreVertical, 
  Upload,
  Download,
  Search
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export default function MyCoursesPage() {
  const { user } = useAuth();
  
  // Sample faculty courses data
  const sampleCourses = [
    {
      id: 1,
      code: "CS 301",
      title: "Software Engineering",
      semester: "Fall 2024",
      schedule: [
        { day: "Monday", start: "10:00 AM", end: "11:30 AM", location: "Engineering Building, Room 205" },
        { day: "Wednesday", start: "10:00 AM", end: "11:30 AM", location: "Engineering Building, Room 205" }
      ],
      enrollmentCount: 32,
      capacity: 35,
      description: "Introduction to software engineering principles, including requirements, design, implementation, testing, and project management.",
      announcements: [
        { id: 1, title: "Midterm Exam", content: "The midterm exam will be held on October 15th. It will cover chapters 1-5.", date: new Date(2024, 9, 5) },
        { id: 2, title: "Project Groups", content: "Please form groups of 3-4 students for the final project by next week.", date: new Date(2024, 9, 1) }
      ],
      materials: [
        { id: 1, title: "Syllabus", type: "pdf", date: new Date(2024, 8, 1), size: "245 KB" },
        { id: 2, title: "Lecture Slides - Week 1", type: "pptx", date: new Date(2024, 8, 5), size: "1.2 MB" },
        { id: 3, title: "Lecture Slides - Week 2", type: "pptx", date: new Date(2024, 8, 12), size: "1.5 MB" },
        { id: 4, title: "Reading List", type: "pdf", date: new Date(2024, 8, 1), size: "320 KB" }
      ],
      assignments: [
        { id: 1, title: "Assignment 1: Requirements Document", due: new Date(2024, 8, 15), maxPoints: 100, submitted: 28, graded: 25 },
        { id: 2, title: "Assignment 2: System Design", due: new Date(2024, 9, 5), maxPoints: 100, submitted: 15, graded: 0 },
        { id: 3, title: "Final Project", due: new Date(2024, 10, 20), maxPoints: 200, submitted: 0, graded: 0 }
      ],
      students: 32
    },
    {
      id: 2,
      code: "CS 401",
      title: "Advanced Database Systems",
      semester: "Fall 2024",
      schedule: [
        { day: "Tuesday", start: "2:00 PM", end: "3:30 PM", location: "Science Hall, Room 103" },
        { day: "Thursday", start: "2:00 PM", end: "3:30 PM", location: "Science Hall, Room 103" }
      ],
      enrollmentCount: 25,
      capacity: 30,
      description: "Advanced topics in database management systems, including query optimization, transaction processing, concurrency control, and distributed databases.",
      announcements: [
        { id: 3, title: "Lab Session", content: "Additional lab session on Friday at 2:00 PM for students who need help with assignment 1.", date: new Date(2024, 8, 20) }
      ],
      materials: [
        { id: 5, title: "Syllabus", type: "pdf", date: new Date(2024, 8, 1), size: "210 KB" },
        { id: 6, title: "Database Design Examples", type: "pdf", date: new Date(2024, 8, 10), size: "560 KB" },
        { id: 7, title: "Lecture Notes - Indexing", type: "pdf", date: new Date(2024, 8, 17), size: "450 KB" }
      ],
      assignments: [
        { id: 4, title: "Assignment 1: Database Design", due: new Date(2024, 8, 20), maxPoints: 100, submitted: 22, graded: 20 },
        { id: 5, title: "Assignment 2: Query Optimization", due: new Date(2024, 9, 10), maxPoints: 100, submitted: 0, graded: 0 }
      ],
      students: 25
    },
    {
      id: 3,
      code: "CS 210",
      title: "Data Structures and Algorithms",
      semester: "Fall 2024",
      schedule: [
        { day: "Monday", start: "1:00 PM", end: "2:30 PM", location: "Computer Science Building, Room 302" },
        { day: "Wednesday", start: "1:00 PM", end: "2:30 PM", location: "Computer Science Building, Room 302" },
        { day: "Friday", start: "1:00 PM", end: "2:00 PM", location: "Computer Lab, Room 105" }
      ],
      enrollmentCount: 45,
      capacity: 45,
      description: "Study of fundamental data structures and algorithms, including sorting, searching, trees, graphs, and complexity analysis.",
      announcements: [],
      materials: [
        { id: 8, title: "Syllabus", type: "pdf", date: new Date(2024, 8, 1), size: "280 KB" },
        { id: 9, title: "Lecture Notes - Arrays & Lists", type: "pdf", date: new Date(2024, 8, 8), size: "380 KB" }
      ],
      assignments: [
        { id: 6, title: "Assignment 1: Arrays and Linked Lists", due: new Date(2024, 8, 18), maxPoints: 50, submitted: 42, graded: 40 },
        { id: 7, title: "Assignment 2: Trees", due: new Date(2024, 9, 8), maxPoints: 50, submitted: 0, graded: 0 },
        { id: 8, title: "Midterm Exam", due: new Date(2024, 9, 15), maxPoints: 100, submitted: 0, graded: 0 }
      ],
      students: 45
    }
  ];
  
  const getCourseStatusColor = (enrolled: number, capacity: number) => {
    const ratio = enrolled / capacity;
    if (ratio >= 0.9) return "bg-red-500";
    if (ratio >= 0.7) return "bg-amber-500";
    return "bg-emerald-500";
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx': return <File className="h-4 w-4 text-blue-500" />;
      case 'ppt':
      case 'pptx': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'xls':
      case 'xlsx': return <BarChart className="h-4 w-4 text-green-500" />;
      default: return <File className="h-4 w-4 text-slate-500" />;
    }
  };

  // Tab state
  const sampleStudents = [
    { id: 1, name: "Jane Smith", email: "jane.smith@university.edu", studentId: "S10023456", attendance: 85, grade: "B+" },
    { id: 2, name: "John Doe", email: "john.doe@university.edu", studentId: "S10023457", attendance: 92, grade: "A-" },
    { id: 3, name: "Emily Johnson", email: "emily.j@university.edu", studentId: "S10023458", attendance: 78, grade: "B" },
    { id: 4, name: "Michael Brown", email: "m.brown@university.edu", studentId: "S10023459", attendance: 95, grade: "A" },
    { id: 5, name: "Sophia Williams", email: "s.williams@university.edu", studentId: "S10023460", attendance: 88, grade: "B+" },
    { id: 6, name: "Jacob Miller", email: "j.miller@university.edu", studentId: "S10023461", attendance: 65, grade: "C" },
    { id: 7, name: "Olivia Davis", email: "o.davis@university.edu", studentId: "S10023462", attendance: 90, grade: "A-" },
    { id: 8, name: "Ethan Garcia", email: "e.garcia@university.edu", studentId: "S10023463", attendance: 82, grade: "B" }
  ];

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-slate-500 mt-1">
              Manage your courses, materials, and student interactions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Schedule
            </Button>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> New Course
            </Button>
          </div>
        </div>
        
        {/* Course Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {sampleCourses.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="font-normal bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20">
                    {course.semester}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Course Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" /> Edit Course
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> View Syllabus
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2" /> Message Students
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <BarChart className="h-4 w-4 mr-2" /> View Analytics
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-xl">{course.code}: {course.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mt-2 space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div className="flex-1">
                      {course.schedule.map((session, i) => (
                        <div key={i} className="text-slate-600 dark:text-slate-300">
                          {session.day}: {session.start} - {session.end}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div className="text-slate-600 dark:text-slate-300">
                      {course.schedule[0].location}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="h-4 w-4 text-slate-500 mt-0.5" />
                    <div className="text-slate-600 dark:text-slate-300">
                      {course.enrollmentCount} / {course.capacity} Students
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-sm font-medium mb-1 flex justify-between">
                    <span>Enrollment</span>
                    <span>{Math.round(course.enrollmentCount / course.capacity * 100)}%</span>
                  </div>
                  <Progress value={course.enrollmentCount} max={course.capacity} className={`h-2 ${getCourseStatusColor(course.enrollmentCount, course.capacity)}`} />
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm font-medium mb-2">
                    <span>Recent Activity</span>
                  </div>
                  <div className="space-y-2">
                    {course.assignments.slice(0, 1).map(assignment => (
                      <div key={assignment.id} className="text-sm flex items-center justify-between border-l-2 border-blue-500 pl-2 py-1">
                        <span className="text-slate-700 dark:text-slate-300">{assignment.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {assignment.submitted}/{course.students} Submitted
                        </Badge>
                      </div>
                    ))}
                    {course.announcements.slice(0, 1).map(announcement => (
                      <div key={announcement.id} className="text-sm flex items-center justify-between border-l-2 border-green-500 pl-2 py-1">
                        <span className="text-slate-700 dark:text-slate-300">{announcement.title}</span>
                        <span className="text-xs text-slate-500">
                          {format(announcement.date, 'MMM d')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-2 pt-0 flex justify-between border-t mt-4">
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300">View Gradebook</Button>
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300">Course Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Course Detail Tabs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>CS 301: Software Engineering</CardTitle>
            <CardDescription>
              Fall 2024 • Engineering Building, Room 205 • 32/35 Students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Course Description</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {sampleCourses[0].description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Schedule</h3>
                    <div className="space-y-2">
                      {sampleCourses[0].schedule.map((session, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 border rounded-md">
                          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{session.day}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                <span>{session.start} - {session.end}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span>{session.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Assignments</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{sampleCourses[0].assignments.length}</div>
                        <p className="text-sm text-slate-500">
                          {sampleCourses[0].assignments.filter(a => a.graded > 0).length} graded
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Students</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{sampleCourses[0].students}</div>
                        <p className="text-sm text-slate-500">
                          {Math.round(sampleCourses[0].enrollmentCount / sampleCourses[0].capacity * 100)}% of capacity
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-primary" />
                          <CardTitle className="text-base">Average Grade</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">87.3%</div>
                        <p className="text-sm text-slate-500">
                          B+ class average
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="students">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="relative w-72">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input placeholder="Search students..." className="pl-10" />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex items-center gap-1">
                        <Download className="h-4 w-4" /> Export
                      </Button>
                      <Button className="flex items-center gap-1">
                        <Plus className="h-4 w-4" /> Add Student
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Attendance</TableHead>
                          <TableHead>Current Grade</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleStudents.map(student => (
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
                            <TableCell>{student.studentId}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress className="h-2 flex-grow" value={student.attendance} max={100} />
                                <span className="text-sm">{student.attendance}%</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge>{student.grade}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="materials">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Course Materials</h3>
                    <Button className="flex items-center gap-1">
                      <Upload className="h-4 w-4" /> Upload Material
                    </Button>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Visibility</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleCourses[0].materials.map(material => (
                          <TableRow key={material.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getFileIcon(material.type)}
                                <span>{material.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">{material.type}</TableCell>
                            <TableCell>{format(material.date, 'MMM d, yyyy')}</TableCell>
                            <TableCell>{material.size}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch checked={true} />
                                <span className="text-sm">Visible</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="assignments">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Assignments & Assessments</h3>
                    <Button className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> Create Assignment
                    </Button>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Max Points</TableHead>
                          <TableHead>Submissions</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleCourses[0].assignments.map(assignment => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>{format(assignment.due, 'MMM d, yyyy')}</TableCell>
                            <TableCell>{assignment.maxPoints}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress 
                                  className="h-2 flex-grow" 
                                  value={assignment.submitted} 
                                  max={sampleCourses[0].students} 
                                />
                                <span className="text-sm">
                                  {assignment.submitted}/{sampleCourses[0].students}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {assignment.submitted === 0 ? (
                                <Badge variant="outline">Not Started</Badge>
                              ) : assignment.graded === 0 ? (
                                <Badge variant="secondary">Needs Grading</Badge>
                              ) : (
                                <Badge variant="default">Graded</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="announcements">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Course Announcements</h3>
                    <Button className="flex items-center gap-1">
                      <Plus className="h-4 w-4" /> New Announcement
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {sampleCourses[0].announcements.length > 0 ? (
                      sampleCourses[0].announcements.map(announcement => (
                        <Card key={announcement.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">{announcement.title}</CardTitle>
                              <span className="text-sm text-slate-500">
                                {format(announcement.date, 'MMMM d, yyyy')}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-600 dark:text-slate-300">
                              {announcement.content}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between pt-0">
                            <div className="text-sm text-slate-500">
                              Posted by {user?.firstName} {user?.lastName}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-10 border rounded-md">
                        <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No Announcements</h3>
                        <p className="text-slate-500 max-w-md mx-auto mt-1 mb-4">
                          You haven't posted any announcements for this course yet.
                        </p>
                        <Button>Create Announcement</Button>
                      </div>
                    )}
                    
                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-3">New Announcement</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Title</label>
                          <Input placeholder="Enter announcement title" />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Content</label>
                          <Textarea 
                            placeholder="Enter announcement content" 
                            className="min-h-32"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="sendEmail" />
                          <label htmlFor="sendEmail" className="text-sm cursor-pointer">
                            Also send as email to all students
                          </label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Save as Draft</Button>
                          <Button>Post Announcement</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}