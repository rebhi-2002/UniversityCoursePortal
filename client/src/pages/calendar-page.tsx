import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Calendar } from "@/components/ui/calendar";
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
import { useState } from "react";
import { CalendarIcon, Clock, MapPin, Plus, Users } from "lucide-react";
import { format } from "date-fns";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "day" | "week">("month");
  
  // Fetch events
  const { data: events = [] } = useQuery<any[]>({
    queryKey: ["/api/events"],
  });
  
  // Filter events for the selected date
  const filteredEvents = events.filter((event: any) => {
    if (!date) return false;
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    );
  });
  
  const getDayViewHours = () => {
    const hours = [];
    for (let i = 8; i < 20; i++) {
      hours.push({
        hour: i,
        label: i > 12 ? `${i - 12}:00 PM` : i === 12 ? "12:00 PM" : `${i}:00 AM`
      });
    }
    return hours;
  };

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Academic Calendar</h1>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        </div>
        
        <Tabs defaultValue="month" value={view} onValueChange={(v) => setView(v as any)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
            <div className="text-sm font-medium">
              {date && format(date, 'MMMM yyyy')}
            </div>
          </div>
          
          <div className="grid md:grid-cols-7 gap-6">
            <div className="md:col-span-5">
              <Card>
                <CardContent className="p-4">
                  <TabsContent value="month" className="mt-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) => date < new Date("1900-01-01")}
                    />
                  </TabsContent>
                  
                  <TabsContent value="week" className="mt-0">
                    <div className="grid grid-cols-7 gap-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                        <div key={day} className="text-center font-medium py-2 border-b">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="h-32 border p-1 overflow-y-auto">
                          <div className="text-xs text-gray-500 mb-1">
                            {format(new Date(date?.getFullYear() || 2023, date?.getMonth() || 0, (date?.getDate() || 1) - date?.getDay()! + index), 'd')}
                          </div>
                          {/* Events would go here */}
                          <div className="text-xs p-1 bg-blue-100 text-blue-800 rounded mb-1">
                            Midterm Exam
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="day" className="mt-0">
                    <div className="text-center font-medium py-2 border-b mb-4">
                      {date && format(date, 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="space-y-2">
                      {getDayViewHours().map((hourData) => (
                        <div key={hourData.hour} className="flex border-b pb-2">
                          <div className="w-20 text-sm text-gray-500">
                            {hourData.label}
                          </div>
                          <div className="flex-1 min-h-10">
                            {/* Placeholder for events */}
                            {hourData.hour === 10 && (
                              <div className="p-2 bg-blue-100 text-blue-800 rounded text-sm">
                                Mathematics Lecture (10:00 AM - 11:30 AM)
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Events for {date && format(date, 'MMMM d, yyyy')}</CardTitle>
                  <CardDescription>
                    {filteredEvents.length} event{filteredEvents.length !== 1 && 's'} scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                      {/* Sample events */}
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Calculus Midterm Exam</h3>
                          <Badge>Exam</Badge>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mb-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>10:00 AM - 11:30 AM</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mb-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Science Building, Room 101</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>MATH 201</span>
                        </div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">Computer Science Study Group</h3>
                          <Badge variant="outline">Study</Badge>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mb-1">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>2:00 PM - 4:00 PM</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mb-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Library, Study Room 3</span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          <span>CS 101</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <CalendarIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      <p>No events scheduled for this day</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" /> Add Event
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Events</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </AppShell>
  );
}