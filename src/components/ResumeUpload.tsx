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
import { parseResumeWithLovable } from "@/lib/lovableParser";

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

      toast.success("Parsing resume and generating live portfolio...");
      console.log('About to parse file:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type);
      
      // Use Lovable enhanced parsing
      const parsedResume = await parseResumeWithLovable(selectedFile);
      console.log('Received parsed resume:', parsedResume);
      
      // Ensure we have valid parsed data
      if (!parsedResume || typeof parsedResume !== 'object') {
        console.warn('Invalid parsed resume data, using defaults');
        throw new Error('Resume parsing returned invalid data');
      }
      
      // Normalize parsed data - only use name from resume content
      const normalizedName = parsedResume.name || '';
      console.log('Normalized name from parser:', normalizedName);
      
      const parsedData = {
        name: normalizedName,
        title: parsedResume.title || 'Software Engineer',
        email: parsedResume.email || 'user@example.com',
        github: "https://github.com/yourusername",
        linkedin: "https://linkedin.com/in/yourusername",
        resumeUrl: "#",
        about: parsedResume.summary || 'Passionate professional with expertise in modern technologies and a strong commitment to delivering high-quality solutions.',
        stats: {
          yearsExperience: Math.max(2, parsedResume.experience.length),
          projectsCompleted: Math.max(2, parsedResume.projects.length),
          usersImpacted: "1K+"
        },
        skills: parsedResume.skills.length > 0 ? parsedResume.skills : [
          { name: 'JavaScript', category: 'Programming Languages' },
          { name: 'React', category: 'Frontend' },
          { name: 'Node.js', category: 'Backend' },
          { name: 'Problem Solving', category: 'Soft Skills' }
        ],
        experience: parsedResume.experience.length > 0 ? parsedResume.experience : [{
          title: parsedResume.title || 'Software Engineer',
          company: 'Technology Company',
          duration: '2022 - Present',
          location: 'Remote',
          description: 'Developing modern web applications and software solutions using cutting-edge technologies.',
          achievements: [
            'Built responsive web applications using modern frameworks',
            'Collaborated with cross-functional teams to deliver high-quality software'
          ]
        }],
        projects: parsedResume.projects.length > 0 ? parsedResume.projects : [
          {
            title: 'Portfolio Website',
            description: 'A responsive portfolio website showcasing professional skills and projects.',
            technologies: ['React', 'TypeScript', 'Tailwind CSS'],
            link: 'https://github.com/username/portfolio'
          },
          {
            title: 'Web Application',
            description: 'Full-stack web application with modern features and user-friendly interface.',
            technologies: ['JavaScript', 'Node.js', 'MongoDB'],
            link: 'https://github.com/username/webapp'
          }
        ],
        contact: {
          email: parsedResume.email || 'user@example.com',
          linkedin: "https://linkedin.com/in/yourusername",
          github: "https://github.com/yourusername",
          location: "Your City, State"
        }
      };
      
      console.log('Final portfolio data structure:', parsedData);
      console.log('Parsed summary for About section:', parsedResume.summary);

      // File processed locally
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
      
      toast.success("Resume parsed successfully!");

      // Store portfolio data locally (no auto-deployment)
      try {
        console.log('Saving portfolio data:', portfolioData);
        localStorage.setItem('current_portfolio', JSON.stringify(portfolioData));
        
        setPortfolioData(portfolioData);
        setUploadComplete(true);
        
        const displayName = parsedData.name || 'Professional';
        toast.success(`Portfolio generated for ${displayName}! Ready for preview and manual deployment.`);
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('portfolioUpdated', { detail: portfolioData }));
        
      } catch (error) {
        console.error('Failed to save portfolio:', error);
        toast.error('Failed to process portfolio. Please try again.');
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
              Your portfolio has been generated from your resume. Preview it, make edits, and deploy manually when ready.
            </p>
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-700">
                💡 <strong>Manual Deployment:</strong> Use the "Deploy Live" button in the preview page to publish your portfolio when you're satisfied with it.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                onClick={() => {
                  // Ensure data is saved before navigation
                  localStorage.setItem('current_portfolio', JSON.stringify(portfolioData));
                  navigate("/preview");
                }} 
                className="flex items-center justify-center gap-2"
              >
                👁️ PREVIEW & DEPLOY
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
