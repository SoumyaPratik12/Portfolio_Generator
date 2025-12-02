import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface ExperienceItem {
  title?: string;
  company: string;
  role?: string;
  location: string;
  period?: string;
  duration?: string;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
}

interface ExperienceProps {
  experience?: ExperienceItem[];
  isEditing?: boolean;
  onUpdate?: (experience: ExperienceItem[]) => void;
}

const Experience = ({
  experience = [
    {
      company: "Sample Company",
      role: "Developer",
      location: "Remote",
      period: "2024 - Present",
      responsibilities: [
        "Sample responsibility 1",
        "Sample responsibility 2"
      ]
    }
  ],
  isEditing = false,
  onUpdate
}: ExperienceProps) => {
  const [displayExperience, setDisplayExperience] = useState<ExperienceItem[]>(experience || []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    try {
      setDisplayExperience(experience || []);
      // Check if slider should be shown after content updates
      setTimeout(() => {
        if (scrollRef.current) {
          const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
          setShowSlider(maxScroll > 0);
        }
      }, 100);
    } catch (error) {
      console.error('Failed to update experience:', error);
      setDisplayExperience([]);
    }
  }, [experience, displayExperience.length]);

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

  const handleAddExperience = () => {
    const newExperience = {
      company: "",
      role: "",
      location: "",
      period: "",
      responsibilities: [""]
    };
    const updated = [...displayExperience, newExperience];
    setDisplayExperience(updated);
    onUpdate?.(updated);
  };

  const handleRemoveExperience = (index: number) => {
    const updated = displayExperience.filter((_, i) => i !== index);
    setDisplayExperience(updated);
    onUpdate?.(updated);
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, value: string | string[]) => {
    if (field === 'responsibilities' && typeof value === 'string') {
      console.warn('Cannot update responsibilities field with string value');
      return;
    }
    if (index < 0 || index >= displayExperience.length) {
      console.error('Invalid experience index');
      return;
    }
    const updated = displayExperience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setDisplayExperience(updated);
    onUpdate?.(updated);
  };

  const handleAddResponsibility = (expIndex: number) => {
    const updated = displayExperience.map((exp, i) =>
      i === expIndex
        ? { ...exp, responsibilities: [...(exp.responsibilities || []), ""] }
        : exp
    );
    setDisplayExperience(updated);
    onUpdate?.(updated);
  };

  const handleRemoveResponsibility = (expIndex: number, respIndex: number) => {
    const updated = displayExperience.map((exp, i) =>
      i === expIndex
        ? { ...exp, responsibilities: (exp.responsibilities || []).filter((_, j) => j !== respIndex) }
        : exp
    );
    setDisplayExperience(updated);
    onUpdate?.(updated);
  };

  const handleUpdateResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const updated = displayExperience.map((exp, i) =>
      i === expIndex
        ? {
            ...exp,
            responsibilities: (exp.responsibilities || []).map((resp, j) =>
              j === respIndex ? value : resp
            )
          }
        : exp
    );
    setDisplayExperience(updated);
    onUpdate?.(updated);
  };

  return (
    <section id="experience" className="py-24 bg-background">
      <div className="w-full px-4 flex justify-center">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-5xl font-bold border-4 border-primary inline-block px-8 py-4">
              EXPERIENCE
            </h2>
            {isEditing && (
              <Button onClick={handleAddExperience} variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            )}
          </div>

          <div className="w-full max-w-[1100px] mx-auto px-4 pb-9">
            <div 
              ref={scrollRef}
              className="flex gap-7 items-stretch overflow-x-auto overflow-y-visible py-4 px-1"
              style={{ 
                scrollBehavior: 'smooth',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.08) transparent'
              }}
              onScroll={(e) => {
                const element = e.currentTarget;
                const maxScroll = element.scrollWidth - element.clientWidth;
                if (maxScroll > 0) {
                  const scrollPercent = (element.scrollLeft / maxScroll) * 100;
                  setScrollPosition(scrollPercent);
                }
                setShowSlider(maxScroll > 0);
              }}
              tabIndex={0}
            >
              {displayExperience.map((exp, index) => (
                <div key={index} className="flex-none w-[calc(50%-14px)] min-w-[380px] border-4 border-primary bg-background p-7 text-center relative">
                  {isEditing && (
                    <Button
                      onClick={() => handleRemoveExperience(index)}
                      variant="outline"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="mb-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base">Role</Label>
                          <Input
                            value={exp.role || ""}
                            onChange={(e) => handleUpdateExperience(index, 'role', e.target.value)}
                            placeholder="Job Title"
                            className="text-base"
                          />
                        </div>
                        <div>
                          <Label className="text-base">Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                            placeholder="Company Name"
                            className="text-base"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold mb-2">{exp.title || exp.role}</h3>
                        <div className="text-lg font-semibold text-primary mb-2">{exp.company}</div>
                      </>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base">Period</Label>
                          <Input
                            value={exp.period || ""}
                            onChange={(e) => handleUpdateExperience(index, 'period', e.target.value)}
                            placeholder="2024 - Present"
                            className="text-base"
                          />
                        </div>
                        <div>
                          <Label className="text-base">Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => handleUpdateExperience(index, 'location', e.target.value)}
                            placeholder="Location"
                            className="text-base"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm text-muted-foreground mb-1">
                          {exp.duration || exp.period}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {exp.location}
                        </div>
                      </>
                    )}
                  </div>

                  {exp.description && !isEditing && (
                    <div className="mb-4">
                      <p className="text-sm leading-relaxed text-gray-700">{exp.description}</p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="text-base font-semibold">
                      {exp.achievements ? 'Key Achievements' : 'Responsibilities'}
                    </div>
                    {(exp.achievements || exp.responsibilities || []).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-2 text-left">
                        <span className="inline-block w-1.5 h-1.5 bg-primary mt-2 flex-shrink-0 rounded-full" />
                        {isEditing ? (
                          <div className="flex-1 flex items-start gap-2">
                            <Textarea
                              value={item}
                              onChange={(e) => handleUpdateResponsibility(index, itemIndex, e.target.value)}
                              placeholder="Describe responsibility or achievement"
                              className="min-h-[60px] text-sm leading-relaxed"
                            />
                            <Button
                              onClick={() => handleRemoveResponsibility(index, itemIndex)}
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm leading-relaxed flex-1">{item}</span>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        onClick={() => handleAddResponsibility(index)}
                        variant="outline"
                        size="sm"
                        className="mt-4"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {showSlider && (
              <div className="flex justify-center mt-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scrollPosition}
                  onChange={(e) => {
                    if (scrollRef.current) {
                      const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                      scrollRef.current.scrollLeft = (Number(e.target.value) / 100) * maxScroll;
                    }
                  }}
                  className="w-2/5 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${scrollPosition}%, #e5e7eb ${scrollPosition}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;