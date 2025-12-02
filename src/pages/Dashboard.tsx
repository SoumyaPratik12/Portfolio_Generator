import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Eye, Globe, Edit, Trash2, Upload, ExternalLink } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = () => {
      try {
        const localPortfolio = localStorage.getItem('current_portfolio');
        console.log('Loading portfolio from localStorage:', localPortfolio);
        if (localPortfolio) {
          const data = JSON.parse(localPortfolio);
          console.log('Parsed portfolio data:', data);
          setPortfolio(data);
          toast.success('Portfolio data loaded successfully!');
        } else {
          console.log('No portfolio found in localStorage');
          setPortfolio(null);
        }
      } catch (error) {
        console.error('Error loading portfolio:', error);
        toast.error('Failed to load portfolio data');
        setPortfolio(null);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
    
    // Also listen for storage events from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'current_portfolio') {
        loadPortfolio();
      }
    };
    
    // Listen for custom portfolio update events
    const handlePortfolioUpdate = (e: CustomEvent) => {
      console.log('Portfolio updated event received:', e.detail);
      setPortfolio(e.detail);
      setLoading(false);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('portfolioUpdated', handlePortfolioUpdate as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('portfolioUpdated', handlePortfolioUpdate as EventListener);
    };
  }, []);

  // Reload data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const localPortfolio = localStorage.getItem('current_portfolio');
        if (localPortfolio) {
          const data = JSON.parse(localPortfolio);
          setPortfolio(data);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleDeletePortfolio = () => {
    try {
      localStorage.removeItem('current_portfolio');
      setPortfolio(null);
      toast.success("Portfolio deleted successfully");
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast.error("Failed to delete portfolio");
    }
  };

  const handleDeploy = () => {
    try {
      if (!portfolio) return;
      
      const updatedPortfolio = {
        ...portfolio,
        status: 'published',
        visibility: 'public',
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem('current_portfolio', JSON.stringify(updatedPortfolio));
      setPortfolio(updatedPortfolio);
      
      const liveUrl = `https://${portfolio.subdomain}.portfoliogen.app`;
      toast.success(`Portfolio deployed successfully! Live at: ${liveUrl}`);
      
      setTimeout(() => {
        window.open(liveUrl, '_blank');
      }, 1000);
    } catch (error) {
      console.error('Deploy error:', error);
      toast.error("Failed to deploy portfolio");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio and deployment
          </p>
        </div>

        {!portfolio ? (
          <Card>
            <CardHeader>
              <CardTitle>No Portfolio Found</CardTitle>
              <CardDescription>
                You haven't created a portfolio yet. Upload your resume to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {/* Portfolio Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Portfolio</span>
                  <span className={`px-3 py-1 text-xs font-mono rounded-full ${
                    portfolio?.status === 'published' 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  }`}>
                    {portfolio?.status === 'published' ? '🟢 LIVE' : '🟡 DRAFT'}
                  </span>
                </CardTitle>
                <CardDescription>
                  {portfolio?.subdomain || 'portfolio'}.portfoliogen.app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Portfolio Details</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Name:</strong> {portfolio?.portfolio_data?.name || 'Not set'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Title:</strong> {portfolio?.portfolio_data?.title || 'Not set'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Last Updated:</strong> {portfolio?.updated_at ? new Date(portfolio.updated_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Quick Stats</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Skills:</strong> {portfolio?.portfolio_data?.skills?.length || 0} skills
                    </p>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Experience:</strong> {portfolio?.portfolio_data?.experience?.length || 0} positions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Projects:</strong> {portfolio?.portfolio_data?.projects?.length || 0} projects
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => navigate("/preview")}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Portfolio
                  </Button>
                  
                  <Button
                    onClick={() => navigate("/preview")}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Portfolio
                  </Button>

                  {portfolio.status === 'published' ? (
                    <Button
                      onClick={() => window.open(`https://${portfolio.subdomain}.portfoliogen.app`, '_blank')}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Live Site
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDeploy}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Globe className="h-4 w-4" />
                      Deploy Live
                    </Button>
                  )}

                  <Button
                    onClick={handleDeletePortfolio}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks for managing your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2 w-full max-w-md"
                >
                  <Upload className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">Upload New Resume</div>
                    <div className="text-sm text-muted-foreground">Replace current portfolio with new resume</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;