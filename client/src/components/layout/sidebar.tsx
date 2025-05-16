import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Book,
  Calendar,
  ChevronLeftCircle,
  Cpu,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  BarChart,
  List,
  Settings,
  User,
  UserCog,
  Clock,
  Bell,
  Users
} from "lucide-react";

type SidebarProps = {
  className?: string;
  isMobileOpen: boolean;
  onMobileClose: () => void;
};

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  count?: number;
  isActive?: boolean;
};

const SidebarItem = ({ icon, label, href, count, isActive }: SidebarItemProps) => {
  return (
    <li>
      <Link href={href}>
        <div
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
            isActive
              ? "bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
              : "text-slate-700 dark:text-slate-200"
          )}
        >
          {icon}
          <span className="ml-3">{label}</span>
          {count !== undefined && (
            <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100">
              {count}
            </span>
          )}
        </div>
      </Link>
    </li>
  );
};

const SidebarSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="mt-6">
      <p className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">{title}</p>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
};

export function Sidebar({ className, isMobileOpen, onMobileClose }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => location === path;
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg dark:bg-slate-900 transform transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="px-6 pt-8 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-primary-700 dark:text-primary-400">UniCourse</h1>
            <button
              onClick={onMobileClose}
              className="p-1 text-slate-500 md:hidden hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <ChevronLeftCircle className="w-5 h-5" />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Course Registration & LMS</p>
        </div>

        {/* Scrollable Navigation */}
        <ScrollArea className="flex-1 px-4 py-2">
          {/* Main Navigation */}
          <div>
            <p className="px-2 mb-2 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">Main</p>
            <ul className="space-y-1">
              <SidebarItem
                icon={<LayoutDashboard className="w-5 h-5" />}
                label="Dashboard"
                href="/"
                isActive={isActive("/")}
              />
              <SidebarItem
                icon={<Book className="w-5 h-5" />}
                label="Courses"
                href="/courses"
                isActive={isActive("/courses")}
              />
              <SidebarItem
                icon={<Calendar className="w-5 h-5" />}
                label="Calendar"
                href="/calendar"
                isActive={isActive("/calendar")}
              />
              <SidebarItem
                icon={<Bell className="w-5 h-5" />}
                label="Notifications"
                href="/notifications"
                count={3}
                isActive={isActive("/notifications")}
              />
            </ul>
          </div>

          {/* Student-specific navigation */}
          {user && user.role === "student" && (
            <SidebarSection title="Academic">
              <SidebarItem
                icon={<List className="w-5 h-5" />}
                label="Course Registration"
                href="/registration"
                isActive={isActive("/registration")}
              />
              <SidebarItem
                icon={<BarChart className="w-5 h-5" />}
                label="Grades"
                href="/grades"
                isActive={isActive("/grades")}
              />
              <SidebarItem
                icon={<FileText className="w-5 h-5" />}
                label="Transcript"
                href="/transcript"
                isActive={isActive("/transcript")}
              />
            </SidebarSection>
          )}

          {/* Faculty-specific navigation */}
          {user && user.role === "faculty" && (
            <SidebarSection title="Teaching">
              <SidebarItem
                icon={<GraduationCap className="w-5 h-5" />}
                label="My Courses"
                href="/my-courses"
                isActive={isActive("/my-courses")}
              />
              <SidebarItem
                icon={<FileText className="w-5 h-5" />}
                label="Gradebook"
                href="/gradebook"
                isActive={isActive("/gradebook")}
              />
              <SidebarItem
                icon={<Clock className="w-5 h-5" />}
                label="Office Hours"
                href="/office-hours"
                isActive={isActive("/office-hours")}
              />
            </SidebarSection>
          )}

          {/* Admin-specific navigation */}
          {user && user.role === "admin" && (
            <SidebarSection title="Administration">
              <SidebarItem
                icon={<UserCog className="w-5 h-5" />}
                label="User Management"
                href="/user-management"
                isActive={isActive("/user-management")}
              />
              <SidebarItem
                icon={<Settings className="w-5 h-5" />}
                label="Course Management"
                href="/course-management"
                isActive={isActive("/course-management")}
              />
              <SidebarItem
                icon={<BarChart className="w-5 h-5" />}
                label="Reports"
                href="/reports"
                isActive={isActive("/reports")}
              />
            </SidebarSection>
          )}

          {/* Support section for all users */}
          <SidebarSection title="Support">
            <SidebarItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="Help Center"
              href="/help"
              isActive={isActive("/help")}
            />
            <SidebarItem
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
              href="/settings"
              isActive={isActive("/settings")}
            />
          </SidebarSection>
        </ScrollArea>

        {/* User Profile Section */}
        {user && (
          <div className="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 ml-auto text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
