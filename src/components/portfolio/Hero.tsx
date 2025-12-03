import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Github, Linkedin, ExternalLink, Save, X } from "lucide-react";

interface HeroProps {
  name?: string;
  title?: string;
  tagline?: string;
  bio?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  resumeUrl?: string;
  isEditing?: boolean;
  onUpdate?: (data: { name?: string; title?: string; tagline?: string; bio?: string; email?: string; github?: string; linkedin?: string; resumeUrl?: string; }) => void;
}

const Hero = ({
  name = "",
  title = "Your Title",
  tagline = "Building Innovative Solutions with Modern Technologies",
  bio = "Your bio here",
  email,
  github,
  linkedin,
  resumeUrl,
  isEditing = false,
  onUpdate
}: HeroProps) => {
  const [editData, setEditData] = useState({
    name,
    title,
    tagline,
    bio,
    email,
    github,
    linkedin,
    resumeUrl
  });

  const handleSave = () => {
    try {
      if (onUpdate) {
        onUpdate(editData);
      }
    } catch (error) {
      console.error('Failed to save hero data:', error);
    }
  };

  const handleCancel = () => {
    try {
      setEditData({
        name,
        title,
        tagline,
        bio,
        email,
        github,
        linkedin,
        resumeUrl
      });
    } catch (error) {
      console.error('Failed to cancel hero edit:', error);
    }
  };
  return (
    <section className="min-h-screen flex items-center justify-center bg-background border-b-4 border-primary">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="text-center text-4xl font-bold"
                  />
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editData.title}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                    className="text-center"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={editData.tagline}
                    onChange={(e) => setEditData({...editData, tagline: e.target.value})}
                    className="text-center"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="text-center"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={editData.github}
                      onChange={(e) => setEditData({...editData, github: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={editData.linkedin}
                      onChange={(e) => setEditData({...editData, linkedin: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resumeUrl">Resume URL</Label>
                    <Input
                      id="resumeUrl"
                      value={editData.resumeUrl}
                      onChange={(e) => setEditData({...editData, resumeUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="inline-block mb-6 px-6 py-2 border-2 border-primary bg-secondary">
                <span className="font-mono text-sm">{title.toUpperCase()}</span>
              </div>

              {name && (
                <h1 className="text-6xl md:text-8xl font-bold mb-6">
                  {name}
                </h1>
              )}

              {tagline && (
                <p className="text-xl md:text-2xl mb-8 text-muted-foreground font-mono">
                  {tagline}
                </p>
              )}



              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {email && (
                  <Button
                    size="lg"
                    className="border-2 border-primary bg-primary hover:bg-foreground hover:text-background shadow-sm"
                    onClick={() => window.location.href = `mailto:${email}`}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    GET IN TOUCH
                  </Button>
                )}

                {resumeUrl && (resumeUrl.startsWith('https://') || resumeUrl.startsWith('/')) && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => window.open(resumeUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    RESUME
                  </Button>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                {github && github.startsWith('https://github.com/') && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                )}
                {linkedin && linkedin.startsWith('https://linkedin.com/') && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
