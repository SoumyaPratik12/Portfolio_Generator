import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Plus } from "lucide-react";

interface Project {
  id?: string;
  title: string;
  role?: string;
  date?: string;
  summary?: string;
  description: string;
  tech?: string[];
  technologies?: string[];
  image?: string;
  link?: string;
  liveUrl?: string;
  github?: string;
  achievement?: string;
  metrics?: string;
}

interface ProjectsProps {
  projects?: Project[];
  isEditing?: boolean;
  onUpdate?: (projects: Project[]) => void;
}

const Projects = ({
  projects = [
    {
      title: "Sample Project",
      role: "Developer",
      date: "2024",
      summary: "A sample project to showcase your work",
      description: "This is a sample project description. Upload a resume to see your actual projects here.",
      tech: ["React", "TypeScript"],
      image: "https://via.placeholder.com/400x300/1a1a1a/ffffff?text=Project+Image",
      link: "https://example.com",
      github: "https://github.com",
      achievement: "Sample achievement"
    }
  ],
  isEditing = false,
  onUpdate
}: ProjectsProps) => {
  const [displayProjects, setDisplayProjects] = useState<Project[]>(projects || []);

  useEffect(() => {
    try {
      setDisplayProjects(projects || []);
    } catch (error) {
      console.error('Failed to update projects:', error);
      setDisplayProjects([]);
    }
  }, [projects]);

  const handleAddProject = () => {
    const newProject: Project = {
      title: "",
      role: "",
      date: "",
      summary: "",
      description: "",
      tech: [""],
      image: "",
      link: "",
      github: "",
      achievement: ""
    };
    const updated = [...displayProjects, newProject];
    setDisplayProjects(updated);
    onUpdate?.(updated);
  };

  const handleRemoveProject = (index: number) => {
    const updated = displayProjects.filter((_, i) => i !== index);
    setDisplayProjects(updated);
    onUpdate?.(updated);
  };

  const handleUpdateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const updated = displayProjects.map((project, i) =>
      i === index ? { ...project, [field]: value } : project
    );
    setDisplayProjects(updated);
    onUpdate?.(updated);
  };

  const handleAddTech = (projectIndex: number) => {
    const updated = displayProjects.map((project, i) =>
      i === projectIndex
        ? { ...project, tech: [...project.tech, ""] }
        : project
    );
    setDisplayProjects(updated);
    onUpdate?.(updated);
  };

  const handleRemoveTech = (projectIndex: number, techIndex: number) => {
    const updated = displayProjects.map((project, i) =>
      i === projectIndex
        ? { ...project, tech: project.tech.filter((_, j) => j !== techIndex) }
        : project
    );
    setDisplayProjects(updated);
    onUpdate?.(updated);
  };

  const handleUpdateTech = (projectIndex: number, techIndex: number, value: string) => {
    const updated = displayProjects.map((project, i) =>
      i === projectIndex
        ? {
            ...project,
            tech: project.tech.map((tech, j) => j === techIndex ? value : tech)
          }
        : project
    );
    setDisplayProjects(updated);
    onUpdate?.(updated);
  };

  return (
    <section id="projects" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-5xl font-bold border-4 border-primary inline-block px-8 py-4">
              PROJECTS
            </h2>
            {isEditing && (
              <Button onClick={handleAddProject} variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>

          <div className="space-y-12">
            {displayProjects.map((project, index) => (
              <div 
                key={project.id || index} 
                className="border-4 border-primary bg-background overflow-hidden shadow-lg"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image (only for first project) */}
                  {index === 0 && project.image && (
                    <div className="border-b-4 md:border-b-0 md:border-r-4 border-primary">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className={`p-8 ${index === 0 && project.image ? '' : 'md:col-span-2'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                        <div className="text-muted-foreground font-mono text-sm">
                          {project.role} • {project.date}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-lg mb-4">{project.description}</p>
                    
                    {(project.achievement || project.metrics) && (
                      <div className="mb-4 inline-block px-4 py-2 bg-primary text-primary-foreground font-mono text-sm border-2 border-primary">
                        ✓ {project.achievement || project.metrics}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(project.technologies || project.tech || []).map((tech, techIndex) => (
                        <span 
                          key={`${index}-${techIndex}-${tech}`}
                          className="px-3 py-1 bg-secondary border-2 border-primary text-sm font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-4">
                      {(project.link || project.liveUrl) && (
                        <Button 
                          variant="outline"
                          className="border-2 border-primary hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <a href={project.link || project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            VIEW LIVE
                          </a>
                        </Button>
                      )}
                      {project.github && (
                        <Button 
                          variant="outline"
                          className="border-2 border-primary hover:bg-primary hover:text-primary-foreground"
                          asChild
                        >
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" />
                            SOURCE
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
