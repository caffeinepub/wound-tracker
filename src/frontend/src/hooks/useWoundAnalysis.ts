import { useState } from 'react';
import type { WoundAnalysisResult } from '../types/wound';
import { analyzeWoundMetrics } from '../utils/woundAnalysis';
import { analyzeColorComposition } from '../utils/colorAnalysis';
import { analyzeTexture } from '../utils/textureAnalysis';
import { analyzeEdgeSharpness } from '../utils/edgeAnalysis';
import { analyzeMoisture } from '../utils/moistureAnalysis';

export function useWoundAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = async (
    imageUrl: string,
    imageBytes: Uint8Array<ArrayBuffer>
  ): Promise<WoundAnalysisResult | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Create canvas to process image
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Perform all analyses
      const metrics = analyzeWoundMetrics(imageData);
      const colorComp = analyzeColorComposition(imageData);
      const texture = analyzeTexture(imageData);
      const edgeSharpness = analyzeEdgeSharpness(imageData);
      const moisture = analyzeMoisture(imageData);

      const result: WoundAnalysisResult = {
        area: metrics.area,
        perimeter: metrics.perimeter,
        circularity: metrics.circularity,
        textureSmoothness: texture,
        edgeSharpness: edgeSharpness,
        exudateLevel: moisture,
        redPercentage: colorComp.red,
        pinkPercentage: colorComp.pink,
        yellowPercentage: colorComp.yellow,
        blackPercentage: colorComp.black,
        imageUrl,
        imageBlob: imageBytes
      };

      setIsAnalyzing(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setIsAnalyzing(false);
      return null;
    }
  };

  return {
    analyzeImage,
    isAnalyzing,
    error
  };
}
