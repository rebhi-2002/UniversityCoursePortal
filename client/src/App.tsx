import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import CourseRegistration from "@/pages/course-registration";
import CourseCatalog from "@/pages/course-catalog";
import MoodlePage from "@/pages/moodle-page";
import ComingSoonPage from "@/pages/coming-soon-page";
import GradesPage from "@/pages/grades-page";
import TranscriptPage from "@/pages/transcript-page";
import CalendarPage from "@/pages/calendar-page";
import NotificationsPage from "@/pages/notifications-page";
import HelpCenterPage from "@/pages/help-center-page";
import SettingsPage from "@/pages/settings-page";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      {/* Main Routes */}
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/registration" component={CourseRegistration} />
      <ProtectedRoute path="/courses" component={CourseCatalog} />
      <ProtectedRoute path="/moodle" component={MoodlePage} />
      
      {/* Student Routes */}
      <ProtectedRoute path="/grades" component={GradesPage} />
      <ProtectedRoute path="/transcript" component={TranscriptPage} />
      <ProtectedRoute path="/calendar" component={CalendarPage} />
      <ProtectedRoute path="/notifications" component={NotificationsPage} />
      
      {/* Faculty Routes */}
      <ProtectedRoute path="/my-courses" component={() => <ComingSoonPage title="My Courses" />} />
      <ProtectedRoute path="/gradebook" component={() => <ComingSoonPage title="Gradebook" />} />
      <ProtectedRoute path="/office-hours" component={() => <ComingSoonPage title="Office Hours" />} />
      
      {/* Admin Routes */}
      <ProtectedRoute path="/user-management" component={() => <ComingSoonPage title="User Management" />} />
      <ProtectedRoute path="/course-management" component={() => <ComingSoonPage title="Course Management" />} />
      <ProtectedRoute path="/reports" component={() => <ComingSoonPage title="Reports" />} />
      
      {/* General Routes */}
      <ProtectedRoute path="/help" component={HelpCenterPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      
      {/* Auth and Not Found Routes */}
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
