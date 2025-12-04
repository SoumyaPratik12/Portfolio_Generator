import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";

interface AboutProps {
  // parsed summary from resume (should be profile.summary or profile.parsed.summary)
  about?: string | null;
  isEditing?: boolean;
  // only about updated now (no stats)
  onUpdate?: (data: { about: string }) => void;
}

const About = ({
  about = null,
  isEditing = false,
  onUpdate
}: AboutProps) => {
  // keep internal state and sync if prop changes (important after parser updates DB)
  const [editAbout, setEditAbout] = useState<string>(about ?? "");

  useEffect(() => {
    console.log('About component received about prop:', about);
    setEditAbout(about ?? "");
  }, [about]);

  const handleSave = () => {
    try {
      if (onUpdate) {
        onUpdate({ about: editAbout.trim() });
      }
    } catch (error) {
      console.error('Failed to save about data:', error);
    }
  };

  const handleCancel = () => {
    setEditAbout(about ?? "");
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

              <div>
                <Textarea
                  id="about"
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          ) : (
            <>
              {/* Render the parsed about/summary only. If none, show a subtle CTA instead of placeholder text */}
              <div className="space-y-6 text-lg">
                {about ? (
                  <p className="whitespace-pre-line">{about}</p>
                ) : (
                  <p className="text-muted-foreground">
                    No summary found — upload a resume or click Edit to add your summary.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
