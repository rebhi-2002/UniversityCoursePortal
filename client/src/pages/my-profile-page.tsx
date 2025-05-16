import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Briefcase, 
  BookOpen, 
  Calendar, 
  Clock, 
  Shield, 
  Bell, 
  Eye, 
  EyeOff, 
  Lock, 
  Key, 
  ExternalLink, 
  Save,
  Image,
  Upload,
  Edit,
  LogOut,
  AlertTriangle
} from "lucide-react";

// Form schema for profile update
const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().max(500, {
    message: "Bio must not exceed 500 characters.",
  }).optional(),
  officeLocation: z.string().optional(),
  officeHours: z.string().optional(),
  title: z.string().optional(),
});

// Form schema for password change
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Form schema for notification preferences
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  appointmentReminders: z.boolean().default(true),
  gradeUpdates: z.boolean().default(true),
  systemAnnouncements: z.boolean().default(true),
  courseUpdates: z.boolean().default(true),
});

export default function MyProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample user data (would come from the API in a real app)
  const userData = {
    id: 5,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@university.edu",
    phone: "(555) 123-4567",
    role: "faculty",
    department: "Computer Science",
    title: "Associate Professor",
    bio: "I am an Associate Professor in the Computer Science department specializing in software engineering and database systems. My research focuses on distributed systems and cloud computing.",
    officeLocation: "Faculty Office Building, Room 210",
    officeHours: "Monday 10:00 AM - 12:00 PM, Wednesday 2:00 PM - 4:00 PM",
    joinDate: "2018-09-01",
    lastLogin: "2023-10-15T09:32:45",
    avatar: null,
  };
  
  // Form for profile update
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || "",
      department: userData.department || "",
      bio: userData.bio || "",
      officeLocation: userData.officeLocation || "",
      officeHours: userData.officeHours || "",
      title: userData.title || "",
    },
  });
  
  // Form for password change
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Form for notification preferences
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      appointmentReminders: true,
      gradeUpdates: true,
      systemAnnouncements: true,
      courseUpdates: true,
    },
  });
  
  // Handle profile update
  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    // This would update the user profile in a real app
    console.log("Profile updated:", values);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  // Handle password change
  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    // This would change the password in a real app
    console.log("Password changed:", values);
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    toast({
      title: "Password changed",
      description: "Your password has been changed successfully.",
    });
  };
  
  // Handle notification preference update
  const onNotificationSubmit = (values: z.infer<typeof notificationSchema>) => {
    // This would update notification preferences in a real app
    console.log("Notification preferences updated:", values);
    toast({
      title: "Preferences updated",
      description: "Your notification preferences have been updated.",
    });
  };
  
  // Sample courses taught by the faculty member
  const courses = [
    { id: 1, code: "CS 301", title: "Software Engineering", section: "Section 01", semester: "Fall 2024", students: 32 },
    { id: 2, code: "CS 401", title: "Advanced Database Systems", section: "Section 01", semester: "Fall 2024", students: 25 },
    { id: 3, code: "CS 210", title: "Data Structures and Algorithms", section: "Section 01", semester: "Fall 2024", students: 45 }
  ];
  
  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-slate-500 mt-1">
              Manage your personal information and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" /> Public Profile
            </Button>
            <Button variant="destructive" className="flex items-center gap-1">
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {/* Left column: Profile summary */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    {userData.avatar ? (
                      <AvatarImage src={userData.avatar} alt={`${userData.firstName} ${userData.lastName}`} />
                    ) : (
                      <AvatarFallback className="text-3xl">
                        {userData.firstName[0]}{userData.lastName[0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                        <DialogDescription>
                          Upload a new profile picture. Recommended size: 250x250 pixels.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-md">
                          <div className="text-center">
                            <Image className="h-8 w-8 mx-auto text-slate-400" />
                            <div className="mt-2">
                              <Button variant="outline">Select Image</Button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                              PNG, JPG or GIF. Max 2MB.
                            </p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button>Upload Picture</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <h2 className="text-xl font-bold mt-4">{userData.firstName} {userData.lastName}</h2>
                <Badge className="mt-1">{userData.role === "faculty" ? "Faculty" : userData.role === "student" ? "Student" : "Administrator"}</Badge>
                
                <div className="w-full mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span>{userData.email}</span>
                  </div>
                  {userData.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  {userData.department && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-slate-500" />
                      <span>{userData.department}</span>
                    </div>
                  )}
                  {userData.title && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-slate-500" />
                      <span>{userData.title}</span>
                    </div>
                  )}
                  {userData.officeLocation && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>{userData.officeLocation}</span>
                    </div>
                  )}
                </div>
                
                <Separator className="my-6 w-full" />
                
                <div className="w-full space-y-3">
                  <div className="text-sm font-medium">Account Information</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Member Since</span>
                    <span>{new Date(userData.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Last Login</span>
                    <span>{new Date(userData.lastLogin).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Courses</span>
                    <span>{courses.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column: Profile tabs */}
          <div className="md:col-span-3">
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your profile information visible to students and colleagues
                      </CardDescription>
                    </div>
                    <Button 
                      variant={isEditing ? "ghost" : "outline"} 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : (
                        <>
                          <Edit className="h-4 w-4 mr-1" /> Edit Profile
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="First name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Last name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Email address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Phone number" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="department"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Department</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Department" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={profileForm.control}
                              name="officeLocation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Office Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Office location" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={profileForm.control}
                              name="officeHours"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Office Hours</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Office hours" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    E.g., "Monday 10:00 AM - 12:00 PM, Wednesday 2:00 PM - 4:00 PM"
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div>
                            <FormField
                              control={profileForm.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Tell us about yourself"
                                      className="min-h-32"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Brief description visible on your profile page. Max 500 characters.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button type="submit" className="flex items-center gap-1">
                              <Save className="h-4 w-4" /> Save Changes
                            </Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-1">Full Name</h3>
                            <p>{userData.firstName} {userData.lastName}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-1">Email Address</h3>
                            <p>{userData.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-1">Phone Number</h3>
                            <p>{userData.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-1">Department</h3>
                            <p>{userData.department || "Not provided"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-1">Title</h3>
                            <p>{userData.title || "Not provided"}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-1">Office Location</h3>
                            <p>{userData.officeLocation || "Not provided"}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-slate-500 mb-1">Office Hours</h3>
                          <p>{userData.officeHours || "Not provided"}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-slate-500 mb-1">Bio</h3>
                          <p className="whitespace-pre-wrap">{userData.bio || "No bio provided."}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Teaching History</CardTitle>
                    <CardDescription>
                      Courses you are currently teaching and have taught in the past
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Current Courses</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {courses.map(course => (
                            <Card key={course.id} className="overflow-hidden">
                              <CardHeader className="p-4 pb-2">
                                <Badge className="mb-1 font-normal bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20">
                                  {course.semester}
                                </Badge>
                                <CardTitle className="text-base">{course.code}</CardTitle>
                                <CardDescription className="line-clamp-1">{course.title}</CardDescription>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="flex items-center gap-1 text-sm mt-2">
                                  <BookOpen className="h-4 w-4 text-slate-500" />
                                  <span>{course.section}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm mt-1">
                                  <User className="h-4 w-4 text-slate-500" />
                                  <span>{course.students} Students</span>
                                </div>
                              </CardContent>
                              <CardFooter className="bg-slate-50 dark:bg-slate-800 p-3 flex justify-center">
                                <Button variant="ghost" size="sm">View Course</Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Past Courses</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Card className="overflow-hidden opacity-70">
                            <CardHeader className="p-4 pb-2">
                              <Badge className="mb-1 font-normal bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300">
                                Spring 2024
                              </Badge>
                              <CardTitle className="text-base">CS 202</CardTitle>
                              <CardDescription className="line-clamp-1">Object-Oriented Programming</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex items-center gap-1 text-sm mt-2">
                                <BookOpen className="h-4 w-4 text-slate-500" />
                                <span>Section 02</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm mt-1">
                                <User className="h-4 w-4 text-slate-500" />
                                <span>38 Students</span>
                              </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 dark:bg-slate-800 p-3 flex justify-center">
                              <Button variant="ghost" size="sm">View Course</Button>
                            </CardFooter>
                          </Card>
                          
                          <Card className="overflow-hidden opacity-70">
                            <CardHeader className="p-4 pb-2">
                              <Badge className="mb-1 font-normal bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300">
                                Fall 2023
                              </Badge>
                              <CardTitle className="text-base">CS 301</CardTitle>
                              <CardDescription className="line-clamp-1">Software Engineering</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex items-center gap-1 text-sm mt-2">
                                <BookOpen className="h-4 w-4 text-slate-500" />
                                <span>Section 01</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm mt-1">
                                <User className="h-4 w-4 text-slate-500" />
                                <span>30 Students</span>
                              </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 dark:bg-slate-800 p-3 flex justify-center">
                              <Button variant="ghost" size="sm">View Course</Button>
                            </CardFooter>
                          </Card>
                          
                          <Card className="overflow-hidden opacity-70">
                            <CardHeader className="p-4 pb-2">
                              <Badge className="mb-1 font-normal bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300">
                                Fall 2023
                              </Badge>
                              <CardTitle className="text-base">CS 401</CardTitle>
                              <CardDescription className="line-clamp-1">Advanced Database Systems</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex items-center gap-1 text-sm mt-2">
                                <BookOpen className="h-4 w-4 text-slate-500" />
                                <span>Section 01</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm mt-1">
                                <User className="h-4 w-4 text-slate-500" />
                                <span>22 Students</span>
                              </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 dark:bg-slate-800 p-3 flex justify-center">
                              <Button variant="ghost" size="sm">View Course</Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Password</h3>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter current password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter new password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm new password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex justify-end">
                            <Button type="submit">Change Password</Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#4285F4] flex items-center justify-center text-white">
                              G
                            </div>
                            <div>
                              <div className="font-medium">Google</div>
                              <div className="text-sm text-slate-500">Not connected</div>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#0072b1] flex items-center justify-center text-white">
                              L
                            </div>
                            <div>
                              <div className="font-medium">LinkedIn</div>
                              <div className="text-sm text-slate-500">Not connected</div>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Account Management</h3>
                      <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <AlertTitle>Danger Zone</AlertTitle>
                        <AlertDescription>
                          The following actions are irreversible and should be used with caution.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-900 rounded-md bg-red-50 dark:bg-red-950/50">
                        <div>
                          <div className="font-medium">Deactivate Account</div>
                          <div className="text-sm text-slate-500">
                            Temporarily disable your account. You can reactivate it anytime.
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-500">
                              Deactivate
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will temporarily deactivate your account. You can reactivate it by logging in again.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 text-white hover:bg-red-700">
                                Deactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Privacy Tab */}
              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control who can see your information and how it's used
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Profile Visibility</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div>
                            <div className="font-medium">Public Profile</div>
                            <div className="text-sm text-slate-500">
                              Allow anyone within the university to view your profile
                            </div>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div>
                            <div className="font-medium">Show Email Address</div>
                            <div className="text-sm text-slate-500">
                              Display your email address on your public profile
                            </div>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div>
                            <div className="font-medium">Show Phone Number</div>
                            <div className="text-sm text-slate-500">
                              Display your phone number on your public profile
                            </div>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div>
                            <div className="font-medium">Show Office Hours</div>
                            <div className="text-sm text-slate-500">
                              Display your office hours on your public profile
                            </div>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Communication Privacy</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div>
                            <div className="font-medium">Direct Student Messages</div>
                            <div className="text-sm text-slate-500">
                              Allow students to send you direct messages
                            </div>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div>
                            <div className="font-medium">Out-of-Office Notice</div>
                            <div className="text-sm text-slate-500">
                              Automatically respond to messages when you're unavailable
                            </div>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Data Usage</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div>
                            <div className="font-medium">Usage Analytics</div>
                            <div className="text-sm text-slate-500">
                              Allow the university to collect anonymous usage data to improve the platform
                            </div>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                          <div>
                            <div className="font-medium">Activity Tracking</div>
                            <div className="text-sm text-slate-500">
                              Track and display your last activity time on your profile
                            </div>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Save Privacy Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Control how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...notificationForm}>
                      <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                          <div className="space-y-4">
                            <FormField
                              control={notificationForm.control}
                              name="emailNotifications"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <div>
                                    <FormLabel className="font-medium cursor-pointer">Email Notifications</FormLabel>
                                    <FormDescription className="text-sm">
                                      Receive notifications via email
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch 
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="appointmentReminders"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <div>
                                    <FormLabel className="font-medium cursor-pointer">Appointment Reminders</FormLabel>
                                    <FormDescription className="text-sm">
                                      Receive reminders about upcoming appointments
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch 
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="gradeUpdates"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <div>
                                    <FormLabel className="font-medium cursor-pointer">Grade Updates</FormLabel>
                                    <FormDescription className="text-sm">
                                      Receive notifications when students submit assignments
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch 
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="systemAnnouncements"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <div>
                                    <FormLabel className="font-medium cursor-pointer">System Announcements</FormLabel>
                                    <FormDescription className="text-sm">
                                      Receive important university-wide announcements
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch 
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={notificationForm.control}
                              name="courseUpdates"
                              render={({ field }) => (
                                <FormItem className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                                  <div>
                                    <FormLabel className="font-medium cursor-pointer">Course Updates</FormLabel>
                                    <FormDescription className="text-sm">
                                      Receive notifications about course changes and updates
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch 
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notification Delivery</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                              <div>
                                <div className="font-medium">Notification Summary</div>
                                <div className="text-sm text-slate-500">
                                  Get a daily digest of all notifications instead of individual emails
                                </div>
                              </div>
                              <Switch defaultChecked={false} />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium block mb-2">Email Frequency</label>
                              <Select defaultValue="realtime">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="realtime">Real-time</SelectItem>
                                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                                  <SelectItem value="daily">Daily Digest</SelectItem>
                                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="submit">Save Notification Preferences</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppShell>
  );
}