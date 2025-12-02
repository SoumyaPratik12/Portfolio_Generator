import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";

interface AboutProps {
  about?: string;
  stats?: {
    yearsExperience?: number;
    projectsCompleted?: number;
    usersImpacted?: string;
  };
  isEditing?: boolean;
  onUpdate?: (data: { about: string; stats: { yearsExperience: number; projectsCompleted: number; usersImpacted: string; } }) => void;
}

const About = ({
  about = "Tell us about yourself...",
  stats = { yearsExperience: 0, projectsCompleted: 0, usersImpacted: "0" },
  isEditing = false,
  onUpdate
}: AboutProps) => {
  const [editData, setEditData] = useState({
    about,
    stats: {
      yearsExperience: stats.yearsExperience || 0,
      projectsCompleted: stats.projectsCompleted || 0,
      usersImpacted: stats.usersImpacted || "0"
    }
  });

  const handleSave = () => {
    try {
      if (onUpdate) {
        onUpdate(editData);
      }
    } catch (error) {
      console.error('Failed to save about data:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      about,
      stats: {
        yearsExperience: stats.yearsExperience || 0,
        projectsCompleted: stats.projectsCompleted || 0,
        usersImpacted: stats.usersImpacted || "0"
      }
    });
  };
  return (
    <section id="about" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-12">
            <h2 className="text-5xl font-bold border-4 border-primary inline-block px-8 py-4">
              ABOUT
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
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    value={editData.about}
                    onChange={(e) => setEditData({...editData, about: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="yearsExperience">Years Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      value={editData.stats.yearsExperience}
                      onChange={(e) => setEditData({...editData, stats: {...editData.stats, yearsExperience: parseInt(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectsCompleted">Projects Completed</Label>
                    <Input
                      id="projectsCompleted"
                      type="number"
                      value={editData.stats.projectsCompleted}
                      onChange={(e) => setEditData({...editData, stats: {...editData.stats, projectsCompleted: parseInt(e.target.value) || 0}})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="usersImpacted">Users Impacted</Label>
                    <Input
                      id="usersImpacted"
                      value={editData.stats.usersImpacted}
                      onChange={(e) => setEditData({...editData, stats: {...editData.stats, usersImpacted: e.target.value}})}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6 text-lg">
                <p>{about}</p>
              </div>

              <div className="mt-12 grid md:grid-cols-3 gap-8">
                <div className="border-4 border-primary p-6 bg-background">
                  <div className="text-4xl font-bold font-mono mb-2">{stats.yearsExperience}+</div>
                  <div className="text-muted-foreground">Years Experience</div>
                </div>
                <div className="border-4 border-primary p-6 bg-background">
                  <div className="text-4xl font-bold font-mono mb-2">{stats.projectsCompleted}+</div>
                  <div className="text-muted-foreground">Projects Completed</div>
                </div>
                <div className="border-4 border-primary p-6 bg-background">
                  <div className="text-4xl font-bold font-mono mb-2">{stats.usersImpacted}</div>
                  <div className="text-muted-foreground">Users Impacted</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
