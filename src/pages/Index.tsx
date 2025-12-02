import { Button } from "@/components/ui/button";
import { ArrowRight, FileUp, Sparkles, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import ResumeUpload from "@/components/ResumeUpload";
import heroBg from "@/assets/hero-bg.jpg";
import productDemo from "@/assets/product-demo.jpg";

const Index = () => {

  return (
    <div className="min-h-screen bg-background">


      {/* Top Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-4">
        <Button 
          asChild
          variant="outline"
          className="border-2 border-primary bg-background/80 backdrop-blur-sm"
        >
          <Link to="/dashboard">
            📊 DASHBOARD
          </Link>
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4)'
          }}
        />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-6 py-2 border-2 border-primary bg-background">
              <span className="font-mono text-sm">PORTFOLIO GENERATOR</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-primary-foreground">
              YOUR RESUME.<br />
              YOUR SITE.<br />
              ONE UPLOAD.
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-primary-foreground font-mono max-w-2xl mx-auto">
              Transform your resume into a stunning portfolio website in seconds. 
              No code. No design skills. Just upload and publish.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                asChild
                className="text-lg px-8 py-6 border-2 border-primary bg-primary hover:bg-primary-foreground hover:text-primary transition-all shadow-md"
              >
                <a href="#upload">
                  <FileUp className="mr-2 h-5 w-5" />
                  UPLOAD RESUME
                </a>
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-6 border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all"
              >
                <Link to="/portfolio/demo">
                  VIEW DEMO
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-primary-foreground font-mono text-sm">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI-POWERED
              </span>
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                INSTANT DEPLOY
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 border-4 border-primary inline-block px-8 py-4 mx-auto block w-fit">
            HOW IT WORKS
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "UPLOAD",
                desc: "Drop your resume (PDF or DOCX). Our AI instantly parses your experience, skills, and projects."
              },
              {
                step: "02",
                title: "CUSTOMIZE",
                desc: "Edit any section inline. Add project screenshots, tweak colors, adjust layouts."
              },
              {
                step: "03",
                title: "PUBLISH",
                desc: "One click to deploy. Get your own subdomain or connect a custom domain."
              }
            ].map((item) => (
              <div key={item.step} className="border-4 border-primary bg-background p-8 shadow-lg">
                <div className="text-6xl font-bold font-mono mb-4 text-muted-foreground">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold mb-6 border-4 border-primary inline-block px-8 py-4">
                SEE IT IN ACTION
              </h2>
              <p className="text-xl text-muted-foreground font-mono">
                Professional portfolios in minutes, not days
              </p>
            </div>
            
            <div className="border-4 border-primary bg-secondary p-8 shadow-2xl">
              <img 
                src={productDemo} 
                alt="Portfolio Builder Demo"
                className="w-full border-2 border-primary"
              />
            </div>
            
            <div className="text-center mt-12">
              <Button 
                size="lg"
                asChild
                className="text-lg px-12 py-6 border-2 border-primary bg-primary hover:bg-foreground hover:text-background transition-all shadow-md"
              >
                <Link to="/portfolio/demo">
                  EXPLORE DEMO SITE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16 border-4 border-primary inline-block px-8 py-4 mx-auto block w-fit">
            FEATURES
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              "AI Resume Parsing",
              "Drag & Drop Sections",
              "Mobile Responsive",
              "Custom Domains",
              "SEO Optimized",
              "One-Click Deploy",
              "Real-time Preview",
              "Auto-save & Versioning"
            ].map((feature) => (
              <div key={feature} className="border-4 border-primary bg-background p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg font-mono">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <ResumeUpload />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8">
            READY TO STAND OUT?
          </h2>
          <p className="text-xl md:text-2xl mb-12 font-mono max-w-2xl mx-auto">
            Join thousands of job seekers who landed their dream role with a professional portfolio.
          </p>
          <Button
            size="lg"
            asChild
            className="text-lg px-12 py-6 border-2 border-primary-foreground bg-primary-foreground text-primary hover:bg-transparent hover:text-primary-foreground transition-all shadow-lg"
          >
            <a href="#upload">
              <FileUp className="mr-2 h-5 w-5" />
              GET STARTED FREE
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
