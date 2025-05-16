import { Calendar, Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AppShell } from "@/components/layout/app-shell";

interface ComingSoonPageProps {
  title: string;
}

export default function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <AppShell>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        
        <Card className="border-2 border-dashed border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center">
            <Construction className="h-16 w-16 text-amber-500 mb-4" />
            <h2 className="text-2xl font-semibold text-amber-700 dark:text-amber-300 mb-2">
              Coming Soon
            </h2>
            <p className="text-amber-600 dark:text-amber-400 max-w-md mb-6">
              This feature is under development and will be available in a future update. 
              Check back later for access to {title.toLowerCase()}.
            </p>
            <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Expected release: Q2 2025</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}