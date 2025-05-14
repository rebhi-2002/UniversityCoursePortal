import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Menu, Search, Bell, Mail, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";

type NavbarProps = {
  onMobileMenuClick: () => void;
};

export function Navbar({ onMobileMenuClick }: NavbarProps) {
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Mobile menu button and search */}
        <div className="flex items-center">
          <button
            onClick={onMobileMenuClick}
            className="p-2 mr-2 text-slate-500 md:hidden hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search for courses, materials..."
              className="w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          <button className="p-2 text-slate-500 bg-slate-50 rounded-full hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 bg-slate-50 rounded-full hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100">
            <Mail className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 bg-slate-50 rounded-full md:hidden hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100">
            <Search className="w-5 h-5" />
          </button>
          <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <span className="hidden ml-2 text-sm font-medium md:block dark:text-slate-200">
                    {user.firstName} {user.lastName}
                  </span>
                  <ChevronDown className="hidden w-4 h-4 ml-1 md:block dark:text-slate-400" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <a className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                Sign In
              </a>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
