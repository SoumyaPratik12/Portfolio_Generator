import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Globe, Eye } from "lucide-react";
import { toast } from "sonner";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Experience from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import Contact from "@/components/portfolio/Contact";
import LivePreview from "@/components/LivePreview";

const Preview = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const loadPortfolio = () => {
      try {
        // Load from localStorage
        const localPortfolio = localStorage.getItem('current_portfolio');
        if (localPortfolio) {
          const data = JSON.parse(localPortfolio);
          console.log('Loaded portfolio data:', data);
          setPortfolio(data);
        } else {
          // Create default portfolio data for testing
          const defaultPortfolio = {
            id: 'default-portfolio',
            subdomain: 'default-portfolio',
            status: 'draft',
            visibility: 'private',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            portfolio_data: {
              name: "John Doe",
              title: "Software Engineer",
              tagline: "Building amazing web applications",
              bio: "Passionate developer with experience in modern web technologies.",
              email: "john.doe@email.com",
              phone: "+1 (555) 123-4567",
              github: "https://github.com/johndoe",
              linkedin: "https://linkedin.com/in/johndoe",
              about: "I'm a software engineer with 5+ years of experience building web applications.",
              stats: { yearsExperience: 5, projectsCompleted: 10, usersImpacted: "100K+" },
              skills: [
                { name: "JavaScript", category: "Frontend" },
                { name: "React", category: "Frontend" },
                { name: "Node.js", category: "Backend" },
                { name: "Python", category: "Backend" }
              ],
              experience: [
                {
                  title: "Software Engineer",
                  company: "Tech Company",
                  duration: "2020 - Present",
                  location: "San Francisco, CA",
                  description: "Developing web applications using React and Node.js.",
                  achievements: ["Built 5 major features", "Improved performance by 30%"]
                }
              ],
              projects: [
                {
                  title: "Web Application",
                  description: "A modern web application built with React and Node.js.",
                  technologies: ["React", "Node.js", "MongoDB"],
                  link: "https://github.com/johndoe/project",
                  metrics: "Used by 1000+ users"
                }
              ],
              contact: {
                email: "john.doe@email.com",
                phone: "+1 (555) 123-4567",
                linkedin: "https://linkedin.com/in/johndoe",
                github: "https://github.com/johndoe",
                location: "San Francisco, CA"
              }
            }
          };
          setPortfolio(defaultPortfolio);
          console.log('No portfolio data found in localStorage. Using default data for preview.');
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
        toast.error('Failed to load portfolio');
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20) || 'portfolio';
  };

  const getAppUrl = () => {
    return import.meta.env.VITE_APP_URL || 'https://portfoliogenerator.com';
  };

  const getPortfolioDomain = () => {
    return import.meta.env.VITE_PORTFOLIO_DOMAIN || 'portfoliogenerator.com';
  };

  const handleDeploy = async () => {
    if (!portfolio) {
      toast.error("No portfolio data available for deployment.");
      return;
    }

    setDeploying(true);
    try {
      // Generate personalized subdomain from user's name
      const userName = portfolio.portfolio_data?.name || 'user';
      const subdomain = generateSubdomain(userName);
      const deployedUrl = `https://${subdomain}.${getPortfolioDomain()}`;
      
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update portfolio with generated subdomain
      const updatedPortfolio = { 
        ...portfolio,
        subdomain,
        status: 'published', 
        visibility: 'public',
        deployed_url: deployedUrl,
        updated_at: new Date().toISOString()
      };
      
      setPortfolio(updatedPortfolio);
      localStorage.setItem('current_portfolio', JSON.stringify(updatedPortfolio));
      
      toast.success(`Portfolio deployed successfully!`);
      
      // Open the deployed portfolio
      setTimeout(() => {
        toast.success(`Your portfolio is now live at: ${deployedUrl}`);
        window.open(deployedUrl, '_blank');
      }, 1000);
    } catch (error) {
      console.error('Deploy error:', error);
      if (error instanceof Error) {
        toast.error(`Deployment failed: ${error.message}`);
      } else {
        toast.error("Failed to deploy portfolio. Please try again.");
      }
    } finally {
      setDeploying(false);
    }
  };

  const updatePortfolioData = (newData: any) => {
    if (!portfolio) {
      toast.error("No portfolio data available for update.");
      return;
    }

    try {
      const updatedPortfolio = { 
        ...portfolio, 
        portfolio_data: newData,
        updated_at: new Date().toISOString()
      };
      
      setPortfolio(updatedPortfolio);
      localStorage.setItem('current_portfolio', JSON.stringify(updatedPortfolio));
      toast.success('Portfolio updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      if (error instanceof Error) {
        toast.error(`Update failed: ${error.message}`);
      } else {
        toast.error('Failed to update portfolio');
      }
    }
  };

  const portfolioData = portfolio?.portfolio_data || {};
  console.log('Portfolio data for rendering:', portfolioData);

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Dashboard Header */}
      <div className="sticky top-0 z-50 bg-background border-b-4 border-primary shadow-lg">
        <div className="container mx-auto p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 border-2 border-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Upload
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-muted-foreground">PREVIEW:</span>
                <span className="font-mono text-sm font-bold">{portfolio.subdomain || generateSubdomain(portfolioData.name || 'user')}.{getPortfolioDomain()}</span>
                <span className={`px-2 py-1 text-xs font-mono rounded ${
                  portfolio.status === 'published' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                }`}>
                  {portfolio.status === 'published' ? '🟢 LIVE' : '🟡 DRAFT'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 border-2 border-primary"
              >
                <Edit className="h-4 w-4" />
                {isEditing ? "✅ EDITING MODE" : "✏️ EDIT PORTFOLIO"}
              </Button>
              <Button
                onClick={handleDeploy}
                disabled={deploying}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Globe className="h-4 w-4" />
                {deploying ? '⏳ DEPLOYING...' : portfolio.status === 'published' ? '🚀 REDEPLOY' : '🚀 DEPLOY LIVE'}
              </Button>
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 font-medium">
                📝 <strong>Editing Mode Active:</strong> Click on any section below to make changes. Your changes are saved automatically.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="relative bg-background min-h-screen">
        {showPreview && (
          <div className="container mx-auto px-4 py-6">
            <LivePreview 
              portfolioData={portfolioData} 
              className="mb-6"
            />
          </div>
        )}
        <Hero
          name={portfolioData.name || "Your Name"}
          title={portfolioData.title || "Your Title"}
          tagline={portfolioData.tagline || "Your tagline"}
          bio={portfolioData.bio || "Your bio"}
          email={portfolioData.email}
          github={portfolioData.github}
          linkedin={portfolioData.linkedin}
          resumeUrl={portfolioData.resumeUrl}
          isEditing={isEditing}
          onUpdate={(data) => {
            const newPortfolioData = { ...portfolioData, ...data };
            updatePortfolioData(newPortfolioData);
          }}
        />
        <About
          about={portfolioData.about || "Tell us about yourself..."}
          stats={portfolioData.stats || { yearsExperience: 0, projectsCompleted: 0, usersImpacted: "0" }}
          isEditing={isEditing}
          onUpdate={(data) => {
            const newPortfolioData = { ...portfolioData, about: data.about, stats: data.stats };
            updatePortfolioData(newPortfolioData);
          }}
        />
        <Skills
          skills={portfolioData.skills || []}
          isEditing={isEditing}
          onUpdate={(skills) => {
            const newPortfolioData = { ...portfolioData, skills };
            updatePortfolioData(newPortfolioData);
          }}
        />
        <Experience
          experience={portfolioData.experience || []}
          isEditing={isEditing}
          onUpdate={(experience) => {
            const newPortfolioData = { ...portfolioData, experience };
            updatePortfolioData(newPortfolioData);
          }}
        />
        <Projects
          projects={portfolioData.projects || []}
          isEditing={isEditing}
          onUpdate={(projects) => {
            const newPortfolioData = { ...portfolioData, projects };
            updatePortfolioData(newPortfolioData);
          }}
        />
        <Contact
          contact={portfolioData.contact || {}}
          isEditing={isEditing}
          onUpdate={(contact) => {
            const newPortfolioData = { ...portfolioData, contact };
            updatePortfolioData(newPortfolioData);
          }}
        />
      </div>
    </div>
  );
};

export default Preview;
