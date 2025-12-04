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

  // Sync with props when skills change
  useEffect(() => {
    setEditData(skills);
  }, [skills]);

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

  // Group skills by category from parsed resume data
  const groupedSkills = editData.reduce((acc, skill) => {
    if (!skill.name || !skill.category) return acc;
    
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  const skillCategories = Object.entries(groupedSkills).map(([category, skills]) => ({
    title: category,
    skills: skills
  }));

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
              {skillCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                  {skillCategories.map((category, index) => (
                    <div key={index} className="w-full min-w-[260px] max-w-[360px] border-3 border-primary bg-background p-6 rounded-md shadow-sm flex flex-col text-left">
                      <h3 className="text-xl font-bold mb-4">{category.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="inline-block px-3 py-1.5 text-sm border-2 border-primary rounded-full bg-transparent hover:bg-primary hover:text-primary-foreground transition-all whitespace-nowrap"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No skills found. Upload a resume to display your skills.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;