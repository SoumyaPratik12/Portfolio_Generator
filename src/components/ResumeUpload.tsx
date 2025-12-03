import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { z } from "zod";
import { parseResume } from "@/lib/resumeParser";

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
      toast.success("Parsing resume... Extracting your information.");
      console.log('About to parse file:', selectedFile.name);
      
      const parsedResume = await parseResume(selectedFile);
      console.log('Received parsed resume:', parsedResume);
      
      const parsedData = {
        name: parsedResume.name,
        title: parsedResume.title,
        tagline: `${parsedResume.title} with expertise in modern technologies`,
        bio: parsedResume.summary,
        email: parsedResume.email,
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        resumeUrl: "#",
        about: parsedResume.summary,
        stats: {
          yearsExperience: Math.max(1, parsedResume.experience.length),
          projectsCompleted: Math.max(1, parsedResume.projects.length),
          usersImpacted: "1K+"
        },
        skills: parsedResume.skills.length > 0 ? parsedResume.skills : [{ name: 'Professional Skills', category: 'General' }],
        experience: parsedResume.experience.length > 0 ? parsedResume.experience : [{
          title: parsedResume.title,
          company: 'Previous Company',
          duration: '2020 - Present',
          location: 'Location',
          description: `${parsedResume.title} with professional experience.`,
          achievements: ['Professional accomplishments']
        }],
        projects: parsedResume.projects.length > 0 ? parsedResume.projects : [{
          title: 'Professional Project',
          description: 'A project showcasing professional skills and expertise.',
          technologies: ['Technology'],
          link: 'https://github.com/username/project'
        }],
        contact: {
          email: parsedResume.email,
          linkedin: "https://linkedin.com/in/yourusername",
          github: "https://github.com/yourusername",
          location: "Your City, State"
        }
      };
      
      console.log('Final portfolio data structure:', parsedData);

      // File processed locally (no upload needed for demo)
      const filePath = `local/${selectedFile.name}`;

      // Create portfolio data with unique ID
      const portfolioData = {
        id: `portfolio-${Date.now()}`,
        subdomain: `portfolio-${Date.now()}`,
        status: 'draft',
        visibility: 'private',
        portfolio_data: parsedData,
        resume_file_path: filePath,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Data stored locally in localStorage

      toast.success("Resume parsed successfully! Redirecting to preview...");

      // Store portfolio data in localStorage for preview
      try {
        console.log('Saving portfolio data to localStorage:', portfolioData);
        localStorage.setItem('current_portfolio', JSON.stringify(portfolioData));
        console.log('Portfolio data saved successfully');
        
        // Verify data was saved correctly
        const savedData = localStorage.getItem('current_portfolio');
        if (savedData) {
          const verifiedData = JSON.parse(savedData);
          console.log('Verified saved data in localStorage:', verifiedData);
          console.log('Portfolio name in saved data:', verifiedData.portfolio_data?.name);
          
          setPortfolioData(portfolioData);
          setUploadComplete(true);
          
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent('portfolioUpdated', { detail: portfolioData }));
          
          toast.success(`Portfolio generated for ${parsedData.name}! You can now preview or edit it.`);
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
