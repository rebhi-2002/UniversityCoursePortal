import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { FacultyDashboard } from "@/components/dashboard/faculty-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user, isLoading } = useAuth();

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }

    if (!user) return null;

    switch (user.role) {
      case "student":
        return <StudentDashboard />;
      case "faculty":
        return <FacultyDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <AppShell>
      {renderDashboard()}
    </AppShell>
  );
}
