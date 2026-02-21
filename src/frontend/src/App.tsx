import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, History, Info } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import ResultsDashboard from './components/ResultsDashboard';
import WoundHistory from './components/WoundHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WoundAnalysisResult } from './types/wound';

function App() {
  const [analysisResult, setAnalysisResult] = useState<WoundAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState('analyze');

  const handleAnalysisComplete = (result: WoundAnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">Wound Tracker</h1>
                <p className="text-sm text-muted-foreground">Clinical Wound Assessment System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="analyze" className="gap-2">
              <Activity className="w-4 h-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2">
              <Info className="w-4 h-4" />
              Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            {!analysisResult ? (
              <ImageUpload onAnalysisComplete={handleAnalysisComplete} />
            ) : (
              <ResultsDashboard result={analysisResult} onNewAnalysis={handleNewAnalysis} />
            )}
          </TabsContent>

          <TabsContent value="history">
            <WoundHistory />
          </TabsContent>

          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Wound Assessment</CardTitle>
                <CardDescription>Clinical interpretation guide for wound healing metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">📏 Wound Area</h3>
                      <p className="text-sm text-muted-foreground">
                        Measures total wound size. Decreasing area indicates good healing, while increasing area may suggest delayed healing or infection.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">⭕ Perimeter & Smoothness</h3>
                      <p className="text-sm text-muted-foreground">
                        Smooth, smaller perimeter indicates healing. Large or irregular perimeter suggests inflammation.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">🔵 Shape Regularity</h3>
                      <p className="text-sm text-muted-foreground">
                        High circularity indicates better contraction. Irregular shape may indicate tissue damage or slow healing.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">🎨 Color Composition (Critical)</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        The most important metric for assessing wound healing:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li className="text-medical-red">🔴 Red: Healthy granulation tissue (good healing)</li>
                        <li className="text-medical-pink">🩷 Pink: Epithelialization (new skin formation)</li>
                        <li className="text-medical-yellow">🟡 Yellow: Slough/dead tissue (slow healing)</li>
                        <li className="text-medical-black">⚫ Black: Necrosis (severe damage)</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">🔬 Texture Smoothness</h3>
                      <p className="text-sm text-muted-foreground">
                        Smooth texture indicates tissue recovery. Rough texture may suggest ongoing inflammation.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">✂️ Edge Sharpness</h3>
                      <p className="text-sm text-muted-foreground">
                        Sharp edges indicate stabilized healing. Fuzzy edges suggest active inflammation.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">💧 Exudate/Moisture</h3>
                      <p className="text-sm text-muted-foreground">
                        Detects shiny or fluid regions. Too wet or glossy indicates risk of poor healing.
                      </p>
                    </div>
                    <div className="mt-6">
                      <img 
                        src="/assets/generated/wound-reference.dim_400x300.png" 
                        alt="Wound reference guide"
                        className="w-full rounded-lg border shadow-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-2 text-center">Reference guide for wound assessment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-16 py-6 bg-card/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Wound Tracker. Built with ❤️ using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
