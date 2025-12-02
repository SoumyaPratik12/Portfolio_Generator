import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, Smartphone, Tablet, Eye, ExternalLink, Maximize2 } from "lucide-react";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Contact from "@/components/portfolio/Contact";

interface LivePreviewProps {
  portfolioData: any;
  className?: string;
}

const LivePreview = ({ portfolioData, className = "" }: LivePreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getPreviewStyles = () => {
    const baseStyles = "transition-all duration-300 bg-white border-2 border-gray-200 rounded-lg overflow-hidden";
    
    switch (viewMode) {
      case 'mobile':
        return `${baseStyles} w-[375px] h-[600px] mx-auto`;
      case 'tablet':
        return `${baseStyles} w-[768px] h-[600px] mx-auto`;
      default:
        return `${baseStyles} w-full h-[600px]`;
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Live Preview</h3>
            <span className="text-sm text-muted-foreground">
              {portfolioData?.subdomain}.portfoliogen.app
            </span>
          </div>
          <Button onClick={() => setIsFullscreen(false)} variant="outline">
            Exit Fullscreen
          </Button>
        </div>
        
        <div className="min-h-screen">
          <Hero
            name={portfolioData?.name}
            title={portfolioData?.title}
            tagline={portfolioData?.tagline}
            bio={portfolioData?.bio}
            email={portfolioData?.email}
            github={portfolioData?.github}
            linkedin={portfolioData?.linkedin}
            resumeUrl={portfolioData?.resumeUrl}
          />
          <About
            about={portfolioData?.about}
            stats={portfolioData?.stats}
          />
          <Skills skills={portfolioData?.skills} />
          <Experience experience={portfolioData?.experience} />
          <Projects projects={portfolioData?.projects} />
          <Contact contact={portfolioData?.contact} />
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="h-8 w-8 p-0"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tablet')}
                className="h-8 w-8 p-0"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="h-8 w-8 p-0"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Preview how your portfolio will look to visitors
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className={getPreviewStyles()}>
            <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300">
              <div className="transform scale-50 origin-top-left w-[200%] h-[200%]">
                <Hero
                  name={portfolioData?.name}
                  title={portfolioData?.title}
                  tagline={portfolioData?.tagline}
                  bio={portfolioData?.bio}
                  email={portfolioData?.email}
                  github={portfolioData?.github}
                  linkedin={portfolioData?.linkedin}
                  resumeUrl={portfolioData?.resumeUrl}
                />
                <About
                  about={portfolioData?.about}
                  stats={portfolioData?.stats}
                />
                <Skills skills={portfolioData?.skills} />
                <Experience experience={portfolioData?.experience} />
                <Projects projects={portfolioData?.projects} />
                <Contact contact={portfolioData?.contact} />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Viewing: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} Mode</span>
            <Button variant="link" size="sm" className="h-auto p-0">
              <ExternalLink className="h-3 w-3 mr-1" />
              Open in new tab
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePreview;