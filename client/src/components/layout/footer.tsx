import React from "react";
import { Link } from "wouter";
import { HelpCircle, Shield, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-4 bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/help">
            <div className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 cursor-pointer">
              <span className="sr-only">Help Center</span>
              <HelpCircle className="w-5 h-5" />
            </div>
          </Link>
          <Link href="/privacy">
            <div className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 cursor-pointer">
              <span className="sr-only">Privacy Policy</span>
              <Shield className="w-5 h-5" />
            </div>
          </Link>
          <Link href="/terms">
            <div className="text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 cursor-pointer">
              <span className="sr-only">Terms of Service</span>
              <FileText className="w-5 h-5" />
            </div>
          </Link>
        </div>
        <div className="mt-4 md:mt-0 md:order-1">
          <p className="text-sm text-center text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} University Course Registration & Moodle System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
