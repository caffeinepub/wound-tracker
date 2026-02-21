import type { ColorComposition } from '../types/wound';

export function analyzeColorComposition(imageData: ImageData): ColorComposition {
  const { width, height, data } = imageData;
  const totalPixels = width * height;
  
  let redCount = 0;
  let pinkCount = 0;
  let yellowCount = 0;
  let blackCount = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to HSV for better color classification
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    const v = max / 255;
    const s = max === 0 ? 0 : delta / max;
    
    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        h = ((b - r) / delta + 2) / 6;
      } else {
        h = ((r - g) / delta + 4) / 6;
      }
    }
    
    // Classify colors based on HSV values
    if (v < 0.3) {
      // Black/necrotic tissue
      blackCount++;
    } else if (s < 0.2) {
      // Low saturation - could be pink/pale
      if (v > 0.7) {
        pinkCount++;
      } else {
        blackCount++;
      }
    } else {
      // Classify by hue
      if ((h >= 0 && h < 0.08) || (h >= 0.92 && h <= 1)) {
        // Red hue (0-30° or 330-360°)
        if (s > 0.4) {
          redCount++;
        } else {
          pinkCount++;
        }
      } else if (h >= 0.08 && h < 0.17) {
        // Yellow/orange hue (30-60°)
        yellowCount++;
      } else if (h >= 0.83 && h < 0.92) {
        // Pink/magenta hue (300-330°)
        pinkCount++;
      } else {
        // Other colors - distribute based on brightness
        if (v > 0.6) {
          pinkCount++;
        } else {
          blackCount++;
        }
      }
    }
  }
  
  return {
    red: (redCount / totalPixels) * 100,
    pink: (pinkCount / totalPixels) * 100,
    yellow: (yellowCount / totalPixels) * 100,
    black: (blackCount / totalPixels) * 100
  };
}
