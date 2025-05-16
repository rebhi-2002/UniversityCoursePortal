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
  Bell, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  GraduationCap, 
  MailOpen, 
  Settings, 
  Trash2, 
  Calendar as CalendarIcon 
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  // Fetch notifications
  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ["/api/notifications"],
  });
  
  // Sample notification data
  const sampleNotifications = [
    {
      id: 1,
      title: "New Assignment Posted",
      message: "Your instructor has posted a new assignment for CS 101: Introduction to Computer Science",
      type: "assignment",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false
    },
    {
      id: 2,
      title: "Grade Posted",
      message: "Your grade for the Midterm Exam in MATH 201: Calculus I has been posted",
      type: "grade",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      isRead: false
    },
    {
      id: 3,
      title: "Registration Reminder",
      message: "Course registration for the Spring 2025 semester opens in 3 days",
      type: "registration",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true
    },
    {
      id: 4,
      title: "Advising Session Scheduled",
      message: "Your academic advisor has scheduled a meeting with you on Friday, May 20, 2025, at 2:00 PM",
      type: "advising",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      isRead: true
    },
    {
      id: 5,
      title: "Course Added to Schedule",
      message: "You have successfully registered for ENG 202: Technical Writing",
      type: "registration",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      isRead: true
    }
  ];
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "grade":
        return <GraduationCap className="h-5 w-5 text-green-500" />;
      case "registration":
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case "advising":
        return <Calendar className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getUnreadCount = () => {
    return sampleNotifications.filter(n => !n.isRead).length;
  };

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-slate-500 mt-1">
              Stay updated with important announcements and events
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <MailOpen className="h-4 w-4" /> Mark All As Read
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings className="h-4 w-4" /> Notification Settings
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread <Badge className="ml-1" variant="outline">{getUnreadCount()}</Badge>
            </TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>
                  Showing all recent notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {sampleNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start p-3 hover:bg-slate-50 rounded-md transition-colors ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">
                            {notification.title}
                            {!notification.isRead && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </p>
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2 flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <CheckCircle2 className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Trash2 className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline">Load More</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="unread">
            <Card>
              <CardHeader>
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>
                  Notifications you haven't seen yet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {sampleNotifications.filter(n => !n.isRead).map((notification) => (
                    <div 
                      key={notification.id} 
                      className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">
                            {notification.title}
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          </p>
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2 flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <CheckCircle2 className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Trash2 className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Additional tabs would be implemented similarly */}
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Notifications</CardTitle>
                <CardDescription>
                  Updates about your course assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {sampleNotifications.filter(n => n.type === "assignment").map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex items-start p-3 hover:bg-slate-50 rounded-md transition-colors ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">
                            {notification.title}
                            {!notification.isRead && (
                              <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </p>
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2 flex space-x-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <CheckCircle2 className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Trash2 className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}