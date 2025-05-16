import { useQuery, useMutation } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  User,
  UserCog,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle 
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schemas
const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  emailDigest: z.enum(["daily", "weekly", "never"]),
  notifyAssignments: z.boolean(),
  notifyGrades: z.boolean(),
  notifyAnnouncements: z.boolean(),
  notifyRegistration: z.boolean(),
  notifyDueDates: z.boolean(),
});

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  // Set default values for the profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });
  
  // Set default values for the security form
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Set default values for the notification form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      emailDigest: "weekly",
      notifyAssignments: true,
      notifyGrades: true,
      notifyAnnouncements: true,
      notifyRegistration: true,
      notifyDueDates: true,
    },
  });
  
  // Mock mutation for profile update
  const profileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileFormSchema>) => {
      // This would be replaced with an actual API call
      console.log("Updating profile:", data);
      return new Promise<void>(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Mock mutation for password update
  const passwordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof securityFormSchema>) => {
      // This would be replaced with an actual API call
      console.log("Updating password:", data);
      return new Promise<void>(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Mock mutation for notification settings update
  const notificationMutation = useMutation({
    mutationFn: async (data: z.infer<typeof notificationFormSchema>) => {
      // This would be replaced with an actual API call
      console.log("Updating notification settings:", data);
      return new Promise<void>(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "There was an error updating your notification settings. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Handle form submissions
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    profileMutation.mutate(data);
  };
  
  const onSecuritySubmit = (data: z.infer<typeof securityFormSchema>) => {
    passwordMutation.mutate(data);
  };
  
  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    notificationMutation.mutate(data);
  };
  
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("english");
  const [timezone, setTimezone] = useState("America/New_York");

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <div className="flex">
            <div className="w-64 flex-shrink-0 pr-4">
              <div className="sticky top-20">
                <TabsList className="flex flex-col w-full h-auto p-0 bg-transparent space-y-1">
                  <TabsTrigger
                    value="profile"
                    className="w-full justify-start px-3 py-2 h-9"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="account"
                    className="w-full justify-start px-3 py-2 h-9"
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="w-full justify-start px-3 py-2 h-9"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="privacy"
                    className="w-full justify-start px-3 py-2 h-9"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy & Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="w-full justify-start px-3 py-2 h-9"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Appearance
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-6 p-4 border rounded-md bg-slate-50 dark:bg-slate-800 text-sm">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-1 text-primary" /> Account Security
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-2">
                    Your account security status:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-green-600 dark:text-green-500">
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Strong password</span>
                    </div>
                    <div className="flex items-center text-amber-600 dark:text-amber-500">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Two-factor not enabled</span>
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-500">
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      <span className="text-xs">Email verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and contact details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
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
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                              <FormDescription>
                                This email will be used for account-related notifications.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
                              </FormControl>
                              <FormDescription>
                                Used for SMS notifications and account verification.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Separator className="my-4" />
                        
                        <h3 className="text-sm font-medium">Address Information (Optional)</h3>
                        
                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Anytown" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>State</FormLabel>
                                  <FormControl>
                                    <Input placeholder="CA" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="zip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>ZIP Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12345" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="us">United States</SelectItem>
                                  <SelectItem value="ca">Canada</SelectItem>
                                  <SelectItem value="mx">Mexico</SelectItem>
                                  <SelectItem value="uk">United Kingdom</SelectItem>
                                  <SelectItem value="fr">France</SelectItem>
                                  <SelectItem value="de">Germany</SelectItem>
                                  <SelectItem value="jp">Japan</SelectItem>
                                  <SelectItem value="cn">China</SelectItem>
                                  <SelectItem value="in">India</SelectItem>
                                  <SelectItem value="au">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={profileMutation.isPending}
                          >
                            {profileMutation.isPending ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Update your password and secure your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...securityForm}>
                      <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                        <FormField
                          control={securityForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...field}
                                  />
                                </FormControl>
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-slate-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-slate-400" />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={securityForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                                <FormDescription>
                                  Must be at least 8 characters.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={securityForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      {...field}
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={passwordMutation.isPending}
                          >
                            {passwordMutation.isPending ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    
                    <div className="border rounded-md p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-slate-500">
                            Protect your account with an additional verification step.
                          </p>
                        </div>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">Trusted Devices</h4>
                          <p className="text-sm text-slate-500">
                            Manage the devices that have access to your account.
                          </p>
                        </div>
                        <Button variant="outline">Manage Devices</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...notificationForm}>
                      <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Notification Channels</h3>
                          <p className="text-sm text-slate-500 mb-4">
                            Select how you would like to receive notifications
                          </p>
                          
                          <div className="space-y-4">
                            <FormField
                              control={notificationForm.control}
                              name="emailNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email Notifications</FormLabel>
                                    <FormDescription>
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
                              name="pushNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Push Notifications</FormLabel>
                                    <FormDescription>
                                      Receive notifications in your browser
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
                              name="smsNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">SMS Notifications</FormLabel>
                                    <FormDescription>
                                      Receive important notifications via text message
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
                          <h3 className="text-lg font-medium mb-2">Email Digest</h3>
                          <p className="text-sm text-slate-500 mb-4">
                            Choose how often you want to receive email summaries
                          </p>
                          
                          <FormField
                            control={notificationForm.control}
                            name="emailDigest"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily Digest</SelectItem>
                                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                                    <SelectItem value="never">Don't send digests</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  This setting controls the frequency of your notification summary emails.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Notification Types</h3>
                          <p className="text-sm text-slate-500 mb-4">
                            Choose which types of notifications you want to receive
                          </p>
                          
                          <div className="space-y-4">
                            <FormField
                              control={notificationForm.control}
                              name="notifyAssignments"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">New Assignments</FormLabel>
                                    <FormDescription>
                                      Notifications when new assignments are posted
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
                              name="notifyGrades"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Grade Updates</FormLabel>
                                    <FormDescription>
                                      Notifications when grades are posted or updated
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
                              name="notifyAnnouncements"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Course Announcements</FormLabel>
                                    <FormDescription>
                                      Notifications for announcements from instructors
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
                              name="notifyRegistration"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Registration Updates</FormLabel>
                                    <FormDescription>
                                      Notifications about course registration periods and status changes
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
                              name="notifyDueDates"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Due Date Reminders</FormLabel>
                                    <FormDescription>
                                      Notifications for upcoming assignment deadlines
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
                        
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={notificationMutation.isPending}
                          >
                            {notificationMutation.isPending ? "Saving..." : "Save Preferences"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Privacy & Security Tab */}
              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>
                      Manage your data privacy and account security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Profile Visibility</h4>
                            <p className="text-sm text-slate-500">
                              Control who can see your profile information
                            </p>
                          </div>
                          <Select defaultValue="classmates">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="university">University Only</SelectItem>
                              <SelectItem value="classmates">Classmates Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Grade Visibility</h4>
                            <p className="text-sm text-slate-500">
                              Control whether your grades are visible to other students
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Activity Status</h4>
                            <p className="text-sm text-slate-500">
                              Show when you're active on the platform
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Account Security</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Active Sessions</h4>
                            <p className="text-sm text-slate-500">
                              View and manage your active login sessions
                            </p>
                          </div>
                          <Button variant="outline">Manage Sessions</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Login History</h4>
                            <p className="text-sm text-slate-500">
                              View recent account access attempts
                            </p>
                          </div>
                          <Button variant="outline">View History</Button>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Download Your Data</h4>
                            <p className="text-sm text-slate-500">
                              Request a copy of your personal data
                            </p>
                          </div>
                          <Button variant="outline">Request Data</Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 text-red-600">Danger Zone</h3>
                      <div className="border border-red-200 rounded-md p-4 bg-red-50 dark:bg-red-900/20">
                        <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                          Delete Account
                        </h4>
                        <p className="text-sm text-red-500 dark:text-red-300 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Appearance Tab */}
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the look and feel of your interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <Button 
                          variant={theme === "light" ? "default" : "outline"} 
                          className="h-auto flex-col py-4"
                          onClick={() => setTheme("light")}
                        >
                          <Sun className="h-5 w-5 mb-2" />
                          <span>Light</span>
                        </Button>
                        <Button 
                          variant={theme === "dark" ? "default" : "outline"} 
                          className="h-auto flex-col py-4"
                          onClick={() => setTheme("dark")}
                        >
                          <Moon className="h-5 w-5 mb-2" />
                          <span>Dark</span>
                        </Button>
                        <Button 
                          variant={theme === "system" ? "default" : "outline"} 
                          className="h-auto flex-col py-4"
                          onClick={() => setTheme("system")}
                        >
                          <Monitor className="h-5 w-5 mb-2" />
                          <span>System</span>
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Language & Region</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Language</label>
                          <Select
                            value={language}
                            onValueChange={setLanguage}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="german">German</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                              <SelectItem value="japanese">Japanese</SelectItem>
                              <SelectItem value="arabic">Arabic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Time Zone</label>
                          <Select
                            value={timezone}
                            onValueChange={setTimezone}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time zone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                              <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                              <SelectItem value="Australia/Sydney">Australian Eastern Time (AET)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Accessibility</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Reduced Motion</h4>
                            <p className="text-sm text-slate-500">
                              Reduce the amount of animation and motion effects
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                        
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">High Contrast</h4>
                            <p className="text-sm text-slate-500">
                              Increase contrast for better visibility
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-1 block">Font Size</label>
                          <Select defaultValue="medium">
                            <SelectTrigger>
                              <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="xl">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Appearance Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </AppShell>
  );
}