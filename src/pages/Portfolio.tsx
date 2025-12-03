import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Contact from "@/components/portfolio/Contact";

const Portfolio = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPortfolio = () => {
      if (!subdomain) {
        setError("No subdomain provided");
        setLoading(false);
        return;
      }

      try {
        // Check if this is the demo route
        if (subdomain === 'demo') {
          // Show demo data immediately
        } else {
          // For other subdomains, try to load from localStorage first
          const localPortfolio = localStorage.getItem('current_portfolio');
          if (localPortfolio) {
            const data = JSON.parse(localPortfolio);
            if (data.subdomain === subdomain && data.status === 'published') {
              setPortfolioData(data.portfolio_data);
              setLoading(false);
              return;
            }
          }
        }

        // Show comprehensive demo data
        const demoData = {
          name: "Sarah Johnson",
          title: "Senior Software Engineer",
          tagline: "Building scalable web applications with modern technologies",
          bio: "Passionate software engineer with 6+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 123-4567",
          github: "https://github.com/sarahjohnson",
          linkedin: "https://linkedin.com/in/sarahjohnson",
          about: "I'm a results-driven software engineer with a passion for creating efficient, scalable solutions. With over 6 years of experience in the tech industry, I've successfully delivered 15+ production applications serving millions of users.",
          stats: { yearsExperience: 6, projectsCompleted: 15, usersImpacted: "2M+" },
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
              description: "Lead development of microservices architecture serving 1M+ daily active users.",
              achievements: [
                "Reduced API response time by 40% through database optimization",
                "Led team of 5 engineers in migrating legacy systems to cloud"
              ]
            },
            {
              title: "Full Stack Developer",
              company: "StartupXYZ",
              duration: "2019 - 2021",
              location: "Remote",
              description: "Built and maintained customer-facing web applications using React and Node.js.",
              achievements: [
                "Developed 3 major features increasing user engagement by 25%",
                "Mentored 2 junior developers"
              ]
            }
          ],
          projects: [
            {
              title: "E-commerce Analytics Dashboard",
              description: "Real-time analytics platform for e-commerce businesses with interactive charts and reporting features.",
              technologies: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
              link: "https://github.com/demo/ecommerce-analytics",
              metrics: "Increased client revenue by 22%"
            },
            {
              title: "Task Management API",
              description: "RESTful API for task management with authentication and real-time updates.",
              technologies: ["Node.js", "Express", "MongoDB", "Socket.io"],
              link: "https://github.com/demo/task-api",
              metrics: "Supports 10K+ concurrent users"
            }
          ],
          contact: {
            email: "sarah.johnson@email.com",
            phone: "+1 (555) 123-4567",
            linkedin: "https://linkedin.com/in/sarahjohnson",
            github: "https://github.com/sarahjohnson",
            location: "San Francisco, CA"
          }
        };
        
        setPortfolioData(demoData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading portfolio:', err);
        setError("Failed to load portfolio");
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [subdomain]);

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

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "This portfolio doesn't exist or is not publicly available."}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Your Portfolio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero
        name={portfolioData.name}
        title={portfolioData.title}
        email={portfolioData.email}
        github={portfolioData.github}
        linkedin={portfolioData.linkedin}
        resumeUrl={portfolioData.resumeUrl}
      />
      <About
        about={portfolioData.about}
        stats={portfolioData.stats}
      />
      <Skills skills={portfolioData.skills} />
      <Projects projects={portfolioData.projects} />
      <Experience experience={portfolioData.experience} />
      <Contact
        contact={portfolioData.contact}
      />
    </div>
  );
};

export default Portfolio;
