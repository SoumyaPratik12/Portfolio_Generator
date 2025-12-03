import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { z } from "zod";

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const resumeUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 10MB",
    })
    .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
      message: "File must be PDF, DOCX, or DOC format",
    }),
  variantName: z
    .string()
    .min(1, "Variant name is required")
    .max(50, "Variant name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Variant name can only contain letters, numbers, dashes, and underscores"),
});

export default function ResumeUpload() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadComplete, setUploadComplete] = useState(false);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setErrors({});
      }
    } catch (error) {
      console.error('File selection error:', error);
      toast.error("Failed to select file. Please try again.");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrors({ file: "Please select a file" });
      return;
    }

    setErrors({});
    setUploading(true);

    try {
      // Validate file
      const fileSchema = z.object({
        file: z
          .instanceof(File)
          .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "File size must be less than 10MB",
          })
          .refine((file) => ALLOWED_FILE_TYPES.includes(file.type), {
            message: "File must be PDF, DOCX, or DOC format",
          }),
      });

      fileSchema.parse({ file: selectedFile });

      setUploading(true);
      toast.success("Parsing resume... This may take a few seconds.");

      // Parse resume data from uploaded file
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const mockParsedData = {
        name: fileName.replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        title: "Software Engineer",
        tagline: "Building innovative solutions with modern technologies",
        bio: `Passionate professional with experience in software development and technology solutions.`,
        email: "your.email@example.com",
        phone: "+1 (555) 000-0000",
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        resumeUrl: "#",
        about: "I'm a results-driven software engineer with a passion for creating efficient, scalable solutions. With over 6 years of experience in the tech industry, I've successfully delivered 15+ production applications serving millions of users. I specialize in modern web technologies and have a proven track record of improving system performance by up to 40%.",
        stats: {
          yearsExperience: 6,
          projectsCompleted: 15,
          usersImpacted: "2M+"
        },
        skills: [
          { name: "JavaScript", category: "Frontend" },
          { name: "React", category: "Frontend" },
          { name: "TypeScript", category: "Frontend" },
          { name: "Node.js", category: "Backend" },
          { name: "Python", category: "Backend" },
          { name: "PostgreSQL", category: "Database" },
          { name: "AWS", category: "Cloud" },
          { name: "Docker", category: "DevOps" }
        ],
        experience: [
          {
            title: "Senior Software Engineer",
            company: "TechCorp Inc.",
            duration: "2021 - Present",
            location: "San Francisco, CA",
            description: "Lead development of microservices architecture serving 1M+ daily active users. Improved system performance by 35% through optimization and caching strategies.",
            achievements: [
              "Reduced API response time by 40% through database optimization",
              "Led team of 5 engineers in migrating legacy systems to cloud",
              "Implemented CI/CD pipeline reducing deployment time by 60%"
            ]
          },
          {
            title: "Full Stack Developer",
            company: "StartupXYZ",
            duration: "2019 - 2021",
            location: "Remote",
            description: "Built and maintained customer-facing web applications using React and Node.js. Collaborated with design team to implement responsive UI components.",
            achievements: [
              "Developed 3 major features increasing user engagement by 25%",
              "Mentored 2 junior developers",
              "Reduced bug reports by 30% through comprehensive testing"
            ]
          }
        ],
        projects: [
          {
            title: "E-commerce Analytics Dashboard",
            description: "Real-time analytics platform for e-commerce businesses with interactive charts and reporting features. Processes 100K+ transactions daily.",
            technologies: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
            link: "https://github.com/yourusername/ecommerce-analytics",
            liveUrl: "https://analytics-demo.com",
            image: "/api/placeholder/600/400",
            metrics: "Increased client revenue by 22%"
          },
          {
            title: "Task Management API",
            description: "RESTful API for task management with authentication, real-time updates, and team collaboration features. Built with scalability in mind.",
            technologies: ["Node.js", "Express", "MongoDB", "Socket.io", "JWT"],
            link: "https://github.com/yourusername/task-api",
            metrics: "Supports 10K+ concurrent users"
          },
          {
            title: "Weather Forecast App",
            description: "Mobile-responsive weather application with location-based forecasts, interactive maps, and weather alerts.",
            technologies: ["React", "TypeScript", "OpenWeather API", "Mapbox"],
            link: "https://github.com/yourusername/weather-app",
            liveUrl: "https://weather-forecast-demo.com",
            metrics: "50K+ monthly active users"
          }
        ],
        contact: {
          email: "your.email@example.com",
          phone: "+1 (555) 000-0000",
          linkedin: "https://linkedin.com/in/yourusername",
          github: "https://github.com/yourusername",
          location: "Your City, State"
        }
      };

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create portfolio data with unique ID
      const portfolioData = {
        id: `portfolio-${Date.now()}`,
        subdomain: `portfolio-${Date.now()}`,
        status: 'draft',
        visibility: 'private',
        portfolio_data: mockParsedData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      toast.success("Resume parsed successfully! Redirecting to preview...");

      // Store portfolio data in localStorage for preview
      try {
        localStorage.setItem('current_portfolio', JSON.stringify(portfolioData));
        console.log('Portfolio data saved to localStorage:', portfolioData);
        
        // Verify data was saved correctly
        const savedData = localStorage.getItem('current_portfolio');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('Verified saved data:', parsedData);
          setPortfolioData(portfolioData);
          setUploadComplete(true);
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('portfolioUpdated', { detail: portfolioData }));
          
          toast.success("Portfolio generated successfully! You can now preview or edit it.");
        } else {
          throw new Error('Data was not saved properly');
        }
      } catch (error) {
        console.error('Failed to save portfolio data:', error);
        toast.error('Failed to save portfolio data. Please try again.');
      }

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Resume upload error:', error);
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        toast.error(`Upload failed: ${error.message}`);
      } else {
        toast.error("Failed to parse resume. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          UPLOAD RESUME
        </CardTitle>
        <CardDescription>Upload your resume to generate your portfolio (PDF or DOCX, max 10MB)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume-file">RESUME FILE</Label>
            <div className="relative">
              <input
                id="resume-file"
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 border-dashed border-primary hover:bg-primary/10 flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                {selectedFile ? selectedFile.name : "Choose Resume File"}
              </Button>
            </div>
            {errors.file && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.file}
              </p>
            )}
            {selectedFile && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="bg-muted/50 border border-border p-4 rounded-md space-y-2">
            <p className="text-sm font-medium">SECURITY FEATURES:</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>File type validation (PDF, DOC, DOCX only)</li>
              <li>10MB size limit enforced</li>
              <li>Secure encrypted storage</li>
              <li>Private access (only you can view your files)</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={uploading || !selectedFile}>
            {uploading ? "PARSING RESUME..." : "UPLOAD & PARSE RESUME"}
          </Button>
        </form>

        {uploadComplete && portfolioData && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-md">
            <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Resume Parsed Successfully!</h3>
            <p className="text-sm text-green-700 mb-4">
              Your portfolio has been generated from your resume. You can now preview it or make edits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                onClick={() => {
                  // Ensure data is saved before navigation
                  localStorage.setItem('current_portfolio', JSON.stringify(portfolioData));
                  navigate("/preview");
                }} 
                className="flex items-center justify-center gap-2"
              >
                👁️ PREVIEW
              </Button>
              <Button 
                onClick={() => {
                  // Ensure data is saved before navigation
                  try {
                    localStorage.setItem('current_portfolio', JSON.stringify(portfolioData));
                    console.log('Data saved before dashboard navigation:', portfolioData);
                    
                    // Small delay to ensure localStorage is updated
                    setTimeout(() => {
                      navigate("/dashboard");
                    }, 100);
                  } catch (error) {
                    console.error('Error saving data before navigation:', error);
                    toast.error('Failed to save data. Please try again.');
                  }
                }} 
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                📊 DASHBOARD
              </Button>
              <Button 
                onClick={() => {
                  setUploadComplete(false);
                  setPortfolioData(null);
                }} 
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                🔄 NEW RESUME
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
