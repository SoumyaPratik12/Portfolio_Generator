import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Smartphone, Tablet, ExternalLink, Eye, EyeOff } from "lucide-react";

interface PortfolioPreviewProps {
  portfolioData: any;
  isVisible: boolean;
  onToggle: () => void;
}

const PortfolioPreview = ({ portfolioData, isVisible, onToggle }: PortfolioPreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isVisible) return null;

  const getPreviewSize = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      default:
        return 'w-full h-[800px]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Portfolio Preview</h3>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button variant="outline" size="sm" onClick={onToggle}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="flex-1 p-4 bg-gray-100">
          <div className="flex justify-center h-full">
            <div className={`${getPreviewSize()} bg-white shadow-2xl rounded-lg overflow-hidden`}>
              <iframe
                src={`/portfolio/preview-${Date.now()}`}
                className="w-full h-full border-0"
                title="Portfolio Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioPreview;