import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { 
  CalendarIcon, 
  Calendar as CalendarIcon2, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  MessageSquare, 
  UserPlus, 
  Plus, 
  ArrowRight, 
  FileText, 
  CheckCircle, 
  XCircle, 
  MoreVertical, 
  Pencil, 
  ChevronsUpDown, 
  BookOpen,
  Filter,
} from "lucide-react";
import { format, addDays, addHours, addMinutes, isSameDay } from "date-fns";

export default function OfficeHoursPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [schedulerView, setSchedulerView] = useState<"day" | "week">("week");
  
  // Sample office hours and appointments data
  const officeHours = [
    { 
      id: 1, 
      dayOfWeek: "Monday", 
      startTime: "10:00 AM", 
      endTime: "12:00 PM", 
      location: "Engineering Building, Room 305",
      locationLink: "https://maps.university.edu/eng/305",
      virtualOption: true,
      virtualLink: "https://university.zoom.us/j/123456789",
      course: { code: "CS 301", title: "Software Engineering" },
      recurrence: "weekly",
      bookable: true
    },
    { 
      id: 2, 
      dayOfWeek: "Wednesday", 
      startTime: "2:00 PM", 
      endTime: "4:00 PM", 
      location: "Faculty Office Building, Room 210",
      locationLink: "https://maps.university.edu/fac/210",
      virtualOption: true,
      virtualLink: "https://university.zoom.us/j/123456789",
      course: { code: "CS 401", title: "Advanced Database Systems" },
      recurrence: "weekly",
      bookable: true
    },
    { 
      id: 3, 
      dayOfWeek: "Friday", 
      startTime: "1:00 PM", 
      endTime: "3:00 PM", 
      location: "Virtual Only",
      locationLink: null,
      virtualOption: true,
      virtualLink: "https://university.zoom.us/j/987654321",
      course: { code: "CS 210", title: "Data Structures and Algorithms" },
      recurrence: "weekly",
      bookable: true
    }
  ];
  
  const appointments = [
    {
      id: 1,
      student: { id: 1, name: "Jane Smith", email: "jane.smith@university.edu", studentId: "S10023456" },
      officeHoursId: 1,
      date: addDays(new Date(), 1),
      startTime: "10:30 AM",
      endTime: "11:00 AM",
      purpose: "Assignment help: Need assistance with the requirements document for Assignment 1",
      status: "confirmed",
      virtual: true
    },
    {
      id: 2,
      student: { id: 2, name: "John Doe", email: "john.doe@university.edu", studentId: "S10023457" },
      officeHoursId: 1,
      date: addDays(new Date(), 1),
      startTime: "11:00 AM",
      endTime: "11:30 AM",
      purpose: "Project discussion: Want to review my project proposal before submission",
      status: "confirmed",
      virtual: false
    },
    {
      id: 3,
      student: { id: 3, name: "Emily Johnson", email: "emily.j@university.edu", studentId: "S10023458" },
      officeHoursId: 2,
      date: addDays(new Date(), 3),
      startTime: "2:00 PM",
      endTime: "2:30 PM",
      purpose: "Grade discussion: Would like to review feedback on my midterm exam",
      status: "confirmed",
      virtual: true
    },
    {
      id: 4,
      student: { id: 4, name: "Michael Brown", email: "m.brown@university.edu", studentId: "S10023459" },
      officeHoursId: 3,
      date: addDays(new Date(), 5),
      startTime: "1:30 PM",
      endTime: "2:00 PM",
      purpose: "Course planning: Need advice on which courses to take next semester",
      status: "pending",
      virtual: true
    }
  ];
  
  const courses = [
    { id: 1, code: "CS 301", title: "Software Engineering", section: "Section 01", semester: "Fall 2024" },
    { id: 2, code: "CS 401", title: "Advanced Database Systems", section: "Section 01", semester: "Fall 2024" },
    { id: 3, code: "CS 210", title: "Data Structures and Algorithms", section: "Section 01", semester: "Fall 2024" }
  ];
  
  // Get office hours for the selected day of week
  const getDayName = (date: Date) => {
    return format(date, 'EEEE');
  };
  
  const getOfficeHoursForSelectedDay = () => {
    if (!selectedDate) return [];
    const dayName = getDayName(selectedDate);
    return officeHours.filter(oh => oh.dayOfWeek === dayName);
  };
  
  // Get appointments for the selected date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };
  
  // Generate time slots for scheduler
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      const hourStr = hour > 12 ? `${hour - 12}:00` : hour === 12 ? "12:00" : `${hour}:00`;
      const meridiem = hour >= 12 ? "PM" : "AM";
      slots.push({
        time: `${hourStr} ${meridiem}`,
        hour,
        minute: 0
      });
      
      const halfHourStr = hour > 12 ? `${hour - 12}:30` : hour === 12 ? "12:30" : `${hour}:30`;
      slots.push({
        time: `${halfHourStr} ${meridiem}`,
        hour,
        minute: 30
      });
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  
  // Generate days for week view
  const generateWeekDays = () => {
    if (!selectedDate) return [];
    
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day + (day === 0 ? -6 : 1)); // Start from Monday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };
  
  const weekDays = generateWeekDays();
  
  // Check if a time slot has an office hour
  const getOfficeHourForTimeSlot = (date: Date, timeSlot: { time: string, hour: number, minute: number }) => {
    const dayName = getDayName(date);
    
    return officeHours.find(oh => {
      if (oh.dayOfWeek !== dayName) return false;
      
      const ohStartHour = parseInt(oh.startTime.split(':')[0]);
      const ohStartMinute = parseInt(oh.startTime.split(':')[1].split(' ')[0]);
      const ohStartMeridiem = oh.startTime.split(' ')[1];
      
      let startHour = ohStartHour;
      if (ohStartMeridiem === "PM" && ohStartHour !== 12) startHour += 12;
      if (ohStartMeridiem === "AM" && ohStartHour === 12) startHour = 0;
      
      const ohEndHour = parseInt(oh.endTime.split(':')[0]);
      const ohEndMinute = parseInt(oh.endTime.split(':')[1].split(' ')[0]);
      const ohEndMeridiem = oh.endTime.split(' ')[1];
      
      let endHour = ohEndHour;
      if (ohEndMeridiem === "PM" && ohEndHour !== 12) endHour += 12;
      if (ohEndMeridiem === "AM" && ohEndHour === 12) endHour = 0;
      
      const slotHour = timeSlot.hour;
      const slotMinute = timeSlot.minute;
      
      const slotIsAfterStart = slotHour > startHour || (slotHour === startHour && slotMinute >= ohStartMinute);
      const slotIsBeforeEnd = slotHour < endHour || (slotHour === endHour && slotMinute < ohEndMinute);
      
      return slotIsAfterStart && slotIsBeforeEnd;
    });
  };
  
  // Check if a time slot has an appointment
  const getAppointmentForTimeSlot = (date: Date, timeSlot: { time: string, hour: number, minute: number }) => {
    return appointments.find(apt => {
      if (!isSameDay(apt.date, date)) return false;
      
      const aptStartHour = parseInt(apt.startTime.split(':')[0]);
      const aptStartMinute = parseInt(apt.startTime.split(':')[1].split(' ')[0]);
      const aptStartMeridiem = apt.startTime.split(' ')[1];
      
      let startHour = aptStartHour;
      if (aptStartMeridiem === "PM" && aptStartHour !== 12) startHour += 12;
      if (aptStartMeridiem === "AM" && aptStartHour === 12) startHour = 0;
      
      const aptEndHour = parseInt(apt.endTime.split(':')[0]);
      const aptEndMinute = parseInt(apt.endTime.split(':')[1].split(' ')[0]);
      const aptEndMeridiem = apt.endTime.split(' ')[1];
      
      let endHour = aptEndHour;
      if (aptEndMeridiem === "PM" && aptEndHour !== 12) endHour += 12;
      if (aptEndMeridiem === "AM" && aptEndHour === 12) endHour = 0;
      
      const slotHour = timeSlot.hour;
      const slotMinute = timeSlot.minute;
      
      const slotIsAfterStart = slotHour > startHour || (slotHour === startHour && slotMinute >= aptStartMinute);
      const slotIsBeforeEnd = slotHour < endHour || (slotHour === endHour && slotMinute < aptEndMinute);
      
      return slotIsAfterStart && slotIsBeforeEnd;
    });
  };
  
  // State for creating new office hours
  const [newOfficeHours, setNewOfficeHours] = useState({
    dayOfWeek: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    virtualOption: false,
    virtualLink: "",
    course: "",
    recurrence: "weekly",
    bookable: true
  });
  
  // Mock function for handling new office hours creation
  const handleCreateOfficeHours = () => {
    console.log("Creating new office hours:", newOfficeHours);
    // Would call an API to create the office hours in a real app
  };
  
  // Mock function for handling appointment confirmation/rejection
  const handleAppointmentAction = (appointmentId: number, action: "confirm" | "reject") => {
    console.log(`${action === "confirm" ? "Confirming" : "Rejecting"} appointment ${appointmentId}`);
    // Would call an API to update the appointment in a real app
  };

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Office Hours</h1>
            <p className="text-slate-500 mt-1">
              Manage your availability and student appointments
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> New Office Hours
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Office Hours</DialogTitle>
                <DialogDescription>
                  Set up regular office hours for students to book appointments with you.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Day of Week</Label>
                    <Select
                      value={newOfficeHours.dayOfWeek}
                      onValueChange={(value) => setNewOfficeHours(prev => ({ ...prev, dayOfWeek: value }))}
                    >
                      <SelectTrigger id="day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="course">Associated Course</Label>
                    <Select
                      value={newOfficeHours.course}
                      onValueChange={(value) => setNewOfficeHours(prev => ({ ...prev, course: value }))}
                    >
                      <SelectTrigger id="course">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">General (No specific course)</SelectItem>
                        {courses.map(course => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.code}: {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newOfficeHours.startTime}
                      onChange={(e) => setNewOfficeHours(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newOfficeHours.endTime}
                      onChange={(e) => setNewOfficeHours(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Engineering Building, Room 305"
                    value={newOfficeHours.location}
                    onChange={(e) => setNewOfficeHours(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="virtualOption"
                    checked={newOfficeHours.virtualOption}
                    onCheckedChange={(checked) => setNewOfficeHours(prev => ({ ...prev, virtualOption: checked }))}
                  />
                  <Label htmlFor="virtualOption">Offer virtual meeting option</Label>
                </div>
                
                {newOfficeHours.virtualOption && (
                  <div className="space-y-2">
                    <Label htmlFor="virtualLink">Virtual Meeting Link</Label>
                    <Input
                      id="virtualLink"
                      placeholder="https://university.zoom.us/j/123456789"
                      value={newOfficeHours.virtualLink}
                      onChange={(e) => setNewOfficeHours(prev => ({ ...prev, virtualLink: e.target.value }))}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="recurrence">Recurrence</Label>
                  <Select
                    value={newOfficeHours.recurrence}
                    onValueChange={(value) => setNewOfficeHours(prev => ({ ...prev, recurrence: value }))}
                  >
                    <SelectTrigger id="recurrence">
                      <SelectValue placeholder="Select recurrence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="once">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="bookable"
                    checked={newOfficeHours.bookable}
                    onCheckedChange={(checked) => setNewOfficeHours(prev => ({ ...prev, bookable: checked }))}
                  />
                  <Label htmlFor="bookable">Allow students to book appointments</Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateOfficeHours}>Create Office Hours</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="schedule">
          <TabsList className="mb-6">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="office-hours">Office Hours</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Today
                </Button>
                
                <div className="flex">
                  <Button variant="outline" size="sm" className="rounded-r-none">
                    &lt;
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-l-none">
                    &gt;
                  </Button>
                </div>
                
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex gap-2">
                <div className="border rounded-md overflow-hidden">
                  <Button 
                    variant={schedulerView === "day" ? "default" : "ghost"} 
                    size="sm" 
                    className="rounded-none"
                    onClick={() => setSchedulerView("day")}
                  >
                    Day
                  </Button>
                  <Button 
                    variant={schedulerView === "week" ? "default" : "ghost"} 
                    size="sm" 
                    className="rounded-none"
                    onClick={() => setSchedulerView("week")}
                  >
                    Week
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                {schedulerView === "day" ? (
                  /* Day View */
                  <div className="flex">
                    {/* Time labels */}
                    <div className="w-20 flex-shrink-0 pt-12 pr-2 border-r">
                      {timeSlots.map((slot, index) => (
                        slot.minute === 0 && (
                          <div key={index} className="h-16 -mt-2.5 text-xs text-slate-500 text-right">
                            {slot.time}
                          </div>
                        )
                      ))}
                    </div>
                    
                    {/* Day column */}
                    <div className="flex-1">
                      <div className="h-12 border-b px-2 flex items-center justify-center font-medium">
                        {selectedDate && format(selectedDate, 'EEEE, MMMM d')}
                      </div>
                      
                      {/* Time slots */}
                      <div className="relative">
                        {timeSlots.map((slot, index) => {
                          const officeHour = selectedDate && getOfficeHourForTimeSlot(selectedDate, slot);
                          const appointment = selectedDate && getAppointmentForTimeSlot(selectedDate, slot);
                          
                          return (
                            <div 
                              key={index} 
                              className={`h-8 border-b ${slot.minute === 0 ? 'border-slate-200' : 'border-slate-100'}`}
                            >
                              {officeHour && slot.minute === 0 && (
                                <div className="absolute left-0 right-0 bg-blue-100 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-md overflow-hidden shadow-sm" style={{
                                  top: `${(index * 32) + 2}px`,
                                  height: `${(2 * 60) * 32/60}px`, // 2 hours in this example
                                  zIndex: 10
                                }}>
                                  <div className="p-2 text-sm">
                                    <div className="font-medium text-blue-700 dark:text-blue-300">
                                      Office Hours: {officeHour.course.code}
                                    </div>
                                    <div className="flex items-center text-xs mt-1 text-slate-600 dark:text-slate-300">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>{officeHour.startTime} - {officeHour.endTime}</span>
                                    </div>
                                    <div className="flex items-center text-xs mt-1 text-slate-600 dark:text-slate-300">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      <span>{officeHour.location}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {appointment && (
                                <div className="absolute left-0 right-0 bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-md overflow-hidden shadow-sm" style={{
                                  top: `${index * 32}px`,
                                  height: `${(0.5 * 60) * 32/60}px`, // 30 minutes
                                  zIndex: 20
                                }}>
                                  <div className="p-2 text-xs">
                                    <div className="font-medium text-green-700 dark:text-green-300 flex items-center justify-between">
                                      <span>Appointment: {appointment.student.name}</span>
                                      <Badge variant={appointment.virtual ? "outline" : "default"} className="text-xs">
                                        {appointment.virtual ? "Virtual" : "In-person"}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center text-xs mt-1 text-slate-600 dark:text-slate-300">
                                      <Clock className="h-3 w-3 mr-1" />
                                      <span>{appointment.startTime} - {appointment.endTime}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Week View */
                  <div className="flex">
                    {/* Time labels */}
                    <div className="w-20 flex-shrink-0 pt-12 pr-2 border-r">
                      {timeSlots.map((slot, index) => (
                        slot.minute === 0 && (
                          <div key={index} className="h-16 -mt-2.5 text-xs text-slate-500 text-right">
                            {slot.time}
                          </div>
                        )
                      ))}
                    </div>
                    
                    {/* Week columns */}
                    <div className="flex-1 flex">
                      {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="flex-1 border-r last:border-r-0">
                          <div 
                            className={`h-12 border-b px-2 flex items-center justify-center font-medium text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${isSameDay(day, new Date()) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            onClick={() => setSelectedDate(day)}
                          >
                            <div className="text-center">
                              <div>{format(day, 'EEE')}</div>
                              <div className={`text-lg ${isSameDay(day, new Date()) ? 'text-blue-600 dark:text-blue-400 font-bold' : ''}`}>
                                {format(day, 'd')}
                              </div>
                            </div>
                          </div>
                          
                          {/* Time slots */}
                          <div className="relative">
                            {timeSlots.map((slot, slotIndex) => {
                              const officeHour = getOfficeHourForTimeSlot(day, slot);
                              const appointment = getAppointmentForTimeSlot(day, slot);
                              
                              return (
                                <div 
                                  key={slotIndex} 
                                  className={`h-8 border-b ${slot.minute === 0 ? 'border-slate-200' : 'border-slate-100'}`}
                                >
                                  {officeHour && slot.minute === 0 && (
                                    <div className="absolute left-0.5 right-0.5 bg-blue-100 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-md overflow-hidden shadow-sm" style={{
                                      top: `${(slotIndex * 32) + 2}px`,
                                      height: `${(2 * 60) * 32/60}px`, // 2 hours in this example
                                      zIndex: 10
                                    }}>
                                      <div className="p-1 text-xs">
                                        <div className="font-medium text-blue-700 dark:text-blue-300 truncate">
                                          {officeHour.course.code}
                                        </div>
                                        <div className="truncate text-xs text-slate-600 dark:text-slate-300">
                                          {officeHour.startTime}-{officeHour.endTime}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {appointment && (
                                    <div className="absolute left-0.5 right-0.5 bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 rounded-r-md overflow-hidden shadow-sm" style={{
                                      top: `${slotIndex * 32}px`,
                                      height: `${(0.5 * 60) * 32/60}px`, // 30 minutes
                                      zIndex: 20
                                    }}>
                                      <div className="p-1 text-xs">
                                        <div className="font-medium text-green-700 dark:text-green-300 truncate">
                                          {appointment.student.name}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Upcoming Appointments */}
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Upcoming Appointments</h2>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map(apt => {
                        const officeHour = officeHours.find(oh => oh.id === apt.officeHoursId);
                        
                        return (
                          <TableRow key={apt.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {apt.student.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{apt.student.name}</div>
                                  <div className="text-xs text-slate-500">{apt.student.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>{format(apt.date, 'MMM d, yyyy')}</div>
                              <div className="text-xs text-slate-500">
                                {apt.startTime} - {apt.endTime}
                              </div>
                            </TableCell>
                            <TableCell>
                              {officeHour && (
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4 text-slate-400" />
                                  <span>{officeHour.course.code}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={apt.virtual ? "outline" : "default"}>
                                {apt.virtual ? (
                                  <div className="flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    <span>Virtual</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>In-person</span>
                                  </div>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate" title={apt.purpose}>
                                {apt.purpose}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={apt.status === "confirmed" ? "default" : "secondary"}
                                className={apt.status === "pending" ? "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-800/20 dark:text-amber-400" : ""}
                              >
                                {apt.status === "confirmed" ? "Confirmed" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {apt.status === "pending" ? (
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-green-600 h-8 px-2"
                                    onClick={() => handleAppointmentAction(apt.id, "confirm")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-red-600 h-8 px-2"
                                    onClick={() => handleAppointmentAction(apt.id, "reject")}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              ) : (
                                <Button size="sm" variant="outline" className="h-8">
                                  View Details
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Office Hours Tab */}
          <TabsContent value="office-hours">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Office Hours</CardTitle>
                      <CardDescription>
                        Regular office hours available to students
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Office Hours
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px]">
                        {/* Same content as the dialog in the button above */}
                        <DialogHeader>
                          <DialogTitle>Create New Office Hours</DialogTitle>
                          <DialogDescription>
                            Set up regular office hours for students to book appointments with you.
                          </DialogDescription>
                        </DialogHeader>
                        {/* Form fields would go here, duplicated from earlier */}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {officeHours.map(oh => (
                      <Card key={oh.id} className="overflow-hidden">
                        <div className="flex border-l-4 border-blue-500">
                          <div className="p-4 flex-1">
                            <div className="flex justify-between mb-2">
                              <h3 className="font-medium text-lg">
                                {oh.dayOfWeek}s, {oh.startTime} - {oh.endTime}
                              </h3>
                              <Badge>
                                {oh.recurrence === "weekly" ? "Weekly" : 
                                 oh.recurrence === "biweekly" ? "Bi-weekly" : 
                                 oh.recurrence === "monthly" ? "Monthly" : "One-time"}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                              <div>
                                <div className="text-sm text-slate-500 mb-1">Location</div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-slate-400" />
                                  <span>{oh.location}</span>
                                </div>
                              </div>
                              
                              {oh.virtualOption && (
                                <div>
                                  <div className="text-sm text-slate-500 mb-1">Virtual Option</div>
                                  <div className="flex items-center gap-1">
                                    <Video className="h-4 w-4 text-slate-400" />
                                    <a 
                                      href={oh.virtualLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      Join Virtual Meeting
                                    </a>
                                  </div>
                                </div>
                              )}
                              
                              <div>
                                <div className="text-sm text-slate-500 mb-1">Course</div>
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4 text-slate-400" />
                                  <span>{oh.course.code}: {oh.course.title}</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-slate-500 mb-1">Booking Status</div>
                                <Badge variant={oh.bookable ? "default" : "outline"}>
                                  {oh.bookable ? "Bookable by Students" : "Not Bookable"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-slate-800 p-4 flex flex-col justify-center items-center w-36">
                            <Button variant="ghost" size="sm" className="w-full justify-start mb-1">
                              <Pencil className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full justify-start mb-1">
                              <Users className="h-4 w-4 mr-1" /> View Students
                            </Button>
                            <Button variant="ghost" size="sm" className="w-full justify-start text-red-600">
                              <XCircle className="h-4 w-4 mr-1" /> Cancel
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-slate-500">
                    Showing {officeHours.length} office hours
                  </div>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-1" /> Export Schedule
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Schedule a One-Time Availability</CardTitle>
                  <CardDescription>
                    Create a single office hours session on a specific date
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="oneTimeDate">Date</Label>
                        <div className="relative">
                          <Input
                            id="oneTimeDate"
                            type="date"
                            min={format(new Date(), 'yyyy-MM-dd')}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="oneTimeCourse">Associated Course</Label>
                        <Select defaultValue="">
                          <SelectTrigger id="oneTimeCourse">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">General (No specific course)</SelectItem>
                            {courses.map(course => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.code}: {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="oneTimeStart">Start Time</Label>
                        <Input
                          id="oneTimeStart"
                          type="time"
                          defaultValue="09:00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="oneTimeEnd">End Time</Label>
                        <Input
                          id="oneTimeEnd"
                          type="time"
                          defaultValue="10:00"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="oneTimeLocation">Location</Label>
                      <Input
                        id="oneTimeLocation"
                        placeholder="Engineering Building, Room 305"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="oneTimeVirtual" />
                      <Label htmlFor="oneTimeVirtual">Offer virtual meeting option</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="oneTimeVirtualLink">Virtual Meeting Link (Optional)</Label>
                      <Input
                        id="oneTimeVirtualLink"
                        placeholder="https://university.zoom.us/j/123456789"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="oneTimeNotes">Notes</Label>
                      <Textarea
                        id="oneTimeNotes"
                        placeholder="Any special instructions or notes for students"
                        className="min-h-32"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Schedule One-Time Session</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Pending Appointments</CardTitle>
                      <CardDescription>
                        Appointments that require your confirmation
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {appointments.filter(apt => apt.status === "pending").length > 0 ? (
                    <div className="space-y-4">
                      {appointments.filter(apt => apt.status === "pending").map(apt => {
                        const officeHour = officeHours.find(oh => oh.id === apt.officeHoursId);
                        
                        return (
                          <Card key={apt.id} className="overflow-hidden">
                            <div className="flex border-l-4 border-amber-500">
                              <div className="p-4 flex-1">
                                <div className="flex justify-between mb-2">
                                  <div>
                                    <h3 className="font-medium">{apt.student.name}</h3>
                                    <p className="text-sm text-slate-500">{apt.student.email}</p>
                                  </div>
                                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-800/20 dark:text-amber-400">
                                    Pending
                                  </Badge>
                                </div>
                                
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                  <div>
                                    <div className="text-sm text-slate-500 mb-1">Date & Time</div>
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon2 className="h-4 w-4 text-slate-400" />
                                      <span>{format(apt.date, 'MMMM d, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                      <Clock className="h-4 w-4 text-slate-400" />
                                      <span>{apt.startTime} - {apt.endTime}</span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm text-slate-500 mb-1">Course</div>
                                    {officeHour && (
                                      <div className="flex items-center gap-1">
                                        <BookOpen className="h-4 w-4 text-slate-400" />
                                        <span>{officeHour.course.code}: {officeHour.course.title}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm text-slate-500 mb-1">Format</div>
                                    <Badge variant={apt.virtual ? "outline" : "default"}>
                                      {apt.virtual ? (
                                        <div className="flex items-center gap-1">
                                          <Video className="h-3 w-3" />
                                          <span>Virtual</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          <span>In-person</span>
                                        </div>
                                      )}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <div className="text-sm text-slate-500 mb-1">Purpose</div>
                                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                                    {apt.purpose}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-slate-50 dark:bg-slate-800 p-4 flex flex-col justify-center items-center w-36">
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="w-full justify-start mb-2"
                                  onClick={() => handleAppointmentAction(apt.id, "confirm")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full justify-start text-red-600"
                                  onClick={() => handleAppointmentAction(apt.id, "reject")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" /> Reject
                                </Button>
                                <div className="text-xs text-center mt-4 text-slate-500">
                                  Requested on<br />{format(addDays(new Date(), -2), 'MMM d, yyyy')}
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-1">No Pending Appointments</h3>
                      <p className="text-slate-500 max-w-md mx-auto">
                        You have no appointment requests awaiting your confirmation at this time.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Upcoming Appointments</CardTitle>
                      <CardDescription>
                        Confirmed appointments with students
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" /> Export
                      </Button>
                      <Button variant="outline" className="flex items-center gap-1">
                        <Filter className="h-4 w-4" /> Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.filter(apt => apt.status === "confirmed").map(apt => {
                        const officeHour = officeHours.find(oh => oh.id === apt.officeHoursId);
                        
                        return (
                          <TableRow key={apt.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs">
                                    {apt.student.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{apt.student.name}</div>
                                  <div className="text-xs text-slate-500">{apt.student.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>{format(apt.date, 'MMM d, yyyy')}</div>
                              <div className="text-xs text-slate-500">
                                {apt.startTime} - {apt.endTime}
                              </div>
                            </TableCell>
                            <TableCell>
                              {officeHour && (
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4 text-slate-400" />
                                  <span>{officeHour.course.code}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={apt.virtual ? "outline" : "default"}>
                                {apt.virtual ? (
                                  <div className="flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    <span>Virtual</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>In-person</span>
                                  </div>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate" title={apt.purpose}>
                                {apt.purpose}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {apt.virtual && (
                                  <Button variant="default" size="sm" className="h-8">
                                    <Video className="h-4 w-4 mr-1" /> Join Meeting
                                  </Button>
                                )}
                                <Button variant="outline" size="sm" className="h-8">
                                  <MessageSquare className="h-4 w-4 mr-1" /> Message
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Create Appointment</CardTitle>
                  <CardDescription>
                    Manually schedule an appointment with a student
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student">Student</Label>
                        <div className="flex gap-2">
                          <Select defaultValue="">
                            <SelectTrigger id="student" className="flex-1">
                              <SelectValue placeholder="Select student" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Select a student</SelectItem>
                              {appointments.map(apt => (
                                <SelectItem key={apt.student.id} value={apt.student.id.toString()}>
                                  {apt.student.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="outline" className="flex items-center gap-1">
                            <UserPlus className="h-4 w-4" /> Add New
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aptCourse">Related Course</Label>
                        <Select defaultValue="">
                          <SelectTrigger id="aptCourse">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">General (No specific course)</SelectItem>
                            {courses.map(course => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.code}: {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aptDate">Date</Label>
                        <Input
                          id="aptDate"
                          type="date"
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aptStart">Start Time</Label>
                        <Input
                          id="aptStart"
                          type="time"
                          defaultValue="10:00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aptEnd">End Time</Label>
                        <Input
                          id="aptEnd"
                          type="time"
                          defaultValue="10:30"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aptPurpose">Purpose</Label>
                      <Textarea
                        id="aptPurpose"
                        placeholder="Describe the purpose of this appointment"
                        className="min-h-24"
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="aptVirtual" />
                        <Label htmlFor="aptVirtual">Virtual appointment</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="aptNotify" defaultChecked={true} />
                        <Label htmlFor="aptNotify">Send notification to student</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>Schedule Appointment</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Office Hours Settings</CardTitle>
                <CardDescription>
                  Configure your office hours availability and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Appointment Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div>
                        <h4 className="font-medium">Require Appointment Approval</h4>
                        <p className="text-sm text-slate-500">
                          If enabled, you must approve appointment requests before they are confirmed
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div>
                        <h4 className="font-medium">Allow Last-Minute Bookings</h4>
                        <p className="text-sm text-slate-500">
                          If enabled, students can book appointments less than 24 hours in advance
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minNotice">Minimum Notice</Label>
                        <Select defaultValue="24">
                          <SelectTrigger id="minNotice">
                            <SelectValue placeholder="Select minimum notice" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No minimum</SelectItem>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                            <SelectItem value="24">24 hours</SelectItem>
                            <SelectItem value="48">48 hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                          Minimum notice required before an appointment
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="appointmentLength">Default Appointment Length</Label>
                        <Select defaultValue="30">
                          <SelectTrigger id="appointmentLength">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                          Default length for student appointments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-slate-500">
                          Receive email notifications for appointment requests and changes
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div>
                        <h4 className="font-medium">Calendar Reminders</h4>
                        <p className="text-sm text-slate-500">
                          Add appointments to your calendar with reminders
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div>
                        <h4 className="font-medium">Send Reminder to Students</h4>
                        <p className="text-sm text-slate-500">
                          Automatically send reminders to students before appointments
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminderTime">Reminder Time</Label>
                        <Select defaultValue="24">
                          <SelectTrigger id="reminderTime">
                            <SelectValue placeholder="Select reminder time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12 hours before</SelectItem>
                            <SelectItem value="24">24 hours before</SelectItem>
                            <SelectItem value="48">48 hours before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="calendarSync">Calendar Integration</Label>
                        <Select defaultValue="google">
                          <SelectTrigger id="calendarSync">
                            <SelectValue placeholder="Select calendar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google">Google Calendar</SelectItem>
                            <SelectItem value="outlook">Outlook Calendar</SelectItem>
                            <SelectItem value="apple">Apple Calendar</SelectItem>
                            <SelectItem value="none">No Integration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Virtual Meeting Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div>
                        <h4 className="font-medium">Offer Virtual Meetings</h4>
                        <p className="text-sm text-slate-500">
                          Allow students to choose virtual meetings for appointments
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultMeetingTool">Default Meeting Tool</Label>
                      <Select defaultValue="zoom">
                        <SelectTrigger id="defaultMeetingTool">
                          <SelectValue placeholder="Select tool" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zoom">Zoom</SelectItem>
                          <SelectItem value="teams">Microsoft Teams</SelectItem>
                          <SelectItem value="google">Google Meet</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultMeetingLink">Default Meeting Link</Label>
                      <Input
                        id="defaultMeetingLink"
                        placeholder="https://university.zoom.us/j/123456789"
                        defaultValue="https://university.zoom.us/j/123456789"
                      />
                      <p className="text-xs text-slate-500">
                        This link will be used for all virtual appointments unless overridden
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                      <div>
                        <h4 className="font-medium">Create Unique Meeting Links</h4>
                        <p className="text-sm text-slate-500">
                          Generate a new meeting link for each appointment
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}