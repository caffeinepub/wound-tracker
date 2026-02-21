import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Maximize2, Circle, Droplet, Scissors, Grid3x3 } from 'lucide-react';
import MetricDisplay from './MetricDisplay';
import ColorCompositionDisplay from './ColorCompositionDisplay';
import type { WoundAnalysisResult } from '../types/wound';
import { useMeasureWound } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

interface ResultsDashboardProps {
  result: WoundAnalysisResult;
  onNewAnalysis: () => void;
}

export default function ResultsDashboard({ result, onNewAnalysis }: ResultsDashboardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const measureWound = useMeasureWound();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const id = `wound-${Date.now()}`;
      // Create a proper Uint8Array<ArrayBuffer> for ExternalBlob
      const bytes = new Uint8Array(result.imageBlob.buffer) as Uint8Array<ArrayBuffer>;
      const imageBlob = ExternalBlob.fromBytes(bytes);
      
      await measureWound.mutateAsync({
        id,
        image: imageBlob,
        area: result.area,
        perimeter: result.perimeter,
        circularity: result.circularity,
        textureSmoothness: result.textureSmoothness,
        edgeSharpness: result.edgeSharpness,
        exudateLevel: result.exudateLevel,
        redPercentage: result.redPercentage,
        pinkPercentage: result.pinkPercentage,
        yellowPercentage: result.yellowPercentage,
        blackPercentage: result.blackPercentage
      });
      
      toast.success('Measurement saved successfully');
    } catch (error) {
      toast.error('Failed to save measurement');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getAreaStatus = () => {
    if (result.area < 500) return 'good';
    if (result.area < 1500) return 'warning';
    return 'concern';
  };

  const getCircularityStatus = () => {
    if (result.circularity > 0.7) return 'good';
    if (result.circularity > 0.4) return 'warning';
    return 'concern';
  };

  const getTextureStatus = () => {
    if (result.textureSmoothness > 0.6) return 'good';
    if (result.textureSmoothness > 0.3) return 'warning';
    return 'concern';
  };

  const getEdgeStatus = () => {
    if (result.edgeSharpness > 0.6) return 'good';
    if (result.edgeSharpness > 0.3) return 'warning';
    return 'concern';
  };

  const getMoistureStatus = () => {
    if (result.exudateLevel < 0.3) return 'good';
    if (result.exudateLevel < 0.6) return 'warning';
    return 'concern';
  };

  return (
    <>
      <Toaster />
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onNewAnalysis}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save to History
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Wound Image</CardTitle>
            <CardDescription>Analyzed wound photograph</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={result.imageUrl}
              alt="Analyzed wound"
              className="w-full max-w-2xl mx-auto rounded-lg border"
            />
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <ColorCompositionDisplay
            red={result.redPercentage}
            pink={result.pinkPercentage}
            yellow={result.yellowPercentage}
            black={result.blackPercentage}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricDisplay
              label="Wound Area"
              value={`${result.area.toFixed(0)} px²`}
              interpretation="Decreasing area indicates good healing progress"
              status={getAreaStatus()}
              icon={<Maximize2 className="w-4 h-4" />}
            />

            <MetricDisplay
              label="Perimeter"
              value={`${result.perimeter.toFixed(0)} px`}
              interpretation="Smooth, smaller perimeter suggests healing"
              status={result.perimeter < 200 ? 'good' : 'warning'}
              icon={<Circle className="w-4 h-4" />}
            />

            <MetricDisplay
              label="Shape Regularity"
              value={`${(result.circularity * 100).toFixed(1)}%`}
              interpretation="Higher circularity indicates better wound contraction"
              status={getCircularityStatus()}
              icon={<Circle className="w-4 h-4" />}
            />

            <MetricDisplay
              label="Texture Smoothness"
              value={`${(result.textureSmoothness * 100).toFixed(1)}%`}
              interpretation="Smooth texture indicates tissue recovery"
              status={getTextureStatus()}
              icon={<Grid3x3 className="w-4 h-4" />}
            />

            <MetricDisplay
              label="Edge Sharpness"
              value={`${(result.edgeSharpness * 100).toFixed(1)}%`}
              interpretation="Sharp edges indicate stabilized healing"
              status={getEdgeStatus()}
              icon={<Scissors className="w-4 h-4" />}
            />

            <MetricDisplay
              label="Exudate Level"
              value={`${(result.exudateLevel * 100).toFixed(1)}%`}
              interpretation="Lower moisture levels indicate better healing"
              status={getMoistureStatus()}
              icon={<Droplet className="w-4 h-4" />}
            />
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Overall Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {result.redPercentage + result.pinkPercentage > result.yellowPercentage + result.blackPercentage
                ? '✅ The wound shows positive signs of healing with good color composition. Continue monitoring progress.'
                : '⚠️ The wound shows concerning tissue composition. Consider consulting a healthcare professional for proper wound care management.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
