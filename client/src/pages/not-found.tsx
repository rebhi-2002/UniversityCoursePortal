import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 pb-2 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-100">
              <AlertCircle className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Page Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button asChild>
            <Link href="/">
              <div className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </div>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
