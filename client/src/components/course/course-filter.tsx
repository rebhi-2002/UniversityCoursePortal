import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface CourseFilters {
  departmentId?: string;
  level?: string;
  credits?: string;
  deliveryMode?: string;
  search?: string;
  semester?: string;
  year?: string;
}

interface CourseFilterProps {
  onApplyFilters: (filters: CourseFilters) => void;
  defaultValues?: CourseFilters;
}

export function CourseFilter({ onApplyFilters, defaultValues = {} }: CourseFilterProps) {
  const [filters, setFilters] = useState<CourseFilters>({
    departmentId: defaultValues.departmentId || "",
    level: defaultValues.level || "",
    credits: defaultValues.credits || "",
    deliveryMode: defaultValues.deliveryMode || "",
    search: defaultValues.search || "",
    semester: defaultValues.semester || "",
    year: defaultValues.year || ""
  });

  // Fetch departments for filter dropdown
  const { data: departments = [] } = useQuery<any[]>({
    queryKey: ["/api/departments"],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      departmentId: "",
      level: "",
      credits: "",
      deliveryMode: "",
      search: "",
      semester: "",
      year: ""
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="mb-4 text-sm font-medium text-slate-900 dark:text-slate-100">Search and Filter Courses</h3>
        <div className="grid gap-4 md:grid-cols-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="department" className="text-xs">Department</Label>
            <Select 
              value={filters.departmentId} 
              onValueChange={(value) => handleSelectChange("departmentId", value)}
            >
              <SelectTrigger id="department" className="mt-1">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments && Array.isArray(departments) && departments.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.code} - {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="course-level" className="text-xs">Course Level</Label>
            <Select 
              value={filters.level} 
              onValueChange={(value) => handleSelectChange("level", value)}
            >
              <SelectTrigger id="course-level" className="mt-1">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="100">100 Level (Intro)</SelectItem>
                <SelectItem value="200">200 Level</SelectItem>
                <SelectItem value="300">300 Level</SelectItem>
                <SelectItem value="400">400 Level (Advanced)</SelectItem>
                <SelectItem value="500">Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="credits" className="text-xs">Credits</Label>
            <Select 
              value={filters.credits} 
              onValueChange={(value) => handleSelectChange("credits", value)}
            >
              <SelectTrigger id="credits" className="mt-1">
                <SelectValue placeholder="Any Credits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Credits</SelectItem>
                <SelectItem value="1">1 Credit</SelectItem>
                <SelectItem value="2">2 Credits</SelectItem>
                <SelectItem value="3">3 Credits</SelectItem>
                <SelectItem value="4">4 Credits</SelectItem>
                <SelectItem value="5">5+ Credits</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="delivery-mode" className="text-xs">Delivery Mode</Label>
            <Select 
              value={filters.deliveryMode} 
              onValueChange={(value) => handleSelectChange("deliveryMode", value)}
            >
              <SelectTrigger id="delivery-mode" className="mt-1">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="course-search" className="text-xs">Search</Label>
          <div className="relative mt-1">
            <Input 
              type="text" 
              id="course-search" 
              name="search"
              value={filters.search}
              onChange={handleInputChange}
              placeholder="Search by course name, code, or instructor" 
              className="pl-10" 
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            className="mr-2"
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
