import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Settings, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video,
  ExternalLink 
} from "lucide-react";
import { useState } from "react";

export default function HelpCenterPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // FAQ items for different categories
  const registrationFAQs = [
    {
      question: "When does course registration open for the next semester?",
      answer: "Course registration for continuing students typically opens about 2 months before the start of the next semester. Registration dates are assigned based on completed credit hours, with seniors registering first. Check the Academic Calendar in your student portal for exact dates."
    },
    {
      question: "How many credits can I register for in one semester?",
      answer: "Full-time students can register for 12-18 credits per semester. If you want to take more than 18 credits, you'll need approval from your academic advisor and the registrar's office. Part-time students typically take fewer than 12 credits per semester."
    },
    {
      question: "What is the waitlist process?",
      answer: "If a course is full, you can join the waitlist. As spots become available, students are automatically enrolled from the waitlist in the order they joined. You'll receive an email notification if you're enrolled from the waitlist. It's recommended to have a backup course plan in case you don't get off the waitlist."
    },
    {
      question: "How do I drop a course?",
      answer: "You can drop a course through the Registration section of your student portal. Be aware of the drop deadlines: courses dropped before the add/drop deadline won't appear on your transcript; courses dropped after that deadline but before the withdrawal deadline will appear with a 'W' grade. Financial implications may apply based on when you drop."
    }
  ];
  
  const gradingFAQs = [
    {
      question: "How is my GPA calculated?",
      answer: "Your GPA is calculated by dividing the total number of grade points earned by the total number of credit hours attempted. Each letter grade has a corresponding grade point value: A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, and so on. This value is multiplied by the credit hours for each course to get the grade points for that course."
    },
    {
      question: "What's the difference between Term GPA and Cumulative GPA?",
      answer: "Term GPA is calculated based only on the courses taken in the current academic term. Cumulative GPA includes all courses taken throughout your academic career at the university. Both are shown on your transcript and are used to evaluate academic standing."
    },
    {
      question: "Can I see my current grade in a course?",
      answer: "Yes, you can view your current grades in the Grades section of the student portal. However, keep in mind that some instructors update grades more frequently than others, and some assignments may not be factored in yet. For the most accurate information, check the Moodle page for your course or speak with your instructor."
    }
  ];
  
  const moodleFAQs = [
    {
      question: "How do I access my course materials on Moodle?",
      answer: "Log in to Moodle using your university credentials. On your dashboard, you'll see all courses you're enrolled in for the current semester. Click on a course to access its materials, including syllabus, readings, assignments, and discussion forums."
    },
    {
      question: "My course isn't showing up in Moodle. What should I do?",
      answer: "First, verify that you're officially registered for the course in the student portal. There might be a delay of up to 24 hours between registration and Moodle access. If you're registered but still don't see the course after 24 hours, check if the instructor has made the course visible yet. If problems persist, contact the IT help desk."
    },
    {
      question: "How do I submit assignments on Moodle?",
      answer: "Navigate to your course page and find the assignment you need to submit. Click on the assignment title to view details and submission instructions. Click the 'Add submission' button, then either drag and drop your file or click to browse for it. Make sure to click 'Save changes' to complete your submission."
    }
  ];
  
  const technicalFAQs = [
    {
      question: "I forgot my password. How do I reset it?",
      answer: "You can reset your password on the login page by clicking the 'Forgot Password' link. You'll need to provide your university email address to receive a password reset link. For security reasons, the link will expire after 24 hours. If you can't access your email, contact the IT Help Desk."
    },
    {
      question: "How do I access my university email?",
      answer: "Your university email can be accessed by going to the university webmail portal at mail.university.edu and logging in with your university credentials. You can also set up your university email on your mobile device or desktop email client using the settings provided in the IT Services section of the student portal."
    },
    {
      question: "What should I do if I'm experiencing technical issues with the system?",
      answer: "For technical issues, first try clearing your browser cache and cookies, then restart your browser. If the issue persists, use a different browser. Make sure your internet connection is stable. If you still experience problems, contact the IT Help Desk with specific details about the issue, including any error messages you're seeing."
    }
  ];
  
  // Sample knowledge base articles
  const knowledgeBaseArticles = [
    {
      id: 1,
      title: "Complete Guide to Course Registration",
      description: "Learn how to register for courses, understand prerequisites, and manage your academic schedule effectively.",
      category: "Registration",
      tags: ["registration", "courses", "scheduling"],
      readTime: "5 min read",
      updated: "2 weeks ago"
    },
    {
      id: 2,
      title: "Understanding the Grading System",
      description: "A comprehensive overview of the university's grading policies, GPA calculation, and academic standing requirements.",
      category: "Grades",
      tags: ["grades", "gpa", "academic standing"],
      readTime: "7 min read",
      updated: "1 month ago"
    },
    {
      id: 3,
      title: "Moodle Tutorial for Students",
      description: "Step-by-step guide to navigating Moodle, submitting assignments, participating in discussions, and tracking your progress.",
      category: "Moodle",
      tags: ["moodle", "lms", "assignments"],
      readTime: "10 min read",
      updated: "3 weeks ago"
    },
    {
      id: 4,
      title: "Financial Aid and Scholarship Information",
      description: "Information about available financial aid options, scholarship applications, and payment deadlines.",
      category: "Financial",
      tags: ["financial aid", "scholarships", "tuition"],
      readTime: "8 min read",
      updated: "2 months ago"
    },
    {
      id: 5,
      title: "Student Account Security Best Practices",
      description: "Learn how to keep your student account secure, manage passwords, and protect your personal information.",
      category: "Technical",
      tags: ["security", "password", "account"],
      readTime: "4 min read",
      updated: "1 week ago"
    }
  ];
  
  // Sample recent support tickets
  const supportTickets = [
    {
      id: "TKT-7821",
      subject: "Unable to access Calculus I course in Moodle",
      status: "Open",
      created: "May 14, 2025",
      updated: "May 15, 2025",
      category: "Moodle Access",
      priority: "Medium"
    },
    {
      id: "TKT-7643",
      subject: "Question about withdrawal deadline for summer courses",
      status: "Closed",
      created: "May 10, 2025",
      updated: "May 12, 2025",
      category: "Registration",
      priority: "Low"
    }
  ];
  
  // Filter FAQs based on search query
  const filterFAQs = (faqs: any[]) => {
    if (!searchQuery) return faqs;
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // Filter knowledge base articles based on search query
  const filteredArticles = searchQuery 
    ? knowledgeBaseArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : knowledgeBaseArticles;

  return (
    <AppShell>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Help Center</h1>
            <p className="text-slate-500 mt-1">
              Find answers, access resources, and get the support you need
            </p>
          </div>
        </div>
        
        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="max-w-2xl mx-auto mb-4 text-center">
              <h2 className="text-2xl font-bold mb-2">How can we help you today?</h2>
              <p className="text-slate-500">
                Search our knowledge base or browse categories below
              </p>
            </div>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input 
                className="pl-10" 
                placeholder="Search for answers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-6 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Course Registration</h3>
              <p className="text-sm text-slate-500">
                Register for courses and manage your schedule
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-6 text-center">
              <GraduationCap className="mx-auto h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Grades & Transcripts</h3>
              <p className="text-sm text-slate-500">
                View your grades and access official transcripts
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-6 text-center">
              <Calendar className="mx-auto h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Academic Calendar</h3>
              <p className="text-sm text-slate-500">
                Important dates, deadlines, and events
              </p>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-6 text-center">
              <Settings className="mx-auto h-10 w-10 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Technical Support</h3>
              <p className="text-sm text-slate-500">
                Password resets and system access issues
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="faq">
          <TabsList className="mb-4">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="support">Support Tickets</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>
          
          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about the university's course registration system
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Tabs defaultValue="registration">
                  <TabsList className="mb-4">
                    <TabsTrigger value="registration">Registration</TabsTrigger>
                    <TabsTrigger value="grading">Grades & Transcripts</TabsTrigger>
                    <TabsTrigger value="moodle">Moodle</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="registration">
                    <Accordion type="single" collapsible className="w-full">
                      {filterFAQs(registrationFAQs).map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="grading">
                    <Accordion type="single" collapsible className="w-full">
                      {filterFAQs(gradingFAQs).map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="moodle">
                    <Accordion type="single" collapsible className="w-full">
                      {filterFAQs(moodleFAQs).map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="technical">
                    <Accordion type="single" collapsible className="w-full">
                      {filterFAQs(technicalFAQs).map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-slate-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="border-t py-4 bg-slate-50 dark:bg-slate-800">
                <div className="w-full text-center">
                  <p className="text-slate-600 dark:text-slate-300">
                    Didn't find what you're looking for?{" "}
                    <Button variant="link" className="px-1 h-auto py-0">Contact Support</Button>
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>
                  Browse detailed articles and tutorials on various topics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredArticles.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredArticles.map(article => (
                      <Card key={article.id} className="border hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <Badge className="w-fit">{article.category}</Badge>
                          <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-slate-600 text-sm">{article.description}</p>
                          <div className="flex gap-2 mt-3">
                            {article.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between py-2 text-xs text-slate-500">
                          <span>{article.readTime}</span>
                          <span>Updated {article.updated}</span>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <HelpCircle className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No results found</h3>
                    <p className="text-slate-500">
                      Try adjusting your search terms or browse all articles
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      View All Articles
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Support Tickets Tab */}
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>
                      View and manage your support requests
                    </CardDescription>
                  </div>
                  <Button>New Support Ticket</Button>
                </div>
              </CardHeader>
              <CardContent>
                {supportTickets.length > 0 ? (
                  <div className="space-y-4">
                    {supportTickets.map(ticket => (
                      <Card key={ticket.id} className="overflow-hidden border">
                        <div className="flex items-center gap-4 p-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-mono">
                                {ticket.id}
                              </Badge>
                              <Badge 
                                variant={ticket.status === "Open" ? "default" : "secondary"}
                                className="capitalize"
                              >
                                {ticket.status}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {ticket.priority}
                              </Badge>
                            </div>
                            <h3 className="font-medium">{ticket.subject}</h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                              <span>Created: {ticket.created}</span>
                              <span>•</span>
                              <span>Updated: {ticket.updated}</span>
                              <span>•</span>
                              <span>Category: {ticket.category}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MessageCircle className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No support tickets</h3>
                    <p className="text-slate-500">
                      You don't have any open support requests at this time
                    </p>
                    <Button className="mt-4">
                      Create Support Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Contact Us Tab */}
          <TabsContent value="contact">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Get help from our support team by submitting a request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input defaultValue={user?.firstName} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input defaultValue={user?.lastName} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input defaultValue={user?.email} />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input placeholder="Briefly describe your issue" />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <select className="w-full px-3 py-2 border rounded-md">
                        <option value="">Select a category</option>
                        <option value="registration">Course Registration</option>
                        <option value="grades">Grades & Transcripts</option>
                        <option value="moodle">Moodle</option>
                        <option value="technical">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea 
                        className="w-full px-3 py-2 border rounded-md min-h-32" 
                        placeholder="Please provide as much detail as possible about your issue"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Attachments (Optional)</label>
                      <Input type="file" />
                    </div>
                    
                    <Button className="w-full">Submit Support Request</Button>
                  </form>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-50 p-2 rounded-md dark:bg-primary-900">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-sm text-slate-500">Available Monday-Friday, 8am-6pm</p>
                        <p className="text-sm font-medium mt-1">(555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-50 p-2 rounded-md dark:bg-primary-900">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-sm text-slate-500">24/7 support with 24-hour response time</p>
                        <p className="text-sm font-medium mt-1">support@university.edu</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-50 p-2 rounded-md dark:bg-primary-900">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-slate-500">Available Monday-Friday, 9am-5pm</p>
                        <Button variant="link" className="text-sm p-0 h-auto mt-1">
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Help Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <a href="#" className="text-sm hover:underline">Student Handbook</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <a href="#" className="text-sm hover:underline">Video Tutorials</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <a href="#" className="text-sm hover:underline">System Guide PDFs</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      <a href="#" className="text-sm hover:underline">IT Services Website</a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}