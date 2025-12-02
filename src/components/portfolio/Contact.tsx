import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Linkedin, Github, ExternalLink, Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContactProps {
  contact?: {
    email?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    location?: string;
    resumeUrl?: string;
    name?: string;
  };
  isEditing?: boolean;
  onUpdate?: (contact: any) => void;
}

const Contact = ({
  contact = {},
  isEditing = false,
  onUpdate
}: ContactProps = {}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [editData, setEditData] = useState(contact);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast({
        title: "Message sent!",
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    try {
      if (onUpdate) {
        onUpdate(editData);
      }
    } catch (error) {
      console.error('Failed to save contact data:', error);
    }
  };

  const handleCancel = () => {
    try {
      setEditData(contact);
    } catch (error) {
      console.error('Failed to cancel contact edit:', error);
    }
  };

  const currentData = isEditing ? editData : contact;

  return (
    <section id="contact" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-12">
            <h2 className="text-5xl font-bold border-4 border-primary inline-block px-8 py-4">
              CONTACT
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="border-4 border-primary bg-background p-8">
              <h3 className="text-2xl font-bold mb-6">GET IN TOUCH</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-mono text-sm mb-2">NAME</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-2 border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-mono text-sm mb-2">EMAIL</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-2 border-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block font-mono text-sm mb-2">MESSAGE</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-2 border-primary min-h-[150px]"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full border-2 border-primary bg-primary hover:bg-foreground hover:text-background"
                >
                  SEND MESSAGE
                </Button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="border-4 border-primary bg-background p-8">
                <h3 className="text-2xl font-bold mb-6">CONNECT</h3>

                <div className="space-y-4">
                  {currentData.email && (
                    <a
                      href={`mailto:${currentData.email}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{currentData.email}</span>
                    </a>
                  )}

                  {currentData.linkedin && (
                    <a
                      href={currentData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}

                  {currentData.github && (
                    <a
                      href={currentData.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub Profile</span>
                    </a>
                  )}

                  {currentData.website && (
                    <a
                      href={currentData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                      <span>Personal Website</span>
                    </a>
                  )}
                </div>
              </div>

              {currentData.location && (
                <div className="border-4 border-primary bg-background p-8">
                  <h3 className="text-2xl font-bold mb-6">LOCATION</h3>
                  <p className="font-mono">{currentData.location}</p>
                  <p className="text-muted-foreground mt-2">
                    Open to remote opportunities
                  </p>
                </div>
              )}

              <div className="border-4 border-primary bg-primary text-primary-foreground p-8">
                <h3 className="text-2xl font-bold mb-4">AVAILABILITY</h3>
                <p className="mb-4">
                  Currently open to new opportunities and freelance projects.
                </p>
                {currentData.resumeUrl && (
                  <Button
                    variant="outline"
                    className="border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    onClick={() => window.open(currentData.resumeUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    DOWNLOAD RESUME
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-16 pt-8 border-t-4 border-primary text-center">
        <p className="font-mono text-sm text-muted-foreground">
          © 2024 {currentData.name || "Portfolio"}. BUILT WITH PORTFOLIO GENERATOR.
        </p>
      </div>
    </section>
  );
};

export default Contact;
