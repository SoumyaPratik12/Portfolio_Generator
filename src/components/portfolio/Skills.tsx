import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, X, Plus, Trash2 } from "lucide-react";

interface Skill {
  name: string;
  category: string;
}

interface SkillsProps {
  skills?: Skill[];
  isEditing?: boolean;
  onUpdate?: (skills: Skill[]) => void;
}

const Skills = ({
  skills = [
    { name: "React", category: "Frontend" },
    { name: "TypeScript", category: "Frontend" },
    { name: "JavaScript", category: "Frontend" },
    { name: "Node.js", category: "Backend" },
    { name: "Python", category: "Backend" },
    { name: "PostgreSQL", category: "Database" }
  ],
  isEditing = false,
  onUpdate
}: SkillsProps) => {
  const [editData, setEditData] = useState(skills);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (scrollRef.current && !isEditing) {
        if (e.key === 'ArrowLeft') {
          scrollRef.current.scrollLeft -= 200;
        } else if (e.key === 'ArrowRight') {
          scrollRef.current.scrollLeft += 200;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  const handleSave = () => {
    try {
      if (onUpdate) {
        onUpdate(editData);
      }
    } catch (error) {
      console.error('Failed to save skills:', error);
    }
  };

  const handleCancel = () => {
    setEditData(skills);
  };

  const addSkill = () => {
    try {
      setEditData([...editData, { name: "", category: "" }]);
    } catch (error) {
      console.error('Failed to add skill:', error);
    }
  };

  const removeSkill = (index: number) => {
    try {
      setEditData(editData.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Failed to remove skill:', error);
    }
  };

  const updateSkill = (index: number, field: 'name' | 'category', value: string) => {
    try {
      if (index < 0 || index >= editData.length) {
        console.error('Invalid skill index:', index);
        return;
      }
      const updated = [...editData];
      updated[index] = { ...updated[index], [field]: value };
      setEditData(updated);
    } catch (error) {
      console.error('Failed to update skill:', error);
    }
  };

  const skillCategories = [
    {
      title: "Frontend",
      languages: ["JavaScript", "TypeScript", "HTML", "CSS"],
      frameworks: ["React", "Vue.js", "Angular", "Next.js"]
    },
    {
      title: "Backend", 
      languages: ["Python", "Java", "Node.js", "C#"],
      frameworks: ["Django", "Spring", "Express", "FastAPI"]
    },
    {
      title: "Database",
      sql: ["PostgreSQL", "MySQL", "SQL Server"],
      nosql: ["MongoDB", "Redis", "Cassandra"]
    },
    {
      title: "Cloud & DevOps",
      platforms: ["AWS", "Azure", "GCP"],
      tools: ["Docker", "Kubernetes", "Jenkins", "Terraform"]
    },
    {
      title: "Finance & Analytics",
      tools: ["Excel", "Power BI", "Tableau", "R"],
      skills: ["Financial Modeling", "Risk Analysis", "Data Visualization"]
    },
    {
      title: "Engineering",
      cad: ["AutoCAD", "SolidWorks", "MATLAB"],
      automation: ["PLC", "SCADA", "LabVIEW"]
    }
  ];

  return (
    <section id="skills" className="py-24 bg-background">
      <div className="w-full px-4 flex justify-center">
        <div className="w-full">
          <div className="flex justify-center mb-12">
            <h2 className="text-5xl font-bold border-4 border-primary inline-block px-8 py-4">
              SKILLS
            </h2>
          </div>

          {isEditing ? (
            <div className="space-y-6">
              <div className="flex justify-center gap-2 mb-6">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={addSkill} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Skill
                </Button>
              </div>

              <div className="space-y-4">
                {editData.map((skill, index) => (
                  <div key={index} className="flex gap-4 items-center p-4 border border-border rounded">
                    <div className="flex-1">
                      <Label htmlFor={`skill-name-${index}`}>Skill Name</Label>
                      <Input
                        id={`skill-name-${index}`}
                        value={skill.name}
                        onChange={(e) => updateSkill(index, 'name', e.target.value)}
                        placeholder="e.g., React"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`skill-category-${index}`}>Category</Label>
                      <Input
                        id={`skill-category-${index}`}
                        value={skill.category}
                        onChange={(e) => updateSkill(index, 'category', e.target.value)}
                        placeholder="e.g., Frontend"
                      />
                    </div>
                    <Button
                      onClick={() => removeSkill(index)}
                      variant="outline"
                      size="icon"
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[1100px] mx-auto">
              <div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 justify-items-center">
                {skillCategories.map((category, index) => (
                  <div key={index} className="w-full min-w-[260px] max-w-[360px] border-3 border-primary bg-background p-6 rounded-md shadow-sm flex flex-col text-left">
                    <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                    <div className="space-y-4">
                      {Object.entries(category).filter(([key]) => key !== 'title').map(([key, items]) => (
                        <div key={key}>
                          <div className="text-sm text-muted-foreground mb-2 capitalize">{key}:</div>
                          <div className="flex flex-wrap gap-2">
                            {items.map((item: string) => (
                              <span
                                key={item}
                                className="inline-block px-3 py-1.5 text-sm border-2 border-primary rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;